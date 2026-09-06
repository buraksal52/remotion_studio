package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

const (
	exitSuccess        = 0
	exitRuntime        = 1
	exitInvalidProject = 2
	exitSchema         = 3
	exitSemantic       = 4
	exitCapability     = 5
	exitRender         = 6
)

func main() {
	if len(os.Args) < 2 {
		usage()
		os.Exit(exitRuntime)
	}
	root := projectRoot()
	command, args := os.Args[1], os.Args[2:]
	exitCode := exitSuccess

	switch command {
	case "version":
		fmt.Println("motion 0.1.0")
	case "node":
		exitCode = runNode(args)
	case "new":
		exitCode = newProject(root, args)
	case "compile":
		exitCode = runRuntime(root, "compile-markdown", args)
	case "agent":
		exitCode = agentCommand(root, args)
	case "validate", "inspect", "capabilities":
		exitCode = runRuntime(root, command, args)
	case "preview":
		exitCode = preview(root, args)
	case "render":
		exitCode = render(root, args)
	case "doctor":
		exitCode = doctor(root, args)
	case "plugins":
		exitCode = marketplaceCommand(root, args, false)
	case "plugin":
		exitCode = marketplaceCommand(root, args, true)
	default:
		fmt.Fprintf(os.Stderr, "unknown command: %s\n", command)
		usage()
		exitCode = exitRuntime
	}
	if exitCode != exitSuccess {
		os.Exit(exitCode)
	}
}

func projectRoot() string {
	if configuredRoot := os.Getenv("MOTION_STUDIO_ROOT"); configuredRoot != "" {
		return configuredRoot
	}
	root, err := os.Getwd()
	if err != nil {
		return "."
	}
	return root
}

func runNode(args []string) int {
	if err := runCommand("node", args, "", os.Environ()); err != nil {
		return commandExitCode(err)
	}
	return exitSuccess
}

func runRuntime(root, command string, args []string) int {
	workspace := workspaceRoot(root)
	env := append(os.Environ(), "MOTION_STUDIO_ROOT="+root)
	commandArgs := []string{"--filter", "@motion-studio/runtime", "exec", "node", "--import", "tsx", "src/index.ts", command}
	commandArgs = append(commandArgs, args...)
	if err := runCommand("pnpm", commandArgs, filepath.Join(workspace, "packages/runtime"), env); err != nil {
		code := commandExitCode(err)
		if code == exitCapability || code == exitSchema || code == exitSemantic {
			return code
		}
		return exitInvalidProject
	}
	return exitSuccess
}

func marketplaceCommand(root string, args []string, singular bool) int {
	action := "list"
	if len(args) > 0 {
		action = args[0]
	}
	if singular && action == "list" {
		fmt.Fprintln(os.Stderr, "usage: motion plugin <add|remove|update|search> <plugin-id>")
		return exitRuntime
	}
	if !singular && action != "list" && action != "search" {
		fmt.Fprintln(os.Stderr, "usage: motion plugins [list|search] [query]")
		return exitRuntime
	}
	if singular {
		switch action {
		case "add":
			action = "install"
		case "remove", "update", "search":
		default:
			fmt.Fprintf(os.Stderr, "unknown plugin action: %s\n", action)
			return exitRuntime
		}
	}
	commandArgs := append([]string{action}, args[1:]...)
	return runRuntime(root, "marketplace", commandArgs)
}

func agentCommand(root string, args []string) int {
	if len(args) == 0 || args[0] == "--json" {
		fmt.Fprintln(os.Stderr, "usage: motion agent <prompt> [--output path] [--preview|--render] [--json]")
		return exitRuntime
	}
	output := flagValue(args, "--output")
	if output == "" {
		output = filepath.Join("out", "agent-storyboard.json")
		args = append(args, "--output", output)
	}
	code := runRuntime(root, "agent", args)
	if code != exitSuccess {
		return code
	}
	storyboardArgs := []string{"--storyboard", output}
	if hasFlag(args, "--preview") {
		return preview(root, storyboardArgs)
	}
	if hasFlag(args, "--render") {
		return render(root, append(storyboardArgs, "--output", outputPath(root, []string{"--output", filepath.Join("out", "agent.mp4")})))
	}
	return exitSuccess
}

func preview(root string, args []string) int {
	storyboard, err := discoverStoryboard(root, args)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return exitInvalidProject
	}
	if code := runRuntime(root, "validate", storyboardFlag(args, storyboard)); code != exitSuccess {
		return code
	}
	workspace := workspaceRoot(root)
	entrypoint, cleanup, err := prepareRenderEntrypoint(workspace, storyboard)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return exitRender
	}
	defer cleanup()
	commandArgs := []string{"--filter", "@motion-studio/runtime", "exec", "remotion", "studio", entrypoint}
	if port := flagValue(args, "--port"); port != "" {
		commandArgs = append(commandArgs, "--port", port)
	}
	if err := runCommand("pnpm", commandArgs, filepath.Join(workspace, "packages/runtime"), os.Environ()); err != nil {
		return exitRender
	}
	return exitSuccess
}

func render(root string, args []string) int {
	storyboard, err := discoverStoryboard(root, args)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return exitInvalidProject
	}
	if code := runRuntime(root, "validate", storyboardFlag(args, storyboard)); code != exitSuccess {
		return code
	}
	output := outputPath(root, args)
	if err := os.MkdirAll(filepath.Dir(output), 0o755); err != nil {
		fmt.Fprintln(os.Stderr, err)
		return exitRender
	}
	workspace := workspaceRoot(root)
	entrypoint, cleanup, err := prepareRenderEntrypoint(workspace, storyboard)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return exitRender
	}
	defer cleanup()
	commandArgs := []string{"--filter", "@motion-studio/runtime", "exec", "remotion", "render", entrypoint, "MotionStudioStoryboard", output}
	if err := runCommand("pnpm", commandArgs, filepath.Join(workspace, "packages/runtime"), os.Environ()); err != nil {
		return exitRender
	}
	return exitSuccess
}

func doctor(root string, args []string) int {
	checks := map[string]any{"node": commandAvailable("node"), "pnpm": commandAvailable("pnpm"), "projectRoot": root, "storyboard": storyboardExists(root)}
	if hasFlag(args, "--json") {
		encoded, _ := json.MarshalIndent(checks, "", "  ")
		fmt.Println(string(encoded))
	} else {
		for key, value := range checks {
			fmt.Printf("%-12s %v\n", key, value)
		}
	}
	if !checks["node"].(bool) || !checks["pnpm"].(bool) || !checks["storyboard"].(bool) {
		return exitInvalidProject
	}
	return exitSuccess
}

func newProject(root string, args []string) int {
	if len(args) != 1 || !validProjectName(args[0]) {
		fmt.Fprintln(os.Stderr, "usage: motion new <name>")
		return exitRuntime
	}
	projectPath := filepath.Join(root, args[0])
	if _, err := os.Stat(projectPath); err == nil {
		fmt.Fprintf(os.Stderr, "project already exists: %s\n", projectPath)
		return exitRuntime
	}
	if err := os.MkdirAll(projectPath, 0o755); err != nil {
		fmt.Fprintln(os.Stderr, err)
		return exitRuntime
	}
	if err := os.WriteFile(filepath.Join(projectPath, "storyboard.json"), []byte(newStoryboard), 0o644); err != nil {
		fmt.Fprintln(os.Stderr, err)
		return exitRuntime
	}
	fmt.Printf("created Motion Studio project: %s\n", projectPath)
	return exitSuccess
}

func validProjectName(name string) bool {
	return name != "" && name != "." && name != ".." && filepath.Base(name) == name && !strings.ContainsAny(name, `/\\`)
}

func discoverStoryboard(root string, args []string) (string, error) {
	requested := flagValue(args, "--storyboard")
	candidates := []string{}
	if requested != "" {
		candidates = append(candidates, requested)
	} else if configured := os.Getenv("MOTION_STORYBOARD"); configured != "" {
		candidates = append(candidates, configured)
	} else {
		candidates = append(candidates, "storyboard.json", "examples/cache-hit/storyboard.json")
	}
	for _, candidate := range candidates {
		path := candidate
		if !filepath.IsAbs(path) {
			path = filepath.Join(root, path)
		}
		if _, err := os.Stat(path); err == nil {
			return path, nil
		}
	}
	return "", errors.New("no storyboard found; expected storyboard.json or examples/cache-hit/storyboard.json")
}

func storyboardExists(root string) bool {
	_, err := discoverStoryboard(root, nil)
	return err == nil
}

func workspaceRoot(projectRoot string) string {
	current, err := filepath.Abs(projectRoot)
	if err != nil {
		return projectRoot
	}
	for {
		if _, err := os.Stat(filepath.Join(current, "pnpm-workspace.yaml")); err == nil {
			return current
		}
		parent := filepath.Dir(current)
		if parent == current {
			return projectRoot
		}
		current = parent
	}
}

func outputPath(root string, args []string) string {
	output := flagValue(args, "--output")
	if output == "" {
		return filepath.Join(root, "out", "motion-studio.mp4")
	}
	if filepath.IsAbs(output) {
		return output
	}
	return filepath.Join(root, output)
}

func prepareRenderEntrypoint(workspace, storyboard string) (string, func(), error) {
	contents, err := os.ReadFile(storyboard)
	if err != nil {
		return "", func() {}, err
	}
	if !json.Valid(contents) {
		return "", func() {}, errors.New("storyboard is not valid JSON")
	}
	entrypoint := ".motion-render-entry.tsx"
	entryPath := filepath.Join(workspace, "packages/runtime", entrypoint)
	source := "import React from \"react\";\nimport {Composition, registerRoot} from \"remotion\";\nimport {compileStoryboard} from \"@motion-studio/compiler\";\nimport {MotionStudioComposition} from \"@motion-studio/renderer-remotion\";\nconst plan = compileStoryboard(" + string(contents) + ");\nregisterRoot(() => <Composition component={MotionStudioComposition} defaultProps={{plan}} durationInFrames={plan.durationInFrames} fps={plan.fps} height={plan.height} id=\"MotionStudioStoryboard\" width={plan.width} />);\n"
	if err := os.WriteFile(entryPath, []byte(source), 0o600); err != nil {
		return "", func() {}, err
	}
	return entrypoint, func() { _ = os.Remove(entryPath) }, nil
}

func storyboardFlag(args []string, storyboard string) []string {
	if hasFlag(args, "--storyboard") {
		return args
	}
	return append(args, "--storyboard", storyboard)
}

func flagValue(args []string, name string) string {
	for index := 0; index+1 < len(args); index++ {
		if args[index] == name {
			return args[index+1]
		}
	}
	return ""
}

func hasFlag(args []string, name string) bool {
	for _, arg := range args {
		if arg == name {
			return true
		}
	}
	return false
}

func commandAvailable(name string) bool {
	_, err := exec.LookPath(name)
	return err == nil
}

func runCommand(name string, args []string, dir string, env []string) error {
	command := exec.Command(name, args...)
	command.Dir = dir
	command.Env = env
	command.Stdin = os.Stdin
	command.Stdout = os.Stdout
	command.Stderr = os.Stderr
	return command.Run()
}

func commandExitCode(err error) int {
	var exitError *exec.ExitError
	if errors.As(err, &exitError) {
		return exitError.ExitCode()
	}
	return exitRuntime
}

func usage() {
	fmt.Fprintln(os.Stderr, "usage: motion <new|compile|agent|validate|inspect|capabilities|preview|render|doctor|plugins|plugin|version|node>")
}

const newStoryboard = `{
  "version": "0.1",
  "metadata": {"title": "Motion Studio Project", "fps": 30, "width": 1920, "height": 1080, "theme": "technical-dark"},
  "scenes": [{"id": "hero", "type": "hero", "intent": {"primary": "introduce-motion-studio", "tone": "technical"}, "layout": {"type": "center"}, "elements": [{"id": "title", "capability": "ui.hero-text", "props": {"text": "Motion Studio"}, "animation": [{"action": "enter"}]}]}]
}`

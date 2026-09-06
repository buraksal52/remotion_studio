import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {compileStoryboard} from "@motion-studio/compiler";
import {coreMotionPlugin} from "@motion-studio/core-motion";
import {productDemoPlugin} from "@motion-studio/product-demo";
import {PluginRegistry} from "@motion-studio/registry";
import {SemanticResolutionError, SemanticResolver} from "@motion-studio/resolver";
import {parseStoryboard} from "@motion-studio/schema";
import {technicalDiagramsPlugin} from "@motion-studio/technical-diagrams";

type RuntimeOptions = {
  json: boolean;
  scene?: string;
  intent?: string;
  storyboard?: string;
};

export function createDefaultRegistry(): PluginRegistry {
  const registry = new PluginRegistry("0.1.0");
  registry.register(coreMotionPlugin);
  registry.register(technicalDiagramsPlugin);
  registry.register(productDemoPlugin);
  return registry;
}

export function discoverStoryboard(projectRoot = process.cwd(), requestedPath?: string): string {
  const candidates = requestedPath
    ? [requestedPath]
    : [process.env.MOTION_STORYBOARD ?? "", "storyboard.json", "examples/cache-hit/storyboard.json"];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const path = resolve(projectRoot, candidate);
    try {
      readFileSync(path);
      return path;
    } catch {
      // Continue searching the documented locations.
    }
  }
  throw new Error("No storyboard found. Expected storyboard.json or examples/cache-hit/storyboard.json");
}

export function loadStoryboard(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function validateStoryboard(path: string) {
  const storyboard = parseStoryboard(loadStoryboard(path));
  const plan = compileStoryboard(storyboard);
  const resolver = new SemanticResolver(createDefaultRegistry());
  for (const scene of plan.scenes) {
    for (const element of scene.elements) {
      resolver.resolve({capability: element.capability, sceneType: scene.type, intents: scene.sceneIntent, theme: scene.theme});
    }
    if (scene.timeline.some((event) => event.action === "connect")) {
      resolver.resolve({capability: "diagram.connection.request", sceneType: scene.type, intents: scene.sceneIntent, theme: scene.theme});
    }
  }
  return {storyboard, plan};
}

function parseOptions(args: string[]): RuntimeOptions {
  const options: RuntimeOptions = {json: args.includes("--json")};
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--scene") options.scene = args[index + 1];
    if (args[index] === "--intent") options.intent = args[index + 1];
    if (args[index] === "--storyboard") options.storyboard = args[index + 1];
  }
  return options;
}

function print(value: unknown, json: boolean): void {
  console.log(json ? JSON.stringify(value, null, 2) : typeof value === "string" ? value : JSON.stringify(value, null, 2));
}

export function runRuntime(command: string, args: string[], projectRoot = process.cwd()): void {
  const options = parseOptions(args);
  if (command === "inspect" && !options.scene && args[0] && !args[0].startsWith("--")) {
    options.scene = args[0];
  }
  if (command === "validate") {
    const path = discoverStoryboard(projectRoot, options.storyboard);
    const result = validateStoryboard(path);
    print({valid: true, storyboard: path, scenes: result.plan.scenes.length, durationInFrames: result.plan.durationInFrames}, options.json);
    return;
  }

  if (command === "inspect") {
    const path = discoverStoryboard(projectRoot, options.storyboard);
    const result = validateStoryboard(path);
    const scenes = options.scene ? result.plan.scenes.filter((scene) => scene.id === options.scene) : result.plan.scenes;
    if (options.scene && scenes.length === 0) throw new Error(`Scene "${options.scene}" was not found`);
    print({storyboard: path, scenes}, options.json);
    return;
  }

  if (command === "capabilities") {
    const resolver = new SemanticResolver(createDefaultRegistry());
    const registry = createDefaultRegistry();
    const capabilities = registry.listCapabilities().map((capability) => ({
      capability,
      providers: (options.scene || options.intent
        ? resolver.eligible({capability, sceneType: options.scene, intents: options.intent ? [options.intent] : []})
        : registry.providersFor(capability).map((provider) => ({provider, score: provider.component.priority ?? 0, reasons: []})))
        .map((candidate) => ({plugin: candidate.provider.plugin.id, component: candidate.provider.component.id, score: candidate.score, reasons: candidate.reasons})),
    }));
    print({capabilities}, options.json);
    return;
  }

  throw new Error(`Unknown runtime command "${command}"`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    runRuntime(process.argv[2] ?? "", process.argv.slice(3), process.env.MOTION_STUDIO_ROOT ?? process.cwd());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = error instanceof SemanticResolutionError ? 5 : 3;
  }
}

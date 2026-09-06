# CLI Specification

## Purpose

The CLI is the first user interface for Motion Studio.

It should prove the product's engine before a desktop GUI is built.

The CLI is planned in Go.

## Responsibility

The Go CLI handles:
- command parsing
- filesystem operations
- project discovery
- config
- process orchestration
- calling TypeScript/Node runtime
- render process management
- plugin installation orchestration
- diagnostics

It should **not** reimplement:
- storyboard validation
- semantic resolution
- timeline compilation
- layout compilation
- motion logic

Those belong to the TypeScript core.

## Initial Commands

### Project

```bash
motion new <name>
motion inspect [scene]
motion doctor
```

### Validation

```bash
motion validate
```

### Rendering

```bash
motion preview
motion render
```

### Capabilities

```bash
motion capabilities
motion capabilities --intent processing
motion capabilities --scene product-demo
```

### Plugins

```bash
motion plugins list
motion plugin add <package>
motion plugin remove <package>
```

## Agent-Friendly Output

CLI commands should support machine-readable output.

Example:

```bash
motion capabilities --intent processing --json
```

This enables Claude Code / Codex to query the system without reading registry internals.

## CLI Architecture

```text
Go CLI
  ↓
project/process orchestration
  ↓
Node/TypeScript entrypoint
  ↓
Motion Core
  ↓
Remotion
```

## Exit Codes

Use predictable exit codes.

Suggested:
- `0` success
- `1` generic runtime failure
- `2` invalid project
- `3` schema validation failure
- `4` semantic validation failure
- `5` unresolved capability
- `6` render failure

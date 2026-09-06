# Motion Studio Backlog

This document tracks work defined by `docs/ROADMAP.md`. A phase is marked
complete only after all of its roadmap deliverables, exit criteria, and
required tests are complete.

## Phase 0 — Bootstrap

Status: Complete

### Deliverables

- [x] pnpm workspace
- [x] Turborepo configuration
- [x] TypeScript configuration
- [x] Vitest configuration through package scripts
- [x] Example Remotion composition
- [x] Basic Go CLI skeleton
- [x] Go CLI can invoke a Node process
- [x] One command runs tests
- [x] One command launches a Remotion example

### Validation

- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] TypeScript build passes
- [x] Remotion example launches
- [x] Go CLI invokes Node successfully

## Phase 1 — Storyboard IR

Status: Complete

### Deliverables

- [x] Storyboard schema
- [x] Scene schema
- [x] Element schema
- [x] Motion action schema
- [x] Layout schema
- [x] Timeline event schema
- [x] Zod validation
- [x] Hero fixture storyboard
- [x] API → Redis cache-flow fixture storyboard
- [x] Schema documentation

### Validation

- [x] Valid storyboard parses
- [x] Invalid fields fail
- [x] Unknown enum values fail
- [x] Version mismatch fails
- [x] Useful validation errors are exposed
- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] Existing Phase 0 behavior remains intact

## Phase 2 — Deterministic Remotion Rendering

Status: Complete

### Deliverables

- [x] Basic Storyboard compiler
- [x] RenderPlan model
- [x] Remotion adapter
- [x] Two usable scene types: `hero` and `request-flow`
- [x] Reusable visual components: HeroText, ServiceNode, DatabaseNode, Connection
- [x] Motion primitives: fade, slide, scale, spring, draw
- [x] Storyboard-driven cache-hit render example

### Validation

- [x] Compiler output is deterministic
- [x] Timeline dependencies compile to frame ranges
- [x] Timeline cycles are rejected
- [x] Unknown timeline element references are rejected
- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] TypeScript build passes
- [x] Go CLI regression tests pass
- [x] Cache-hit Storyboard renders to MP4 without AI

## Phase 3 — Plugin Runtime

Status: Complete

### Deliverables

- [x] `definePlugin`
- [x] Plugin SDK contracts
- [x] Plugin registry
- [x] Capability registration
- [x] Deterministic provider resolution
- [x] Plugin/core compatibility metadata
- [x] Built-in `core-motion` plugin
- [x] Renderer resolves components through the registry

### Validation

- [x] Plugins register successfully
- [x] Duplicate plugin IDs are rejected
- [x] Duplicate component IDs are rejected
- [x] Capability providers resolve deterministically
- [x] Incompatible plugins are rejected
- [x] Same cache-hit storyboard resolves through a plugin
- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] TypeScript build passes
- [x] Go CLI regression tests pass
- [x] Render regression passes

## Phase 4 — Semantic Resolution

Status: Complete

### Deliverables

- [x] Component semantic metadata
- [x] `intents`
- [x] `useWhen`
- [x] `doNotUseWhen`
- [x] `allowedScenes`
- [x] `forbiddenScenes`
- [x] Required context rules
- [x] Deterministic resolver scoring
- [x] Semantic validation errors
- [x] Eligible capability inspection
- [x] Renderer integration

### Validation

- [x] Valid component use resolves
- [x] Forbidden component use is rejected
- [x] Incompatible scene use is rejected
- [x] Resolver lists eligible components
- [x] Intent and scene scoring is deterministic
- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] TypeScript build passes
- [x] Go CLI regression tests pass
- [x] Render regression passes

## Phase 5 — Timeline + Layout Compiler

Status: Complete

### Deliverables

- [x] Dependency-based timeline
- [x] Topological sort
- [x] Cycle detection
- [x] Explicit start handling
- [x] Multiple dependency handling
- [x] Frame compilation
- [x] Center/split/flow/grid layouts
- [x] Deterministic graph layout prototype

### Validation

- [x] Dependencies compile deterministically
- [x] Multiple dependencies wait for the latest predecessor
- [x] Explicit starts are respected
- [x] Cycles are rejected
- [x] All basic layouts produce complete positions
- [x] Graph LR/TB output is deterministic
- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] TypeScript build passes
- [x] Go CLI regression tests pass
- [x] Render regression passes

## Phase 6 — Go CLI MVP

Status: Complete

### Deliverables

- [x] `motion new`
- [x] `motion validate`
- [x] `motion inspect`
- [x] `motion capabilities`
- [x] `motion preview`
- [x] `motion render`
- [x] `motion doctor`
- [x] Machine-readable JSON output
- [x] Node/TypeScript runtime orchestration
- [x] Predictable exit codes

### Validation

- [x] CLI discovers a project storyboard
- [x] CLI validates through TypeScript runtime
- [x] CLI inspects scenes
- [x] CLI lists capabilities and filters by intent/scene
- [x] CLI creates a new project
- [x] CLI render workflow succeeds
- [x] CLI JSON output is parseable
- [x] Invalid project exit code is predictable
- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] TypeScript build passes
- [x] Go CLI regression tests pass
- [x] Render regression passes

## Phase 7 — Agent Integration

Status: Complete

### Deliverables

- [x] Claude Code guidance in `CLAUDE.md`
- [x] Codex/agent guidance in `AGENTS.md`
- [x] Agent-oriented authoring and repair documentation
- [x] CLI capability discovery documented and usable as the first agent step
- [x] Agent-created valid Storyboard example
- [x] Safe Storyboard patch workflow documented

### Validation

- [x] Agent example passes schema, compiler, semantic, and capability validation
- [x] Agent can discover eligible capabilities through JSON CLI output
- [x] Validation repair loop is documented by error layer
- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] TypeScript build passes
- [x] Go CLI regression tests pass
- [x] Existing render path remains covered

## Phase 8 — Built-in Packs

Status: Complete

### Deliverables

- [x] `core-motion` baseline pack remains registered
- [x] `technical-diagrams` built-in pack
- [x] `product-demo` built-in pack
- [x] 6–8 supported scene types
- [x] 15–20 reusable components
- [x] 8–12 motion primitives/presets
- [x] 2–3 built-in themes
- [x] Several layouts remain supported

### Validation

- [x] All built-in packs register through the default registry
- [x] Pack capabilities resolve through semantic rules
- [x] Pack examples validate and render
- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] TypeScript build passes
- [x] Go CLI regression tests pass
- [x] Render regression passes

## Phase 9 — Markdown / Declarative Authoring

Status: Not started

## Phase 10 — Desktop GUI

Status: Not started

## Phase 11 — Plugin SDK Maturity

Status: Not started

## Phase 12 — Marketplace

Status: Not started

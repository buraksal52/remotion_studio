# Roadmap

## Phase 0 — Bootstrap

Goal: establish repository and tooling.

Deliverables:
- pnpm workspace
- Turborepo
- TypeScript config
- Vitest
- example Remotion composition
- basic Go CLI skeleton
- architecture docs committed

Exit criteria:
- one command runs tests
- one command launches a Remotion example
- Go CLI can invoke a Node process

---

## Phase 1 — Storyboard IR

Goal: define the smallest useful intermediate representation.

Deliverables:
- Storyboard schema
- Scene schema
- Element schema
- Motion action schema
- Layout schema
- Timeline event schema
- Zod validation

Do not add AI yet.

Exit criteria:
- valid example storyboard parses
- malformed storyboard produces useful errors
- schema is documented

---

## Phase 2 — Deterministic Remotion Rendering

Goal: render a hand-written storyboard.

Deliverables:
- basic compiler
- RenderPlan model
- Remotion adapter
- 2 scene types
- 4-6 primitive components
- 3-5 motion primitives

Exit criteria:
- `storyboard.json` renders to MP4
- no agent is required

This is the first major technical milestone.

---

## Phase 3 — Plugin Runtime

Goal: remove hard-coded component ownership from core.

Deliverables:
- `definePlugin`
- plugin registry
- capability registration
- provider resolution
- plugin compatibility metadata
- built-in `core-motion` plugin

Exit criteria:
- same storyboard can resolve components from a plugin
- plugin can be added without editing Motion Core

---

## Phase 4 — Semantic Resolution

Goal: constrain agent/component choice.

Deliverables:
- intents
- use_when
- do_not_use_when
- allowed scenes
- forbidden scenes
- resolver scoring
- semantic validation errors

Exit criteria:
- invalid component use is rejected
- resolver can list eligible components for a scene/intent

---

## Phase 5 — Timeline + Layout Compiler

Goal: move timing and positioning out of agents.

Deliverables:
- dependency-based timeline
- topological sort
- cycle detection
- frame compilation
- center/split/flow/grid layouts
- optional graph layout prototype

Exit criteria:
- scene can be authored without pixel coordinates
- event dependencies compile deterministically

---

## Phase 6 — Go CLI MVP

Goal: make the system usable without editing internals.

Deliverables:
- `motion new`
- `motion validate`
- `motion inspect`
- `motion capabilities`
- `motion preview`
- `motion render`
- `motion doctor`
- JSON output mode

Exit criteria:
- complete basic project workflow from CLI

---

## Phase 7 — Agent Integration

Goal: make Claude Code / Codex effective users of the platform.

Deliverables:
- CLAUDE.md
- AGENTS.md
- agent-oriented docs
- CLI capability discovery
- examples
- safe storyboard patch workflow

Exit criteria:
- agent can create a valid storyboard using existing capabilities
- agent can fix validation failures
- agent rarely needs to write raw Remotion code

---

## Phase 8 — Built-in Packs

Goal: prove extensibility.

Initial packs:
1. `core-motion`
2. `technical-diagrams`
3. `product-demo`

Target:
- 6-8 scene types total
- 15-20 components
- 8-12 motion presets/primitives
- 2-3 themes
- several layouts

---

## Phase 9 — Markdown / Declarative Authoring

Goal: add a human-friendly authoring format.

Example:

```md
# How RAG Works

:::architecture
User -> Embedding -> VectorDB -> LLM
:::
```

Exit criteria:
- Markdown compiles to the same Storyboard IR

---

## Phase 10 — Desktop GUI

Technology:
- Tauri
- React
- TypeScript
- Remotion Player

Initial UI:
- project explorer
- scene list
- live preview
- inspector
- simple timeline visualization
- AI prompt panel
- render manager
- plugin manager

Important:
GUI must use the same core services as CLI.

---

## Phase 11 — Plugin SDK Maturity

Goal:
allow third-party plugin authors.

Deliverables:
- public SDK
- examples
- versioning policy
- compatibility checks
- plugin dev template
- testing harness

---

## Phase 12 — Marketplace

Only after the plugin ecosystem is proven.

Possible features:
- discovery
- install/update/remove
- ratings
- paid packs
- templates
- creator revenue share

Marketplace is not a prerequisite for project success.

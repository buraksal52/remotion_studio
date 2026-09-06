# Proposed Project Structure

```text
motion-studio/
├── apps/
│   └── desktop/                  # Later: Tauri + React
│
├── cmd/
│   └── motion/                   # Go CLI
│
├── packages/
│   ├── schema/                   # Storyboard and plugin schemas
│   ├── core/                     # Domain models and orchestration
│   ├── compiler/                 # Timeline/layout/render-plan compilation
│   ├── registry/                 # Plugin/capability registry
│   ├── resolver/                 # Semantic capability resolution
│   ├── plugin-sdk/               # definePlugin, defineComponent, contracts
│   ├── renderer-remotion/        # Remotion adapter
│   └── plugins/
│       ├── core-motion/
│       ├── technical-diagrams/
│       └── product-demo/
│
├── examples/
│   ├── cache-hit/
│   └── rag-explainer/
│
├── docs/
├── AGENTS.md
├── CLAUDE.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Dependency Direction

Preferred:

```text
schema
  ↑
core
  ↑
registry / resolver / compiler
  ↑
renderer-remotion

plugin-sdk → schema/core contracts
plugins → plugin-sdk
desktop → public core APIs
CLI → public runtime entrypoints
```

Avoid circular dependencies.

## Important Boundary

`renderer-remotion` may depend on Remotion.

`core`, `schema`, `registry`, and `resolver` should not.

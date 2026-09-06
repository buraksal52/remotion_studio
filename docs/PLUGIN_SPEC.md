# Plugin System Specification

## Goal

Plugins extend the system's visual vocabulary without modifying Motion Core.

A plugin may provide:
- components
- scenes
- layouts
- motion presets
- animation primitives
- transitions
- themes
- templates
- agent-facing usage metadata

## Core Principle

A plugin is not only code.

It is:

> implementation + capability + semantic contract + validation rules

## Draft API

```ts
definePlugin({
  id: "@motion/technical-diagrams",
  version: "0.1.0",
  core: "^0.1.0",
  sdk: "^0.1.0",
  capabilities: [],
  themes: [],
  presets: []
});
```

Plugin versions are exact semantic versions. `core` and optional `sdk`
compatibility ranges support exact versions, `^`, `~`, and `*`. The SDK
validates the definition when it is created; the registry validates it again at
the installation boundary.

## Component Definition

```ts
defineComponent({
  id: "premium-loader",
  capability: "ui.loading",

  intents: [
    "processing",
    "waiting",
    "data-fetching"
  ],

  allowedScenes: [
    "product-demo",
    "workflow",
    "process"
  ],

  forbiddenScenes: [
    "hero",
    "ending"
  ],

  schema: z.object({
    label: z.string().optional()
  }),

  component: PremiumLoader
});
```

## Semantic Metadata

Every component exposed to agent selection should describe:

### Capability
What does it provide?

Example:

```text
ui.loading
```

### Use when
Examples of valid semantic contexts.

### Do not use when
Explicit negative guidance.

### Compatible scene types
Hard compatibility constraints when appropriate.

### Required context
Conditions that must exist.

Example:
A loading component may require a waiting or processing state.

## Resolution

Storyboard asks for:

```text
ui.loading
```

Registry may contain:

```text
SimpleLoader
PremiumLoader
ProcessingOrb
SkeletonLoader
```

Resolver filters them by:
1. capability
2. scene compatibility
3. semantic intent
4. theme compatibility
5. project preference
6. deterministic priority score

## Initial Scoring

Avoid embeddings in the MVP.

Example:

```text
intent match       +5
scene match        +3
theme match        +2
preferred plugin   +2
default provider   +1
```

Hard incompatibility always wins over score.

## Plugin Types

### MVP
Native plugins only.

Native plugins may execute TypeScript/React code.

### Future
Two trust levels:

#### Declarative plugin
Uses approved DSL/primitives.

#### Native plugin
Runs executable code and requires trust.

## Marketplace Compatibility

The plugin SDK should eventually support:
- semantic versioning
- core compatibility range
- plugin ID
- package metadata
- capability discovery
- install/update/remove
- validation before activation

Marketplace itself is explicitly out of MVP scope.

## Plugin authoring and conformance

Third-party plugins should start from `templates/plugin`. A plugin package
should export its `definePlugin` result and test it with
`testPluginConformance`. The harness is dependency-free and returns stable
diagnostics suitable for CI. Native plugins are trusted executable code and
remain distinct from a future sandboxed/declarative plugin type.

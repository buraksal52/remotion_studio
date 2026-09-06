# CLAUDE.md

You are working inside Motion Studio.

Motion Studio is not a generic Remotion code generation repository.

It is a declarative motion system where:

- the agent decides what should happen;
- the Motion Engine decides how it should happen;
- Remotion renders the result.

## Working Model

Prefer editing Storyboard IR and using registered capabilities.

Before implementing custom animation code, ask:

1. Does an installed capability already provide this?
2. Can an existing component be combined with a motion preset?
3. Is the requested behavior reusable enough to belong in a plugin?
4. Would adding this to core create accidental complexity?

## Storyboard Rules

Prefer:
- semantic actions
- semantic capabilities
- dependency-based timing
- layout abstractions

Avoid:
- raw CSS
- arbitrary coordinates
- custom interpolation values inside Storyboards
- Remotion-specific code inside IR

## Plugin Rules

Every agent-selectable component should define:
- capability
- valid intents
- invalid/forbidden contexts where useful
- prop schema
- implementation

A visually attractive component is not automatically semantically valid.

## Build Order

Current priority:

1. Storyboard schema
2. deterministic rendering
3. plugin registry
4. semantic resolver
5. timeline/layout compiler
6. Go CLI
7. agent workflow
8. built-in packs
9. Markdown
10. desktop

Do not jump to marketplace or full GUI early.

## Definition of Good Progress

A good change:
- reduces one-off code;
- increases reuse;
- preserves deterministic behavior;
- has tests;
- has clear boundaries;
- does not make the core aware of UI-specific concerns.

## Agent Workflow

Follow `docs/AGENT_WORKFLOW.md` for capability discovery, safe Storyboard
patches, and validation repair. The normal loop is:

```text
capabilities → focused Storyboard edit → validate → preview/render
```

Use `examples/agent-created/storyboard.json` as a minimal reference. If a
validation error occurs, repair the Storyboard at the layer reported by the
error instead of bypassing the registry or writing raw Remotion code.

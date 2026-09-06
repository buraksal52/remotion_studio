# AGENTS.md

## Project

Motion Studio is an AI-native, plugin-based motion graphics system.

## Core Rule

Do not generate arbitrary animation implementations when an existing capability, component, scene, layout, preset, or primitive can satisfy the requirement.

Prefer:

```text
intent → capability → storyboard → validation → runtime
```

over:

```text
prompt → custom React/CSS animation
```

## Before Editing a Storyboard

1. Inspect the target scene.
2. Inspect available capabilities relevant to the requested intent.
3. Respect plugin semantic rules.
4. Prefer existing components.
5. Prefer semantic actions over primitive motion values.
6. Validate after changes.

## Do Not

- introduce raw CSS animation into Storyboard IR
- hard-code pixel positions without a strong reason
- bypass semantic validation
- bypass plugin registry
- modify Motion Core just to satisfy one video
- create duplicate components when a reusable capability exists
- couple core packages to desktop UI

## When New Code Is Appropriate

Create a new component/plugin/preset only when:
- no existing capability can express the requirement;
- the behavior is reusable;
- it belongs to the correct package;
- its semantic usage contract is documented.

## Architectural Priority

When choosing between a quick one-off solution and a reusable engine feature:

- choose the reusable feature only if it solves a recurring class of problems;
- otherwise keep the one-off behavior local to the project.

Avoid accidental framework expansion.

## Validation

Every Storyboard modification must pass:
1. schema validation
2. referential validation
3. semantic validation
4. capability resolution

## Current Priority

The current project priority is core engine correctness.

Do not implement:
- marketplace
- cloud collaboration
- billing
- TTS/music system
- complex GUI
unless explicitly requested.

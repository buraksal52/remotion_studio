# `@motion-studio/schema`

This package defines the versioned Storyboard IR shared by authoring systems
and the Motion Studio runtime.

The schema is intentionally limited to declarative information:

- storyboard metadata
- scenes and scene intent
- semantic element capabilities
- semantic animation actions
- dependency-based timeline events
- abstract layout requests

It does not contain React, Remotion, CSS, pixel-level animation values, or
component implementation details.

Use `StoryboardSchema.safeParse(value)` when diagnostics are needed, or
`parseStoryboard(value)` when invalid input should throw a Zod error.

# `@motion-studio/compiler`

The compiler converts validated Storyboard IR into a deterministic RenderPlan.
It owns timeline dependency resolution and abstract layout compilation. It has
no dependency on React or Remotion.

Scene and timeline durations are expressed in frames. When no duration is
provided, the compiler uses deterministic defaults.

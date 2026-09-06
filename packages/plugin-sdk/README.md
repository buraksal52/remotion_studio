# `@motion-studio/plugin-sdk`

The plugin SDK defines the public contract for native Motion Studio plugins.
It describes plugin identity, core and SDK compatibility, capabilities,
semantic provider components, and a dependency-free conformance test harness.

Use `definePlugin` and `defineComponent` in plugin source. Use
`testPluginConformance` in package tests or CI, and let the registry perform
the final runtime validation when a plugin is installed.

Supported compatibility ranges are exact versions, `^` minor-compatible
ranges, `~` patch-compatible ranges, and `*`. Plugin versions themselves must
be exact `major.minor.patch` versions.

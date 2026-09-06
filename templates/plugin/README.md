# Motion Studio Plugin Template

Copy this directory into a plugin package and replace the placeholder ID,
capabilities, component, and semantic metadata. The template demonstrates the
public `@motion-studio/plugin-sdk` contract and includes a build script.

Every plugin should export a `definePlugin(...)` result and add a small test:

```ts
import {expect, it} from "vitest";
import {examplePluginConformance} from "./index";

it("conforms to the Motion Studio plugin contract", () => {
  expect(examplePluginConformance.valid).toBe(true);
});
```

The registry performs the same validation at runtime, including core and SDK
version compatibility. Native plugins are trusted executable code; do not
install one unless its source is trusted.

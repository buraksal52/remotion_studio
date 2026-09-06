import {describe, expect, it} from "vitest";
import {createDefaultRegistry} from "./components";

describe("Remotion adapter plugin integration", () => {
  it("resolves built-in components through the registry", () => {
    const registry = createDefaultRegistry();

    expect(registry.resolve("diagram.node.service").plugin.id).toBe("@motion-studio/core-motion");
    expect(registry.resolve("diagram.node.database").plugin.id).toBe("@motion-studio/core-motion");
    expect(registry.resolve("diagram.connection.request").plugin.id).toBe("@motion-studio/core-motion");
  });
});

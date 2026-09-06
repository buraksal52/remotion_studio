import {describe, expect, it} from "vitest";
import {defineComponent, definePlugin, isCoreCompatible, testPluginConformance} from "./index";

const Component = () => null;

describe("plugin SDK", () => {
  it("defines a plugin with declared capabilities", () => {
    const plugin = definePlugin({
      id: "test-plugin",
      version: "0.1.0",
      core: "^0.1.0",
      capabilities: ["test.card"],
      components: [defineComponent({id: "test-card", capability: "test.card", intents: ["testing"], component: Component})],
    });

    expect(plugin.id).toBe("test-plugin");
  });

  it("rejects components whose capabilities are not declared", () => {
    expect(() =>
      definePlugin({
        id: "invalid-plugin",
        version: "0.1.0",
        core: "^0.1.0",
        capabilities: ["test.card"],
        components: [defineComponent({id: "other", capability: "test.other", component: Component})],
      }),
    ).toThrow(/does not declare capability/);
  });

  it("rejects malformed component definitions early", () => {
    expect(() => defineComponent({id: "", capability: "test.card", component: Component})).toThrow(/must not be empty/);
    expect(() => defineComponent({id: "missing-implementation", capability: "test.card", component: null as never})).toThrow(/implementation/);
  });

  it("supports deterministic plugin conformance checks", () => {
    const invalid = {
      id: "invalid",
      version: "0.1",
      core: "^0.1.0",
      capabilities: ["test.card", "test.card"],
      components: [],
    };
    expect(testPluginConformance(invalid)).toEqual({
      valid: false,
      errors: [
        'plugin "invalid" has an invalid version "0.1"',
        'plugin "invalid" must provide at least one component',
        'plugin "invalid" declares duplicate capabilities',
      ],
    });
  });

  it("checks exact, caret, tilde, and wildcard compatibility", () => {
    expect(isCoreCompatible("^0.1.0", "0.1.9")).toBe(true);
    expect(isCoreCompatible("^0.1.0", "0.2.0")).toBe(false);
    expect(isCoreCompatible("~0.1.2", "0.1.9")).toBe(true);
    expect(isCoreCompatible("~0.1.2", "0.2.0")).toBe(false);
    expect(isCoreCompatible("0.1.0", "0.1.1")).toBe(false);
    expect(isCoreCompatible("*", "0.1.1")).toBe(true);
  });
});

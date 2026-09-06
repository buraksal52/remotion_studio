import {describe, expect, it} from "vitest";
import {defineComponent, definePlugin} from "./index";

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
});

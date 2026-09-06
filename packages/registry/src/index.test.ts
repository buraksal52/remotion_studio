import {describe, expect, it} from "vitest";
import {defineComponent, definePlugin} from "@motion-studio/plugin-sdk";
import {PluginRegistry} from "./index";

const Component = () => null;

function plugin(id: string, priority = 0, core = "^0.1.0") {
  return definePlugin({
    id,
    version: "0.1.0",
    core,
    capabilities: ["test.card"],
    components: [defineComponent({id: `${id}-component`, capability: "test.card", priority, component: Component})],
  });
}

describe("PluginRegistry", () => {
  it("resolves the highest-priority provider deterministically", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("z-plugin", 1));
    registry.register(plugin("a-plugin", 1));
    registry.register(plugin("low-plugin", 0));

    expect(registry.resolve("test.card").plugin.id).toBe("a-plugin");
  });

  it("rejects duplicate plugin and component IDs", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("test-plugin"));
    expect(() => registry.register(plugin("test-plugin"))).toThrow(/already registered/);

    const secondRegistry = new PluginRegistry();
    secondRegistry.register(definePlugin({
      id: "first",
      version: "0.1.0",
      core: "^0.1.0",
      capabilities: ["test.card"],
      components: [defineComponent({id: "shared", capability: "test.card", component: Component})],
    }));
    expect(() => secondRegistry.register(definePlugin({
      id: "second",
      version: "0.1.0",
      core: "^0.1.0",
      capabilities: ["test.card"],
      components: [defineComponent({id: "shared", capability: "test.card", component: Component})],
    }))).toThrow(/already registered/);
  });

  it("rejects incompatible plugins and missing capabilities", () => {
    const registry = new PluginRegistry("0.1.0");
    expect(() => registry.register(plugin("future", 0, "^0.2.0"))).toThrow(/requires core/);
    expect(() => registry.resolve("missing.capability")).toThrow(/No provider/);
  });
});

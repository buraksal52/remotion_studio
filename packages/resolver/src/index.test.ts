import {describe, expect, it} from "vitest";
import {defineComponent, definePlugin} from "@motion-studio/plugin-sdk";
import {PluginRegistry} from "@motion-studio/registry";
import {SemanticResolutionError, SemanticResolver} from "./index";

const Component = () => null;

function setup() {
  const registry = new PluginRegistry();
  registry.register(definePlugin({
    id: "basic",
    version: "0.1.0",
    core: "^0.1.0",
    capabilities: ["ui.loader"],
    components: [defineComponent({id: "basic-loader", capability: "ui.loader", allowedScenes: ["process"], component: Component})],
  }));
  registry.register(definePlugin({
    id: "premium",
    version: "0.1.0",
    core: "^0.1.0",
    capabilities: ["ui.loader"],
    themes: ["technical-dark"],
    components: [defineComponent({id: "premium-loader", capability: "ui.loader", intents: ["processing"], useWhen: ["waiting"], forbiddenScenes: ["hero"], component: Component})],
  }));
  return new SemanticResolver(registry);
}

describe("SemanticResolver", () => {
  it("selects the highest deterministic semantic score", () => {
    const result = setup().resolve({capability: "ui.loader", sceneType: "process", intents: ["processing"], theme: "technical-dark"});
    expect(result.provider.component.id).toBe("premium-loader");
    expect(result.reasons).toEqual(["intent match +5", "theme match +2"]);
  });

  it("filters forbidden scene usage before scoring", () => {
    const resolver = setup();
    expect(() => resolver.resolve({capability: "ui.loader", sceneType: "hero", intents: ["processing"]})).toThrow(SemanticResolutionError);
    expect(resolver.eligible({capability: "ui.loader", sceneType: "hero"})).toHaveLength(0);
  });

  it("lists eligible providers and rejects missing capabilities", () => {
    expect(setup().eligible({capability: "ui.loader", sceneType: "process"})).toHaveLength(2);
    expect(() => setup().resolve({capability: "missing"})).toThrow(/capability is not registered/);
  });
});

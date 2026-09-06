import {describe, expect, it} from "vitest";
import {compatibleEntries, createEmptyState, installPlugin, isNewerVersion, removePlugin, searchCatalog, updatePlugin, validateCatalog} from "./index";

const catalog = {
  version: 1 as const,
  plugins: [
    {id: "@motion/alpha", name: "Alpha", version: "0.1.0", packageName: "@motion/alpha", description: "Technical diagrams", core: "^0.1.0", sdk: "^0.1.0", capabilities: ["diagram.alpha"]},
    {id: "@motion/future", name: "Future", version: "0.1.0", packageName: "@motion/future", description: "Future pack", core: "^0.2.0", capabilities: ["future"]},
  ],
};

describe("marketplace lifecycle", () => {
  it("validates, searches, and filters catalog entries", () => {
    expect(validateCatalog(catalog)).toEqual([]);
    expect(searchCatalog(catalog, "diagram").map((plugin) => plugin.id)).toEqual(["@motion/alpha"]);
    expect(compatibleEntries(catalog, "0.1.0", "0.1.0").map((plugin) => plugin.id)).toEqual(["@motion/alpha"]);
  });

  it("installs, updates, and removes plugins deterministically", () => {
    const installed = installPlugin(catalog, createEmptyState(), "@motion/alpha", "0.1.0", "0.1.0");
    expect(installed.state.plugins[0].version).toBe("0.1.0");
    const updatedCatalog = {...catalog, plugins: catalog.plugins.map((plugin) => plugin.id === "@motion/alpha" ? {...plugin, version: "0.1.1"} : plugin)};
    const updated = updatePlugin(updatedCatalog, installed.state, "@motion/alpha", "0.1.0", "0.1.0");
    expect(updated.state.plugins[0].version).toBe("0.1.1");
    expect(removePlugin(updated.state, "@motion/alpha").plugins).toEqual([]);
  });

  it("rejects incompatible or duplicate lifecycle operations", () => {
    expect(() => installPlugin(catalog, createEmptyState(), "@motion/future", "0.1.0", "0.1.0")).toThrow(/incompatible/);
    const installed = installPlugin(catalog, createEmptyState(), "@motion/alpha", "0.1.0", "0.1.0");
    expect(() => installPlugin(catalog, installed.state, "@motion/alpha", "0.1.0", "0.1.0")).toThrow(/already installed/);
    expect(isNewerVersion("0.1.1", "0.1.0")).toBe(true);
    expect(isNewerVersion("0.1.0", "0.1.1")).toBe(false);
  });
});

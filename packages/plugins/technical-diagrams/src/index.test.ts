import {describe, expect, it} from "vitest";
import {technicalDiagramsPlugin} from "./index";

describe("technical-diagrams plugin", () => {
  it("declares reusable technical capabilities and themes", () => {
    expect(technicalDiagramsPlugin.components).toHaveLength(6);
    expect(technicalDiagramsPlugin.themes).toEqual(["technical-dark", "clean-light"]);
    expect(technicalDiagramsPlugin.capabilities).toContain("diagram.node.gateway");
  });
});

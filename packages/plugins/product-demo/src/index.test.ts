import {describe, expect, it} from "vitest";
import {productDemoPlugin} from "./index";

describe("product-demo plugin", () => {
  it("declares product capabilities for the supported scene types", () => {
    expect(productDemoPlugin.components).toHaveLength(6);
    expect(productDemoPlugin.components.every((component) => component.allowedScenes?.length)).toBe(true);
    expect(productDemoPlugin.themes).toContain("product-dark");
  });
});

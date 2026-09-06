import {describe, expect, it} from "vitest";
import {examplePluginConformance} from "./index";

describe("plugin template", () => {
  it("conforms to the Motion Studio plugin contract", () => {
    expect(examplePluginConformance.valid).toBe(true);
    expect(examplePluginConformance.errors).toEqual([]);
  });
});

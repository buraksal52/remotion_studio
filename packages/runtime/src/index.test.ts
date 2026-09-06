import {describe, expect, it} from "vitest";
import {discoverStoryboard, validateStoryboard} from "./index";

describe("runtime", () => {
  it("discovers and validates the documented cache-hit fixture", () => {
    const storyboard = discoverStoryboard(process.cwd(), "../../examples/cache-hit/storyboard.json");
    const result = validateStoryboard(storyboard);
    expect(result.plan.scenes[0].id).toBe("cache-flow");
  });

  it("validates the agent-created example through the same runtime path", () => {
    const storyboard = discoverStoryboard(process.cwd(), "../../examples/agent-created/storyboard.json");
    const result = validateStoryboard(storyboard);
    expect(result.plan.scenes[0].id).toBe("request-flow");
    expect(result.plan.scenes[0].elements.map((element) => element.capability)).toEqual([
      "diagram.node.service",
      "diagram.node.database",
    ]);
  });
});

import {describe, expect, it} from "vitest";
import {planPrompt} from "./index";

describe("local agent planner", () => {
  it("creates a validated cache-flow storyboard from a prompt", () => {
    const result = planPrompt("Show an API request going to Redis and indicate a cache hit");
    expect(result.matchedIntent).toBe("explain-cache-hit");
    expect(result.storyboard.scenes[0].type).toBe("request-flow");
    expect(result.storyboard.scenes[0].timeline?.map((event) => event.action)).toEqual(["enter", "enter", "connect", "activate"]);
  });

  it("selects architecture, product, and safe hero fallback plans", () => {
    expect(planPrompt("Explain a RAG architecture").storyboard.scenes[0].type).toBe("architecture");
    expect(planPrompt("Show a product feature in a browser").storyboard.scenes[0].type).toBe("product-demo");
    expect(planPrompt("A calm introduction").storyboard.scenes[0].type).toBe("hero");
  });

  it("rejects an empty prompt", () => {
    expect(() => planPrompt("   ")).toThrow(/cannot be empty/);
  });
});

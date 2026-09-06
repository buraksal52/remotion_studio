import {describe, expect, it} from "vitest";
import {renderPlan} from "./index";

describe("Storyboard Remotion example", () => {
  it("compiles the cache-hit storyboard into the render contract", () => {
    expect({fps: renderPlan.fps, width: renderPlan.width, height: renderPlan.height}).toEqual({
      fps: 30,
      width: 1920,
      height: 1080,
    });
    expect(renderPlan.scenes[0].type).toBe("request-flow");
    expect(renderPlan.durationInFrames).toBeGreaterThan(0);
  });
});

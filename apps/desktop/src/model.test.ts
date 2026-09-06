import {describe, expect, it} from "vitest";
import {renderCommand, sceneSummary, timelinePercent} from "./model";

describe("desktop model helpers", () => {
  it("summarizes a render plan for the project explorer", () => {
    expect(sceneSummary({scenes: [{} as never], durationInFrames: 120, fps: 30, width: 1920, height: 1080, title: "Demo"})).toBe("1 scene · 120 frames · 30 fps");
  });

  it("creates a CLI render handoff", () => {
    expect(renderCommand("examples/demo/storyboard.json")).toBe("motion render --storyboard examples/demo/storyboard.json");
  });

  it("clamps timeline progress to the visible track", () => {
    expect(timelinePercent(30, 30, 120)).toBe(50);
    expect(timelinePercent(200, 20, 120)).toBe(100);
  });
});

import {describe, expect, it} from "vitest";
import {drawProgress, fadeProgress, scaleProgress, slideOffset, springProgress} from "./motion";

describe("motion primitives", () => {
  it("clamps fade progress to the requested interval", () => {
    expect(fadeProgress(-1, 0, 10)).toBe(0);
    expect(fadeProgress(5, 0, 10)).toBe(0.5);
    expect(fadeProgress(20, 0, 10)).toBe(1);
  });

  it("turns progress into a deterministic slide offset", () => {
    expect(slideOffset(0, 40)).toBe(40);
    expect(slideOffset(1, 40)).toBe(0);
  });

  it("produces a bounded scale pulse", () => {
    expect(scaleProgress(0, 0, 20)).toBe(0.94);
    expect(scaleProgress(10, 0, 20)).toBe(1.03);
    expect(scaleProgress(20, 0, 20)).toBe(1);
  });

  it("shares the draw timing contract with fade", () => {
    expect(drawProgress(6, 5, 10)).toBe(0.1);
  });

  it("produces a repeatable spring value", () => {
    expect(springProgress(0, 30)).toBe(0);
    expect(springProgress(20, 30)).toBe(springProgress(20, 30));
  });
});

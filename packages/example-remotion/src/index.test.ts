import {describe, expect, it} from "vitest";

describe("Phase 0 example package", () => {
  it("has the expected render contract", () => {
    expect({id: "MotionStudioExample", fps: 30, width: 1920, height: 1080}).toEqual({
      id: "MotionStudioExample",
      fps: 30,
      width: 1920,
      height: 1080,
    });
  });
});

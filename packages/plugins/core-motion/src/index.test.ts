import {describe, expect, it} from "vitest";
import {coreMotionPlugin} from "./index";

describe("core-motion plugin", () => {
  it("declares the built-in visual capabilities", () => {
    expect(coreMotionPlugin.id).toBe("@motion-studio/core-motion");
    expect(coreMotionPlugin.capabilities).toContain("diagram.node.service");
    expect(coreMotionPlugin.components).toHaveLength(4);
  });
});

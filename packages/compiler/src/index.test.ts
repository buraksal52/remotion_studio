import {describe, expect, it} from "vitest";
import {compileStoryboard} from "./index";

const storyboard = {
  version: "0.1",
  metadata: {title: "Compiler Test", fps: 30, width: 1920, height: 1080},
  scenes: [
    {
      id: "flow",
      type: "request-flow",
      layout: {type: "flow", direction: "LR"},
      elements: [
        {id: "api", capability: "diagram.node.service", props: {label: "API"}},
        {id: "redis", capability: "diagram.node.database", props: {label: "Redis"}},
      ],
      timeline: [
        {id: "api-enter", action: "enter", target: "api", duration: 10},
        {id: "redis-enter", action: "enter", target: "redis", after: "api-enter", duration: 20},
      ],
    },
  ],
};

describe("compileStoryboard", () => {
  it("produces deterministic positions and dependency-based frames", () => {
    const first = compileStoryboard(storyboard);
    const second = compileStoryboard(storyboard);

    expect(first).toEqual(second);
    expect(first.scenes[0].elements.map((element) => element.position)).toEqual([
      {x: 180, y: 540},
      {x: 360, y: 540},
    ]);
    expect(first.scenes[0].timeline.map((event) => event.startFrame)).toEqual([0, 10]);
  });

  it("rejects timeline cycles", () => {
    expect(() =>
      compileStoryboard({
        ...storyboard,
        scenes: [{...storyboard.scenes[0], timeline: [
          {id: "a", action: "enter", target: "api", after: "b"},
          {id: "b", action: "enter", target: "redis", after: "a"},
        ]}],
      }),
    ).toThrow(/Timeline cycle detected/);
  });

  it("rejects references to unknown elements", () => {
    expect(() =>
      compileStoryboard({
        ...storyboard,
        scenes: [{...storyboard.scenes[0], timeline: [{id: "bad", action: "enter", target: "missing"}]}],
      }),
    ).toThrow(/unknown element/);
  });
});

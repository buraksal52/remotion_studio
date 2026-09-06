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

  it("topologically orders multiple dependencies and respects explicit starts", () => {
    const plan = compileStoryboard({
      ...storyboard,
      scenes: [{...storyboard.scenes[0], timeline: [
        {id: "finish", action: "activate", target: "redis", after: ["slow", "fast"], duration: 5},
        {id: "slow", action: "enter", target: "api", duration: 20},
        {id: "fast", action: "enter", target: "redis", duration: 8},
        {id: "explicit", action: "focus", target: "api", start: 50, duration: 5},
      ]}],
    });

    expect(plan.scenes[0].timeline.map((event) => event.id)).toEqual(["slow", "fast", "finish", "explicit"]);
    expect(plan.scenes[0].timeline.map((event) => event.startFrame)).toEqual([0, 0, 20, 50]);
  });

  it("rejects duplicate timeline event IDs", () => {
    expect(() =>
      compileStoryboard({
        ...storyboard,
        scenes: [{...storyboard.scenes[0], timeline: [
          {id: "same", action: "enter", target: "api"},
          {id: "same", action: "exit", target: "redis"},
        ]}],
      }),
    ).toThrow(/must be unique/);
  });

  it("compiles every basic layout and graph direction", () => {
    const layouts = [
      {type: "center"},
      {type: "split", direction: "horizontal"},
      {type: "split", direction: "vertical"},
      {type: "grid", columns: 2},
      {type: "flow", direction: "LR"},
      {type: "flow", direction: "TB"},
      {type: "graph", direction: "LR"},
      {type: "graph", direction: "TB"},
    ] as const;

    for (const layout of layouts) {
      const plan = compileStoryboard({...storyboard, scenes: [{...storyboard.scenes[0], layout}]});
      expect(plan.scenes[0].elements).toHaveLength(2);
      expect(plan.scenes[0].elements.every((element) => Number.isFinite(element.position.x) && Number.isFinite(element.position.y))).toBe(true);
    }
  });

  it("produces deterministic graph positions", () => {
    const input = {...storyboard, scenes: [{...storyboard.scenes[0], layout: {type: "graph", direction: "LR"}}]};
    expect(compileStoryboard(input).scenes[0].elements.map((element) => element.position)).toEqual([
      {x: 640, y: 540},
      {x: 1280, y: 540},
    ]);
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

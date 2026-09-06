import {readFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {describe, expect, it} from "vitest";
import {StoryboardSchema, parseStoryboard} from "./index";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../");

const validStoryboard = {
  version: "0.1",
  metadata: {
    title: "Cache Hit",
    fps: 30,
    width: 1920,
    height: 1080,
    theme: "technical-dark",
  },
  scenes: [
    {
      id: "cache-flow",
      type: "request-flow",
      intent: {
        primary: "explain-cache-hit",
        secondary: ["show-data-flow"],
        tone: "technical",
      },
      layout: {type: "flow", direction: "LR"},
      elements: [
        {
          id: "api",
          capability: "diagram.node.service",
          props: {label: "API"},
          semantic: {role: "request-source"},
          animation: [{action: "enter"}],
        },
        {
          id: "redis",
          capability: "diagram.node.database",
          props: {label: "Redis"},
          semantic: {role: "cache"},
        },
      ],
      timeline: [
        {id: "api-enter", action: "enter", target: "api"},
        {id: "redis-enter", action: "enter", target: "redis", after: "api-enter"},
        {id: "connection-draw", action: "connect", from: "api", to: "redis", after: "redis-enter"},
        {id: "redis-activate", action: "activate", target: "redis", after: "connection-draw"},
      ],
    },
  ],
};

describe("StoryboardSchema", () => {
  it("parses a valid storyboard", () => {
    expect(parseStoryboard(validStoryboard).metadata.title).toBe("Cache Hit");
  });

  it("rejects malformed required fields", () => {
    const result = StoryboardSchema.safeParse({
      ...validStoryboard,
      metadata: {...validStoryboard.metadata, fps: 0},
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join(".") === "metadata.fps")).toBe(true);
    }
  });

  it("rejects unknown enum values", () => {
    const result = StoryboardSchema.safeParse({
      ...validStoryboard,
      scenes: [{...validStoryboard.scenes[0], intent: {primary: "test", tone: "dramatic"}}],
    });

    expect(result.success).toBe(false);
  });

  it("rejects unsupported storyboard versions", () => {
    const result = StoryboardSchema.safeParse({...validStoryboard, version: "0.2"});

    expect(result.success).toBe(false);
  });

  it.each(["hero", "cache-hit"])("parses the %s fixture", (fixtureName) => {
    const fixturePath = resolve(projectRoot, "examples", fixtureName, "storyboard.json");
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

    expect(StoryboardSchema.safeParse(fixture).success).toBe(true);
  });
});

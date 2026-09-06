import {parseStoryboard, type LayoutSpec, type Storyboard} from "@motion-studio/schema";

export type MarkdownCompileOptions = {
  fps?: number;
  width?: number;
  height?: number;
  theme?: string;
};

type SceneBlock = {
  type: string;
  attributes: Record<string, string>;
  lines: string[];
};

const DEFAULTS = {fps: 30, width: 1920, height: 1080, theme: "technical-dark"};

export function compileMarkdown(markdown: string, options: MarkdownCompileOptions = {}): Storyboard {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const title = readTitle(lines);
  const blocks = readSceneBlocks(lines);
  if (blocks.length === 0) throw new Error("Markdown must contain at least one :::scene-type block");

  const storyboard = {
    version: "0.1" as const,
    metadata: {
      title,
      fps: options.fps ?? DEFAULTS.fps,
      width: options.width ?? DEFAULTS.width,
      height: options.height ?? DEFAULTS.height,
      theme: options.theme ?? blocks[0].attributes.theme ?? DEFAULTS.theme,
    },
    scenes: blocks.map((block, index) => compileScene(block, index)),
  };

  return parseStoryboard(storyboard);
}

function readTitle(lines: string[]): string {
  const heading = lines.find((line) => /^#\s+\S/.test(line.trim()));
  if (!heading) throw new Error("Markdown must start with a level-one title (for example: # How RAG Works)");
  return heading.trim().slice(2).trim();
}

function readSceneBlocks(lines: string[]): SceneBlock[] {
  const blocks: SceneBlock[] = [];
  let current: SceneBlock | undefined;

  lines.forEach((rawLine, lineIndex) => {
    const line = rawLine.trim();
    const opening = /^:::(\S+)(.*)$/.exec(line);
    if (opening) {
      if (current) throw new Error(`Nested scene block at line ${lineIndex + 1}`);
      current = {type: opening[1], attributes: readAttributes(opening[2], lineIndex + 1), lines: []};
      return;
    }
    if (line === ":::") {
      if (!current) throw new Error(`Unexpected scene block closing at line ${lineIndex + 1}`);
      if (current.lines.every((item) => item.trim() === "")) throw new Error(`Scene "${current.type}" is empty`);
      blocks.push(current);
      current = undefined;
      return;
    }
    if (current) current.lines.push(rawLine);
  });

  if (current) throw new Error(`Scene "${current.type}" is missing a closing :::`);
  return blocks;
}

function readAttributes(input: string, lineNumber: number): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const token of input.trim().split(/\s+/).filter(Boolean)) {
    const [key, ...valueParts] = token.split("=");
    const value = valueParts.join("=");
    if (!key || !value) throw new Error(`Invalid scene attribute "${token}" at line ${lineNumber}; expected key=value`);
    attributes[key] = value.replace(/^['"]|['"]$/g, "");
  }
  return attributes;
}

function compileScene(block: SceneBlock, index: number) {
  const sceneId = block.attributes.id ?? `${slugify(block.type)}-${index + 1}`;
  const intent = block.attributes.intent ?? defaultIntent(block.type);
  const nodes = readNodes(block.lines);
  if (nodes.length === 0) throw new Error(`Scene "${sceneId}" must contain an arrow flow such as A -> B -> C`);

  const elements = nodes.map((label) => ({
    id: slugify(label),
    capability: capabilityFor(label, block.type),
    props: {label},
  }));
  const uniqueElements = deduplicateElements(elements);
  const timeline = uniqueElements.flatMap((element, elementIndex) => {
    const event = {id: `${element.id}-enter`, action: "enter", target: element.id, ...(elementIndex > 0 ? {after: `${uniqueElements[elementIndex - 1].id}-enter`} : {})};
    return [event];
  });
  const connections = ["architecture", "request-flow", "pipeline"].includes(block.type)
    ? uniqueElements.slice(1).map((element, elementIndex) => ({
    id: `${uniqueElements[elementIndex].id}-to-${element.id}`,
    action: "connect",
    from: uniqueElements[elementIndex].id,
    to: element.id,
    after: `${element.id}-enter`,
    }))
    : [];

  return {
    id: sceneId,
    type: block.type,
    intent: {primary: intent, ...(block.attributes.tone ? {tone: block.attributes.tone} : {})},
    layout: readLayout(block.attributes),
    elements: uniqueElements,
    timeline: [...timeline, ...connections],
  };
}

function readNodes(lines: string[]): string[] {
  return lines
    .flatMap((line) => line.split("->"))
    .map((label) => label.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function readLayout(attributes: Record<string, string>): LayoutSpec {
  const type = attributes.layout ?? "flow";
  if (type === "flow") return {type: "flow", direction: (attributes.direction ?? "LR") as "LR" | "RL" | "TB" | "BT"};
  if (type === "center") return {type: "center"};
  if (type === "grid") return {type: "grid", ...(attributes.columns ? {columns: Number(attributes.columns)} : {})};
  if (type === "split") return {type: "split", direction: (attributes.direction ?? "horizontal") as "horizontal" | "vertical"};
  if (type === "graph") return {type: "graph", direction: (attributes.direction ?? "LR") as "LR" | "TB"};
  throw new Error(`Unsupported Markdown layout "${type}"`);
}

function capabilityFor(label: string, sceneType: string): string {
  const normalized = label.toLowerCase();
  if (sceneType === "request-flow" && /redis|cache|vector|database|db/.test(normalized)) return "diagram.node.database";
  if (/user|client|browser/.test(normalized)) return "diagram.node.client";
  if (/queue|job|worker/.test(normalized)) return "diagram.node.queue";
  if (/cache|redis|vector/.test(normalized)) return "diagram.node.cache";
  if (/api|gateway|embedding|llm|service/.test(normalized)) return "diagram.node.gateway";
  return sceneType === "product-demo" ? "product.feature-card" : "diagram.node.gateway";
}

function defaultIntent(sceneType: string): string {
  if (sceneType === "architecture") return "explain-architecture";
  if (sceneType === "request-flow") return "show-data-flow";
  if (sceneType === "product-demo" || sceneType === "feature-demo") return "show-feature";
  return `show-${sceneType}`;
}

function deduplicateElements(elements: Array<{id: string; capability: string; props: {label: string}}>) {
  const counts = new Map<string, number>();
  return elements.map((element) => {
    const count = counts.get(element.id) ?? 0;
    counts.set(element.id, count + 1);
    return count === 0 ? element : {...element, id: `${element.id}-${count + 1}`};
  });
}

function slugify(value: string): string {
  const result = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return result || "node";
}

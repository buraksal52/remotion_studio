import {parseStoryboard, type LayoutSpec, type Scene, type Storyboard, type TimelineEvent} from "@motion-studio/schema";

export type Point = {
  x: number;
  y: number;
};

export type CompiledElement = {
  id: string;
  capability: string;
  props: Record<string, unknown>;
  position: Point;
  width: number;
  height: number;
  animationActions: string[];
};

export type CompiledTimelineEvent = {
  id: string;
  action: string;
  target?: string;
  from?: string;
  to?: string;
  startFrame: number;
  durationInFrames: number;
};

export type CompiledScene = {
  id: string;
  type: string;
  fromFrame: number;
  durationInFrames: number;
  elements: CompiledElement[];
  timeline: CompiledTimelineEvent[];
};

export type RenderPlan = {
  scenes: CompiledScene[];
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  title: string;
};

const DEFAULT_EVENT_DURATION = 18;
const DEFAULT_SCENE_DURATION = 120;
const DEFAULT_ELEMENT_WIDTH = 280;
const DEFAULT_ELEMENT_HEIGHT = 140;
const LAYOUT_MARGIN = 180;
const LAYOUT_GAP = 180;

export function compileStoryboard(input: unknown): RenderPlan {
  const storyboard = parseStoryboard(input);
  let fromFrame = 0;
  const scenes = storyboard.scenes.map((scene) => {
    const compiled = compileScene(scene, storyboard.metadata.width, storyboard.metadata.height, fromFrame);
    fromFrame += compiled.durationInFrames;
    return compiled;
  });

  return {
    scenes,
    durationInFrames: fromFrame,
    fps: storyboard.metadata.fps,
    width: storyboard.metadata.width,
    height: storyboard.metadata.height,
    title: storyboard.metadata.title,
  };
}

function compileScene(scene: Scene, width: number, height: number, fromFrame: number): CompiledScene {
  const timeline = compileTimeline(scene.timeline ?? [], scene.elements.map((element) => element.id));
  const durationInFrames = scene.duration ?? Math.max(DEFAULT_SCENE_DURATION, getTimelineEnd(timeline));

  if (durationInFrames < getTimelineEnd(timeline)) {
    throw new Error(`Scene "${scene.id}" duration is shorter than its timeline`);
  }

  return {
    id: scene.id,
    type: scene.type,
    fromFrame,
    durationInFrames,
    elements: compileElements(scene, width, height),
    timeline,
  };
}

function compileElements(scene: Scene, width: number, height: number): CompiledElement[] {
  const positions = compileLayout(scene.layout, scene.elements.length, width, height);

  return scene.elements.map((element, index) => ({
    id: element.id,
    capability: element.capability,
    props: element.props ?? {},
    position: positions[index],
    width: DEFAULT_ELEMENT_WIDTH,
    height: DEFAULT_ELEMENT_HEIGHT,
    animationActions: element.animation?.map((animation) => animation.action) ?? [],
  }));
}

function compileLayout(layout: LayoutSpec | undefined, count: number, width: number, height: number): Point[] {
  if (count === 0) return [];
  if (!layout || layout.type === "center") {
    return Array.from({length: count}, () => ({x: width / 2, y: height / 2}));
  }

  if (layout.type === "split") {
    return Array.from({length: count}, (_, index) => {
      const progress = count === 1 ? 0.5 : index / (count - 1);
      return layout.direction === "horizontal"
        ? {x: LAYOUT_MARGIN + progress * (width - LAYOUT_MARGIN * 2), y: height / 2}
        : {x: width / 2, y: LAYOUT_MARGIN + progress * (height - LAYOUT_MARGIN * 2)};
    });
  }

  if (layout.type === "grid") {
    const columns = layout.columns ?? Math.ceil(Math.sqrt(count));
    return Array.from({length: count}, (_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const rows = Math.ceil(count / columns);
      return {
        x: ((column + 1) / (columns + 1)) * width,
        y: ((row + 1) / (rows + 1)) * height,
      };
    });
  }

  const isVertical = layout.direction === "TB" || layout.direction === "BT";
  const reverse = layout.direction === "RL" || layout.direction === "BT";
  return Array.from({length: count}, (_, index) => {
    const order = reverse ? count - 1 - index : index;
    return isVertical
      ? {x: width / 2, y: LAYOUT_MARGIN + order * LAYOUT_GAP}
      : {x: LAYOUT_MARGIN + order * LAYOUT_GAP, y: height / 2};
  });
}

function compileTimeline(events: TimelineEvent[], elementIds: string[]): CompiledTimelineEvent[] {
  const elementIdSet = new Set(elementIds);
  const eventMap = new Map(events.map((event) => [event.id, event]));
  const compiled = new Map<string, CompiledTimelineEvent>();
  const visiting = new Set<string>();

  const visit = (eventId: string): CompiledTimelineEvent => {
    const existing = compiled.get(eventId);
    if (existing) return existing;
    if (visiting.has(eventId)) throw new Error(`Timeline cycle detected at "${eventId}"`);

    const event = eventMap.get(eventId);
    if (!event) throw new Error(`Timeline dependency "${eventId}" does not exist`);
    validateEventTargets(event, elementIdSet);
    visiting.add(eventId);

    const dependencies = event.after ? (Array.isArray(event.after) ? event.after : [event.after]) : [];
    const dependencyEnd = dependencies.reduce((max, dependencyId) => Math.max(max, getTimelineEnd([visit(dependencyId)])), 0);
    const startFrame = event.start ?? dependencyEnd;
    const result: CompiledTimelineEvent = {
      id: event.id,
      action: event.action,
      target: event.target,
      from: event.from,
      to: event.to,
      startFrame,
      durationInFrames: event.duration ?? DEFAULT_EVENT_DURATION,
    };
    visiting.delete(eventId);
    compiled.set(eventId, result);
    return result;
  };

  return events.map((event) => visit(event.id));
}

function validateEventTargets(event: TimelineEvent, elementIds: Set<string>): void {
  for (const target of [event.target, event.from, event.to]) {
    if (target && !elementIds.has(target)) {
      throw new Error(`Timeline event "${event.id}" references unknown element "${target}"`);
    }
  }
}

function getTimelineEnd(timeline: CompiledTimelineEvent[]): number {
  return timeline.reduce((max, event) => Math.max(max, event.startFrame + event.durationInFrames), 0);
}

# Storyboard / Motion IR Specification

## Purpose

The Storyboard is the stable intermediate representation between authoring systems and the runtime.

Authoring systems may include:
- hand-written JSON
- Claude Code
- Codex
- Markdown compiler
- future desktop GUI

All of them should produce the same Storyboard format.

## Draft Root Model

```ts
type Storyboard = {
  version: "0.1";
  metadata: {
    title: string;
    fps: number;
    width: number;
    height: number;
    theme?: string;
  };
  scenes: Scene[];
};
```

## Scene

```ts
type Scene = {
  id: string;
  type: string;
  duration?: number;
  intent?: SceneIntent;
  layout?: LayoutSpec;
  elements: ElementSpec[];
  timeline?: TimelineEvent[];
};
```

## Scene Intent

```ts
type SceneIntent = {
  primary: string;
  secondary?: string[];
  tone?: "neutral" | "technical" | "playful" | "cinematic";
};
```

Example:

```json
{
  "primary": "explain-cache-hit",
  "secondary": ["show-data-flow"],
  "tone": "technical"
}
```

## Element

```ts
type ElementSpec = {
  id: string;
  capability: string;
  props?: Record<string, unknown>;
  semantic?: {
    role?: string;
    intent?: string[];
  };
  animation?: AnimationRequest[];
};
```

Example:

```json
{
  "id": "redis",
  "capability": "diagram.node.database",
  "props": {
    "label": "Redis"
  },
  "semantic": {
    "role": "cache"
  }
}
```

## Animation Request

Agents should request semantic actions.

```ts
type AnimationRequest = {
  action:
    | "enter"
    | "exit"
    | "highlight"
    | "activate"
    | "connect"
    | "focus"
    | "reveal"
    | "progress";
  preset?: string;
};
```

The agent should not normally specify `scale: 1.08`, easing curves, or interpolation values.

## Timeline Event

```ts
type TimelineEvent = {
  id: string;
  action: string;
  target?: string;
  from?: string;
  to?: string;
  after?: string | string[];
  start?: number;
  duration?: number;
};
```

Example:

```json
{
  "id": "redis-activate",
  "action": "activate",
  "target": "redis",
  "after": "connection-draw"
}
```

## Layout

```ts
type LayoutSpec =
  | { type: "center" }
  | { type: "split"; direction: "horizontal" | "vertical" }
  | { type: "grid"; columns?: number }
  | { type: "flow"; direction: "LR" | "RL" | "TB" | "BT" }
  | { type: "graph"; direction: "LR" | "TB" };
```

## Example Storyboard

```json
{
  "version": "0.1",
  "metadata": {
    "title": "Cache Hit",
    "fps": 30,
    "width": 1920,
    "height": 1080,
    "theme": "technical-dark"
  },
  "scenes": [
    {
      "id": "cache-flow",
      "type": "request-flow",
      "intent": {
        "primary": "explain-cache-hit",
        "tone": "technical"
      },
      "layout": {
        "type": "flow",
        "direction": "LR"
      },
      "elements": [
        {
          "id": "api",
          "capability": "diagram.node.service",
          "props": { "label": "API" }
        },
        {
          "id": "redis",
          "capability": "diagram.node.database",
          "props": { "label": "Redis" }
        }
      ],
      "timeline": [
        {
          "id": "api-enter",
          "action": "enter",
          "target": "api"
        },
        {
          "id": "redis-enter",
          "action": "enter",
          "target": "redis",
          "after": "api-enter"
        },
        {
          "id": "connection-draw",
          "action": "connect",
          "from": "api",
          "to": "redis",
          "after": "redis-enter"
        },
        {
          "id": "redis-activate",
          "action": "activate",
          "target": "redis",
          "after": "connection-draw"
        }
      ]
    }
  ]
}
```

## Design Rules

- Prefer semantic capability IDs over concrete implementation IDs.
- Avoid arbitrary coordinates in agent-generated files.
- Avoid raw CSS.
- Avoid Remotion-specific code in the IR.
- Keep the schema versioned from the beginning.
- Changes to the IR should be treated as public API changes.

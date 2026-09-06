import {z} from "zod";

const nonEmptyId = z.string().min(1, "ID cannot be empty");

export const SceneToneSchema = z.enum(["neutral", "technical", "playful", "cinematic"]);

export const SceneIntentSchema = z.object({
  primary: z.string().min(1),
  secondary: z.array(z.string().min(1)).optional(),
  tone: SceneToneSchema.optional(),
});

export const AnimationActionSchema = z.enum([
  "enter",
  "exit",
  "highlight",
  "activate",
  "connect",
  "focus",
  "reveal",
  "progress",
]);

export const AnimationRequestSchema = z.object({
  action: AnimationActionSchema,
  preset: z.string().min(1).optional(),
});

export const LayoutSchema = z.discriminatedUnion("type", [
  z.object({type: z.literal("center")}),
  z.object({
    type: z.literal("split"),
    direction: z.enum(["horizontal", "vertical"]),
  }),
  z.object({
    type: z.literal("grid"),
    columns: z.number().int().positive().optional(),
  }),
  z.object({
    type: z.literal("flow"),
    direction: z.enum(["LR", "RL", "TB", "BT"]),
  }),
  z.object({
    type: z.literal("graph"),
    direction: z.enum(["LR", "TB"]),
  }),
]);

export const ElementSchema = z.object({
  id: nonEmptyId,
  capability: z.string().min(1),
  props: z.record(z.unknown()).optional(),
  semantic: z
    .object({
      role: z.string().min(1).optional(),
      intent: z.array(z.string().min(1)).optional(),
    })
    .optional(),
  animation: z.array(AnimationRequestSchema).optional(),
});

export const TimelineEventSchema = z.object({
  id: nonEmptyId,
  action: z.string().min(1),
  target: nonEmptyId.optional(),
  from: nonEmptyId.optional(),
  to: nonEmptyId.optional(),
  after: z.union([nonEmptyId, z.array(nonEmptyId).min(1)]).optional(),
  start: z.number().nonnegative().optional(),
  duration: z.number().positive().optional(),
});

export const SceneSchema = z.object({
  id: nonEmptyId,
  type: z.string().min(1),
  duration: z.number().positive().optional(),
  intent: SceneIntentSchema.optional(),
  layout: LayoutSchema.optional(),
  elements: z.array(ElementSchema),
  timeline: z.array(TimelineEventSchema).optional(),
});

export const StoryboardMetadataSchema = z.object({
  title: z.string().min(1),
  fps: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  theme: z.string().min(1).optional(),
});

export const StoryboardSchema = z.object({
  version: z.literal("0.1"),
  metadata: StoryboardMetadataSchema,
  scenes: z.array(SceneSchema),
});

export type Storyboard = z.infer<typeof StoryboardSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type ElementSpec = z.infer<typeof ElementSchema>;
export type AnimationRequest = z.infer<typeof AnimationRequestSchema>;
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
export type LayoutSpec = z.infer<typeof LayoutSchema>;

export function parseStoryboard(value: unknown): Storyboard {
  return StoryboardSchema.parse(value);
}

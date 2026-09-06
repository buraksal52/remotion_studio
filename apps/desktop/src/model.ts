import type {RenderPlan} from "@motion-studio/compiler";

export type ProjectFile = {id: string; label: string; plan: RenderPlan};

export function sceneSummary(plan: RenderPlan): string {
  return `${plan.scenes.length} scene${plan.scenes.length === 1 ? "" : "s"} · ${plan.durationInFrames} frames · ${plan.fps} fps`;
}

export function renderCommand(projectPath: string): string {
  return `motion render --storyboard ${projectPath}`;
}

export function timelinePercent(startFrame: number, durationInFrames: number, totalFrames: number): number {
  if (totalFrames <= 0) return 0;
  return Math.max(0, Math.min(100, ((startFrame + durationInFrames) / totalFrames) * 100));
}

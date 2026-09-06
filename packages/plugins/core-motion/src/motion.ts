import {interpolate, spring} from "remotion";

export function fadeProgress(frame: number, startFrame: number, durationInFrames: number): number {
  return interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function slideOffset(progress: number, distance = 40): number {
  return (1 - progress) * distance;
}

export function scaleProgress(frame: number, startFrame: number, durationInFrames: number): number {
  return interpolate(frame, [startFrame, startFrame + durationInFrames / 2, startFrame + durationInFrames], [0.94, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function springProgress(frame: number, fps: number, delay = 0): number {
  return spring({frame: Math.max(0, frame - delay), fps, config: {damping: 16, stiffness: 120}});
}

export function drawProgress(frame: number, startFrame: number, durationInFrames: number): number {
  return fadeProgress(frame, startFrame, durationInFrames);
}

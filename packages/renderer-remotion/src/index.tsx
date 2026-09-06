import React from "react";
import {Composition, registerRoot} from "remotion";
import type {RenderPlan} from "@motion-studio/compiler";
import {MotionStudioComposition, SceneRenderer, createDefaultRegistry} from "./components";

export function registerMotionStudioRoot(plan: RenderPlan): void {
  const Root: React.FC = () => (
    <Composition
      component={MotionStudioComposition}
      defaultProps={{plan}}
      durationInFrames={plan.durationInFrames}
      fps={plan.fps}
      height={plan.height}
      id="MotionStudioStoryboard"
      width={plan.width}
    />
  );
  registerRoot(Root);
}

export {createDefaultRegistry, MotionStudioComposition, SceneRenderer} from "./components";

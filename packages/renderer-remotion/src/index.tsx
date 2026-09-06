import React from "react";
import {Composition, Sequence, registerRoot} from "remotion";
import type {RenderPlan} from "@motion-studio/compiler";
import {SceneRenderer} from "./components";

export const MotionStudioComposition: React.FC<{plan: RenderPlan}> = ({plan}) => {
  return (
    <>
      {plan.scenes.map((scene) => (
        <Sequence durationInFrames={scene.durationInFrames} from={scene.fromFrame} key={scene.id}>
          <SceneRenderer plan={plan} scene={scene} />
        </Sequence>
      ))}
    </>
  );
};

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

export {DatabaseNode, HeroText, ServiceNode, Connection, SceneRenderer} from "./components";
export {drawProgress, fadeProgress, scaleProgress, slideOffset, springProgress} from "./motion";

import React from "react";
import cacheStoryboard from "../../../examples/cache-hit/storyboard.json";
import {compileStoryboard} from "@motion-studio/compiler";
import {Composition, registerRoot} from "remotion";
import {MotionStudioComposition} from "@motion-studio/renderer-remotion";

const renderPlan = compileStoryboard(cacheStoryboard);

registerRoot(() => (
  <Composition
    component={MotionStudioComposition}
    defaultProps={{plan: renderPlan}}
    durationInFrames={renderPlan.durationInFrames}
    fps={renderPlan.fps}
    height={renderPlan.height}
    id="MotionStudioStoryboard"
    width={renderPlan.width}
  />
));

export {renderPlan};

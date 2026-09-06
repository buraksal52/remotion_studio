import React from "react";
import {Composition, registerRoot} from "remotion";

const ExampleComposition: React.FC = () => {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#101827",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div style={{fontSize: 72, fontWeight: 700}}>Motion Studio</div>
      <div style={{color: "#93c5fd", fontSize: 28, marginTop: 20}}>
        Phase 0 Remotion example
      </div>
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      component={ExampleComposition}
      durationInFrames={90}
      fps={30}
      height={1080}
      id="MotionStudioExample"
      width={1920}
    />
  );
};

registerRoot(RemotionRoot);

export default RemotionRoot;

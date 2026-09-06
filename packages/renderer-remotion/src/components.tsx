import React from "react";
import {AbsoluteFill, Sequence, useCurrentFrame} from "remotion";
import type {CompiledElement, CompiledScene, RenderPlan} from "@motion-studio/compiler";
import {coreMotionPlugin} from "@motion-studio/core-motion";
import {PluginRegistry} from "@motion-studio/registry";

const background = "#101827";
const muted = "#94a3b8";

export function createDefaultRegistry(): PluginRegistry {
  const registry = new PluginRegistry("0.1.0");
  registry.register(coreMotionPlugin);
  return registry;
}

export const MotionStudioComposition: React.FC<{plan: RenderPlan; registry?: PluginRegistry}> = ({plan, registry = createDefaultRegistry()}) => {
  return (
    <>
      {plan.scenes.map((scene) => (
        <Sequence durationInFrames={scene.durationInFrames} from={scene.fromFrame} key={scene.id}>
          <SceneRenderer plan={plan} registry={registry} scene={scene} />
        </Sequence>
      ))}
    </>
  );
};

export const SceneRenderer: React.FC<{plan: RenderPlan; registry: PluginRegistry; scene: CompiledScene}> = ({plan, registry, scene}) => {
  const frame = useCurrentFrame();
  const elementMap = new Map(scene.elements.map((element) => [element.id, element]));
  const connectionProvider = registry.resolve("diagram.connection.request").component.component as React.ComponentType<any>;

  return (
    <AbsoluteFill style={{backgroundColor: background, fontFamily: "Arial, sans-serif"}}>
      <div style={{color: muted, fontSize: 24, left: 60, position: "absolute", top: 44}}>{plan.title}</div>
      {scene.timeline.filter((event) => event.action === "connect" && event.from && event.to).map((event) => {
        const from = elementMap.get(event.from!);
        const to = elementMap.get(event.to!);
        if (!from || !to) return null;
        return React.createElement(connectionProvider, {event, from: from.position, key: event.id, to: to.position});
      })}
      {scene.elements.map((element) => {
        const isActive = scene.timeline.some((event) => event.target === element.id && event.action === "activate" && frame >= event.startFrame);
        return <ElementRenderer element={element} isActive={isActive} key={element.id} registry={registry} />;
      })}
    </AbsoluteFill>
  );
};

const ElementRenderer: React.FC<{element: CompiledElement; isActive: boolean; registry: PluginRegistry}> = ({element, isActive, registry}) => {
  const provider = registry.resolve(element.capability);
  const Component = provider.component.component as React.ComponentType<any>;
  const label = String(element.props.label ?? element.props.text ?? element.id);
  const style = {left: element.position.x, position: "absolute" as const, top: element.position.y, transform: "translate(-50%, -50%)"};

  return (
    <div style={style}>
      <Component {...element.props} active={isActive} label={label} text={label} />
    </div>
  );
};

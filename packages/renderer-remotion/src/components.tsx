import React from "react";
import {AbsoluteFill, Sequence, useCurrentFrame} from "remotion";
import type {CompiledElement, CompiledScene, RenderPlan} from "@motion-studio/compiler";
import {coreMotionPlugin} from "@motion-studio/core-motion";
import {PluginRegistry} from "@motion-studio/registry";
import {SemanticResolver} from "@motion-studio/resolver";

const background = "#101827";
const muted = "#94a3b8";

export function createDefaultRegistry(): PluginRegistry {
  const registry = new PluginRegistry("0.1.0");
  registry.register(coreMotionPlugin);
  return registry;
}

export const MotionStudioComposition: React.FC<{plan: RenderPlan; registry?: PluginRegistry; resolver?: SemanticResolver}> = ({plan, registry = createDefaultRegistry(), resolver = new SemanticResolver(registry)}) => {
  return (
    <>
      {plan.scenes.map((scene) => (
        <Sequence durationInFrames={scene.durationInFrames} from={scene.fromFrame} key={scene.id}>
          <SceneRenderer plan={plan} registry={registry} resolver={resolver} scene={scene} />
        </Sequence>
      ))}
    </>
  );
};

export const SceneRenderer: React.FC<{plan: RenderPlan; registry: PluginRegistry; resolver: SemanticResolver; scene: CompiledScene}> = ({plan, registry, resolver, scene}) => {
  const frame = useCurrentFrame();
  const elementMap = new Map(scene.elements.map((element) => [element.id, element]));
  const connectionProvider = resolver.resolve({capability: "diagram.connection.request", sceneType: scene.type, intents: scene.sceneIntent, theme: scene.theme}).provider.component.component as React.ComponentType<any>;

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
        return <ElementRenderer element={element} isActive={isActive} key={element.id} registry={registry} resolver={resolver} scene={scene} />;
      })}
    </AbsoluteFill>
  );
};

const ElementRenderer: React.FC<{element: CompiledElement; isActive: boolean; registry: PluginRegistry; resolver: SemanticResolver; scene: CompiledScene}> = ({element, isActive, resolver, scene}) => {
  const provider = resolver.resolve({capability: element.capability, sceneType: scene.type, intents: scene.sceneIntent, theme: scene.theme});
  const Component = provider.provider.component.component as React.ComponentType<any>;
  const label = String(element.props.label ?? element.props.text ?? element.id);
  const style = {left: element.position.x, position: "absolute" as const, top: element.position.y, transform: "translate(-50%, -50%)"};

  return (
    <div style={style}>
      <Component {...element.props} active={isActive} label={label} text={label} />
    </div>
  );
};

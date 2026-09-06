import React from "react";
import {AbsoluteFill, Sequence, useCurrentFrame} from "remotion";
import type {CompiledElement, CompiledScene, RenderPlan} from "@motion-studio/compiler";
import {coreMotionPlugin} from "@motion-studio/core-motion";
import {productDemoPlugin} from "@motion-studio/product-demo";
import {PluginRegistry} from "@motion-studio/registry";
import {SemanticResolver} from "@motion-studio/resolver";
import {technicalDiagramsPlugin} from "@motion-studio/technical-diagrams";

const themeStyles: Record<string, {background: string; muted: string}> = {
  "technical-dark": {background: "#101827", muted: "#94a3b8"},
  "product-dark": {background: "#120f2e", muted: "#c4b5fd"},
  "clean-light": {background: "#f8fafc", muted: "#475569"},
};

export function createDefaultRegistry(): PluginRegistry {
  const registry = new PluginRegistry("0.1.0");
  registry.register(coreMotionPlugin);
  registry.register(technicalDiagramsPlugin);
  registry.register(productDemoPlugin);
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
  const connectionEvents = scene.timeline.filter((event) => event.action === "connect" && event.from && event.to);
  const connectionProvider = connectionEvents.length > 0
    ? resolver.resolve({capability: "diagram.connection.request", sceneType: scene.type, intents: scene.sceneIntent, theme: scene.theme}).provider.component.component as React.ComponentType<any>
    : undefined;
  const theme = themeStyles[scene.theme ?? "technical-dark"] ?? themeStyles["technical-dark"];

  return (
    <AbsoluteFill style={{backgroundColor: theme.background, fontFamily: "Arial, sans-serif"}}>
      <div style={{color: theme.muted, fontSize: 24, left: 60, position: "absolute", top: 44}}>{plan.title}</div>
      {connectionEvents.map((event) => {
        const from = elementMap.get(event.from!);
        const to = elementMap.get(event.to!);
        if (!from || !to || !connectionProvider) return null;
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

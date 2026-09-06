import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import type {CompiledElement, CompiledScene, CompiledTimelineEvent, Point, RenderPlan} from "@motion-studio/compiler";
import {drawProgress, fadeProgress, scaleProgress, slideOffset, springProgress} from "./motion";

const colors = {
  background: "#101827",
  border: "#334155",
  cyan: "#67e8f9",
  muted: "#94a3b8",
  panel: "#172235",
  text: "#f8fafc",
};

export const HeroText: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeProgress(frame, 0, 24);
  const scale = 0.96 + springProgress(frame, fps) * 0.04;
  return (
    <div style={{color: colors.text, fontSize: 92, fontWeight: 700, opacity, transform: `scale(${scale})`}}>
      {text}
    </div>
  );
};

export const ServiceNode: React.FC<{label: string; active?: boolean}> = ({label, active}) => (
  <NodeCard accent="#60a5fa" active={active} label={label} subtitle="service" />
);

export const DatabaseNode: React.FC<{label: string; active?: boolean}> = ({label, active}) => (
  <NodeCard accent="#f59e0b" active={active} label={label} subtitle="database" />
);

const NodeCard: React.FC<{accent: string; active?: boolean; label: string; subtitle: string}> = ({accent, active, label, subtitle}) => {
  const frame = useCurrentFrame();
  const opacity = fadeProgress(frame, 0, 18);
  const translateY = slideOffset(opacity);
  const scale = active ? scaleProgress(frame, 0, 24) : 1;
  return (
    <div
      style={{
        backgroundColor: colors.panel,
        border: `2px solid ${active ? accent : colors.border}`,
        borderRadius: 20,
        boxShadow: active ? `0 0 34px ${accent}66` : "0 12px 30px #00000033",
        color: colors.text,
        minWidth: 240,
        opacity,
        padding: "24px 32px",
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div style={{color: accent, fontSize: 18, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase"}}>{subtitle}</div>
      <div style={{fontSize: 40, fontWeight: 700, marginTop: 8}}>{label}</div>
    </div>
  );
};

export const Connection: React.FC<{from: Point; to: Point; event: CompiledTimelineEvent}> = ({from, to, event}) => {
  const frame = useCurrentFrame();
  const progress = drawProgress(frame, event.startFrame, event.durationInFrames);
  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress;
  const opacity = fadeProgress(frame, event.startFrame, 12);
  return (
    <svg height="100%" style={{left: 0, overflow: "visible", position: "absolute", top: 0, width: "100%"}} width="100%">
      <line stroke={colors.cyan} strokeDasharray="12 10" strokeWidth="6" x1={from.x} x2={x} y1={from.y} y2={y} />
      <circle cx={x} cy={y} fill={colors.cyan} opacity={opacity} r="10" />
    </svg>
  );
};

export const SceneRenderer: React.FC<{plan: RenderPlan; scene: CompiledScene}> = ({plan, scene}) => {
  const frame = useCurrentFrame();
  const elementMap = new Map(scene.elements.map((element) => [element.id, element]));
  const connectionEvents = scene.timeline.filter((event) => event.action === "connect" && event.from && event.to);

  return (
    <AbsoluteFill style={{backgroundColor: colors.background, fontFamily: "Arial, sans-serif"}}>
      <div style={{color: colors.muted, fontSize: 24, left: 60, position: "absolute", top: 44}}>{plan.title}</div>
      {connectionEvents.map((event) => {
        const from = elementMap.get(event.from!);
        const to = elementMap.get(event.to!);
        if (!from || !to) return null;
        return <Connection event={event} from={from.position} key={event.id} to={to.position} />;
      })}
      {scene.elements.map((element) => {
        const isActive = scene.timeline.some((event) => event.target === element.id && event.action === "activate" && frame >= event.startFrame);
        return <ElementRenderer element={element} isActive={isActive} key={element.id} />;
      })}
    </AbsoluteFill>
  );
};

const ElementRenderer: React.FC<{element: CompiledElement; isActive: boolean}> = ({element, isActive}) => {
  const style = {left: element.position.x, position: "absolute" as const, top: element.position.y, transform: "translate(-50%, -50%)"};
  const label = String(element.props.label ?? element.props.text ?? element.id);
  if (element.capability === "ui.hero-text") return <div style={{...style, transform: "translate(-50%, -50%) scale(1)"}}><HeroText text={label} /></div>;
  if (element.capability === "diagram.node.database") return <div style={style}><DatabaseNode active={isActive} label={label} /></div>;
  return <div style={style}><ServiceNode active={isActive} label={label} /></div>;
};

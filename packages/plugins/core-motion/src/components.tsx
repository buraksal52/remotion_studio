import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import type {CompiledTimelineEvent, Point} from "@motion-studio/compiler";
import {drawProgress, fadeProgress, scaleProgress, slideOffset, springProgress} from "./motion";

const colors = {
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
  return <div style={{color: colors.text, fontSize: 92, fontWeight: 700, opacity, transform: `scale(${scale})`}}>{text}</div>;
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
    <div style={{backgroundColor: colors.panel, border: `2px solid ${active ? accent : colors.border}`, borderRadius: 20, boxShadow: active ? `0 0 34px ${accent}66` : "0 12px 30px #00000033", color: colors.text, minWidth: 240, opacity, padding: "24px 32px", transform: `translateY(${translateY}px) scale(${scale})`}}>
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

export {colors};

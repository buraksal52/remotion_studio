import React from "react";
import {useCurrentFrame} from "remotion";
import {fadeProgress, highlightProgress, progressFill, revealProgress, slideOffset} from "@motion-studio/core-motion";

const palette = {blue: "#38bdf8", green: "#34d399", orange: "#fb923c", panel: "#172235", text: "#f8fafc", muted: "#94a3b8"};

export const ClientNode: React.FC<{label: string; active?: boolean}> = ({label, active}) => <DiagramCard label={label} subtitle="client" accent={palette.green} active={active} />;
export const GatewayNode: React.FC<{label: string; active?: boolean}> = ({label, active}) => <DiagramCard label={label} subtitle="gateway" accent={palette.blue} active={active} />;
export const QueueNode: React.FC<{label: string; active?: boolean}> = ({label, active}) => <DiagramCard label={label} subtitle="queue" accent={palette.orange} active={active} />;
export const CacheNode: React.FC<{label: string; active?: boolean}> = ({label, active}) => <DiagramCard label={label} subtitle="cache" accent="#facc15" active={active} />;

const DiagramCard: React.FC<{label: string; subtitle: string; accent: string; active?: boolean}> = ({label, subtitle, accent, active}) => {
  const frame = useCurrentFrame();
  const opacity = fadeProgress(frame, 0, 18);
  const glow = active ? highlightProgress(frame, 0, 30) : 0;
  return <div style={{backgroundColor: palette.panel, border: `2px solid ${accent}`, borderRadius: 18, boxShadow: `0 0 ${18 + glow * 24}px ${accent}${active ? "99" : "33"}`, color: palette.text, minWidth: 220, opacity, padding: "20px 28px", transform: `translateY(${slideOffset(opacity, 24)}px)`}}>
    <div style={{color: accent, fontSize: 16, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase"}}>{subtitle}</div>
    <div style={{fontSize: 34, fontWeight: 700, marginTop: 8}}>{label}</div>
  </div>;
};

export const DataPacket: React.FC<{label?: string}> = ({label = "data"}) => {
  const frame = useCurrentFrame();
  return <div style={{backgroundColor: palette.blue, borderRadius: 8, color: "#082f49", fontSize: 18, fontWeight: 700, opacity: revealProgress(frame, 0, 18), padding: "10px 16px"}}>{label}</div>;
};

export const PipelineStep: React.FC<{label: string; progress?: number}> = ({label, progress = 0}) => {
  const frame = useCurrentFrame();
  const fill = progressFill(frame, 0, 30) * Math.max(0, Math.min(1, progress));
  return <div style={{color: palette.text, minWidth: 260}}><div style={{fontSize: 24, fontWeight: 700}}>{label}</div><div style={{backgroundColor: "#334155", borderRadius: 8, height: 12, marginTop: 12, overflow: "hidden"}}><div style={{backgroundColor: palette.green, height: "100%", width: `${fill}%`}} /></div></div>;
};

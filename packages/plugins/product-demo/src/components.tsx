import React from "react";
import {useCurrentFrame} from "remotion";
import {fadeProgress, highlightProgress, revealProgress, springProgress} from "@motion-studio/core-motion";

const colors = {accent: "#a78bfa", cyan: "#22d3ee", panel: "#1e1b4b", text: "#f8fafc", muted: "#c4b5fd"};

export const BrowserChrome: React.FC<{label?: string}> = ({label = "Product Demo"}) => <div style={{backgroundColor: colors.panel, border: "1px solid #4c1d95", borderRadius: 18, color: colors.text, minWidth: 640, overflow: "hidden", width: 820}}><div style={{alignItems: "center", backgroundColor: "#312e81", display: "flex", gap: 8, padding: "14px 18px"}}><span style={{backgroundColor: "#fb7185", borderRadius: "50%", height: 10, width: 10}} /><span style={{backgroundColor: "#facc15", borderRadius: "50%", height: 10, width: 10}} /><span style={{backgroundColor: "#4ade80", borderRadius: "50%", height: 10, width: 10}} /><span style={{color: colors.muted, marginLeft: 16}}>{label}</span></div><div style={{height: 250}} /></div>;

export const ProductScreenshot: React.FC<{label: string}> = ({label}) => {
  const frame = useCurrentFrame();
  return <div style={{backgroundColor: "#f8fafc", borderRadius: 14, color: "#312e81", fontSize: 38, fontWeight: 700, opacity: fadeProgress(frame, 0, 24), padding: "54px 72px", transform: `scale(${0.96 + springProgress(frame, 30) * 0.04})`}}>{label}</div>;
};

export const FeatureCard: React.FC<{label: string; detail?: string}> = ({label, detail = "Reusable workflow"}) => {
  const frame = useCurrentFrame();
  return <div style={{backgroundColor: colors.panel, border: "2px solid #6d28d9", borderRadius: 16, color: colors.text, opacity: revealProgress(frame, 0, 20), padding: 26, width: 300}}><div style={{color: colors.accent, fontSize: 26, fontWeight: 700}}>{label}</div><div style={{color: colors.muted, fontSize: 18, marginTop: 10}}>{detail}</div></div>;
};

export const MetricCard: React.FC<{label: string; value: string}> = ({label, value}) => <div style={{backgroundColor: colors.panel, borderRadius: 16, color: colors.text, padding: "22px 28px", width: 240}}><div style={{color: colors.muted, fontSize: 18}}>{label}</div><div style={{fontSize: 48, fontWeight: 700, marginTop: 8}}>{value}</div></div>;

export const Cursor: React.FC<{active?: boolean}> = ({active}) => {
  const frame = useCurrentFrame();
  const opacity = active ? highlightProgress(frame, 0, 24) : 1;
  return <div style={{color: colors.cyan, fontSize: 52, opacity, transform: "rotate(-18deg)"}}>↖</div>;
};

export const Badge: React.FC<{label: string}> = ({label}) => <div style={{backgroundColor: colors.accent, borderRadius: 999, color: "#1e1b4b", fontSize: 18, fontWeight: 700, padding: "10px 18px"}}>{label}</div>;

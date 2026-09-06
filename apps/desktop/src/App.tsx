import React, {useMemo, useState} from "react";
import {Player} from "@remotion/player";
import {compileStoryboard} from "@motion-studio/compiler";
import {MotionStudioComposition, createDefaultRegistry} from "@motion-studio/renderer-remotion";
import {SemanticResolver} from "@motion-studio/resolver";
import cacheHit from "../../../examples/cache-hit/storyboard.json";
import architecture from "../../../examples/architecture/storyboard.json";
import productDemo from "../../../examples/product-demo/storyboard.json";
import {renderCommand, sceneSummary, timelinePercent} from "./model";

const registry = createDefaultRegistry();
const resolver = new SemanticResolver(registry);
const projects = [
  {id: "cache-hit", label: "Cache hit", source: cacheHit, path: "examples/cache-hit/storyboard.json"},
  {id: "architecture", label: "Architecture", source: architecture, path: "examples/architecture/storyboard.json"},
  {id: "product-demo", label: "Product demo", source: productDemo, path: "examples/product-demo/storyboard.json"},
].map((project) => ({...project, plan: compileStoryboard(project.source)}));

const tabs = ["Preview", "Timeline", "Inspector", "Plugins"] as const;
type Tab = (typeof tabs)[number];

export default function App() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const [sceneId, setSceneId] = useState(projects[0].plan.scenes[0]?.id ?? "");
  const [tab, setTab] = useState<Tab>("Preview");
  const [prompt, setPrompt] = useState("");
  const [renderStatus, setRenderStatus] = useState<"idle" | "queued">("idle");
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const selectedScene = project.plan.scenes.find((scene) => scene.id === sceneId) ?? project.plan.scenes[0];
  const selectedProviders = useMemo(() => selectedScene?.elements.map((element) => resolver.resolve({capability: element.capability, sceneType: selectedScene.type, intents: selectedScene.sceneIntent, theme: selectedScene.theme})), [selectedScene]);

  function selectProject(id: string) {
    const next = projects.find((item) => item.id === id) ?? projects[0];
    setProjectId(next.id);
    setSceneId(next.plan.scenes[0]?.id ?? "");
    setTab("Preview");
  }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark">✦</span><span>Motion Studio</span><span className="version">DESKTOP 0.1</span></div>
      <div className="top-actions"><span className="status-dot" /> Engine ready <button className="ghost-button" onClick={() => setRenderStatus("queued")}>{renderStatus === "queued" ? "Render queued" : "Render video"}</button></div>
    </header>
    <div className="workspace">
      <aside className="sidebar left-sidebar">
        <div className="section-heading"><span>PROJECTS</span><button className="icon-button" aria-label="Create project">＋</button></div>
        <div className="project-list">{projects.map((item) => <button className={`project-item ${item.id === project.id ? "selected" : ""}`} key={item.id} onClick={() => selectProject(item.id)}><span className="file-icon">◇</span><span><strong>{item.label}</strong><small>{sceneSummary(item.plan)}</small></span></button>)}</div>
        <div className="section-heading scene-heading"><span>SCENES</span><span className="count">{project.plan.scenes.length}</span></div>
        <div className="scene-list">{project.plan.scenes.map((scene) => <button className={`scene-item ${scene.id === selectedScene?.id ? "selected" : ""}`} key={scene.id} onClick={() => setSceneId(scene.id)}><span className="scene-number">{String(project.plan.scenes.indexOf(scene) + 1).padStart(2, "0")}</span><span>{scene.id}</span><span className="scene-type">{scene.type}</span></button>)}</div>
        <div className="sidebar-footer"><span className="avatar">C</span><span>Core workspace</span><span className="chevron">⌄</span></div>
      </aside>
      <main className="main-panel">
        <div className="breadcrumb"><span>{project.label}</span><span>/</span><strong>{selectedScene?.id}</strong><span className="theme-chip">{selectedScene?.theme ?? "technical-dark"}</span></div>
        <section className="preview-card"><div className="preview-toolbar"><div><span className="live-pill"><span className="status-dot" /> LIVE PREVIEW</span><span className="preview-meta">{project.plan.width} × {project.plan.height}</span></div><div className="toolbar-actions"><button className="toolbar-button">Fit</button><button className="toolbar-button">100%</button><button className="toolbar-button">⋯</button></div></div><div className="player-wrap"><Player component={MotionStudioComposition} inputProps={{plan: project.plan, registry, resolver}} durationInFrames={project.plan.durationInFrames} fps={project.plan.fps} compositionHeight={project.plan.height} compositionWidth={project.plan.width} controls style={{width: "100%"}} /></div></section>
        <div className="tabbar">{tabs.map((item) => <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}{item === "Plugins" && <span className="tab-count">{registry.listPlugins().length}</span>}</button>)}</div>
        <section className="lower-panel">{tab === "Preview" && <PreviewNotes project={project.label} />}{tab === "Timeline" && selectedScene && <Timeline scene={selectedScene} totalFrames={project.plan.durationInFrames} />}{tab === "Inspector" && selectedScene && <Inspector scene={selectedScene} providers={selectedProviders} />}{tab === "Plugins" && <PluginList />}</section>
      </main>
      <aside className="sidebar right-sidebar">
        <div className="panel-title">AGENT PANEL <span className="sparkle">✦</span></div>
        <div className="agent-intro"><div className="agent-icon">✦</div><div><strong>Storyboard assistant</strong><p>Describe a change and I’ll help you express it with existing capabilities.</p></div></div>
        <div className="prompt-box"><textarea aria-label="Storyboard prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="e.g. Add a cache hit highlight after Redis..." /><div className="prompt-footer"><span>Storyboard IR only</span><button className="send-button" onClick={() => setPrompt("")} aria-label="Submit prompt">↑</button></div></div>
        <div className="suggestions"><span>TRY ASKING</span><button onClick={() => setPrompt("Show the request flow from API to Redis")}>Show the request flow from API to Redis</button><button onClick={() => setPrompt("Add a product feature card")}>Add a product feature card</button></div>
        <div className="render-manager"><div className="section-heading"><span>RENDER MANAGER</span><span className={`render-state ${renderStatus}`}>{renderStatus === "queued" ? "QUEUED" : "READY"}</span></div><div className="render-row"><span className="render-file">{project.label}.mp4</span><button className="small-button" onClick={() => navigator.clipboard?.writeText(renderCommand(project.path))}>Copy CLI</button></div><code>{renderCommand(project.path)}</code></div>
      </aside>
    </div>
  </div>;
}

function PreviewNotes({project}: {project: string}) { return <div className="empty-state"><span className="empty-icon">✦</span><strong>{project} preview is ready</strong><p>Use the player controls above to inspect the deterministic composition.</p></div>; }

function Timeline({scene, totalFrames}: {scene: NonNullable<ReturnType<typeof compileStoryboard>["scenes"]>[number]; totalFrames: number}) { return <div className="timeline-view"><div className="timeline-header"><strong>{scene.id}</strong><span>{scene.durationInFrames} frames</span></div>{scene.timeline.map((event) => <div className="timeline-row" key={event.id}><span>{event.id}</span><div className="track"><div className="event-bar" style={{width: `${Math.max(8, timelinePercent(event.startFrame, event.durationInFrames, totalFrames))}%`}} /></div><span>{event.action}</span></div>)}</div>; }

function Inspector({scene, providers}: {scene: NonNullable<ReturnType<typeof compileStoryboard>["scenes"]>[number]; providers: ReturnType<SemanticResolver["resolve"]>[] | undefined}) { return <div className="inspector-view"><div className="inspector-header"><strong>Scene Inspector</strong><span>{scene.type}</span></div><div className="inspector-grid"><label>Intent<span>{scene.sceneIntent.join(", ") || "—"}</span></label><label>Theme<span>{scene.theme ?? "technical-dark"}</span></label><label>Elements<span>{scene.elements.length}</span></label><label>Providers<span>{providers?.length ?? 0} resolved</span></label></div><div className="element-list">{scene.elements.map((element) => <div className="element-row" key={element.id}><span>{element.id}</span><code>{element.capability}</code></div>)}</div></div>; }

function PluginList() { return <div className="plugin-view">{registry.listPlugins().map((plugin) => <div className="plugin-card" key={plugin.id}><div><strong>{plugin.id.replace("@motion-studio/", "")}</strong><small>v{plugin.version} · core {plugin.core}</small></div><span>{plugin.components.length} components</span></div>)}</div>; }

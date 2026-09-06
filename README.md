# Motion Studio

Motion Studio is an AI-native, extensible, plugin-based motion graphics system built on top of Remotion.

The core idea is simple:

> AI decides **what should happen and why**.  
> The Motion Engine decides **how it should happen**.  
> Remotion renders the final result.

The system is designed to avoid generating arbitrary React/Remotion code for every animation. Instead, coding agents such as Claude Code or Codex create and edit a structured storyboard that is resolved against reusable scenes, components, layouts, themes, and motion plugins.

## Goals

- Reuse motion primitives instead of regenerating animation code.
- Keep generated output deterministic and validated.
- Let coding agents act as directors/choreographers rather than low-level animators.
- Support semantic plugin discovery and future marketplace distribution.
- Start CLI-first, then add a desktop GUI.
- Keep the Motion Core independent from the desktop application.

## Initial Stack

- **Motion Core:** TypeScript
- **Rendering:** React + Remotion
- **Validation:** Zod
- **Testing:** Vitest
- **Monorepo:** pnpm + Turborepo
- **CLI:** Go
- **Desktop:** Tauri + React + TypeScript
- **Agent Layer:** Claude Code / Codex

## High-Level Flow

```text
User / Source Content
        ↓
Claude Code / Codex
        ↓
Scene + Intent Planning
        ↓
Storyboard / Motion IR
        ↓
Semantic Resolver
        ↓
Plugin Registry
        ↓
Validation
        ↓
Timeline + Layout Compiler
        ↓
Render Plan
        ↓
Remotion Adapter
        ↓
Preview / MP4
```

## Development Philosophy

The project should prove the engine before building the cockpit.

The first meaningful milestone is:

> Render a hand-written `storyboard.json` through the plugin registry and Motion Core into a valid Remotion video without using AI.

See `docs/ROADMAP.md` for the implementation order.

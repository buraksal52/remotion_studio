# Motion Studio Backlog

This document tracks work defined by `docs/ROADMAP.md`. A phase is marked
complete only after all of its roadmap deliverables, exit criteria, and
required tests are complete.

## Phase 0 — Bootstrap

Status: Complete

### Deliverables

- [x] pnpm workspace
- [x] Turborepo configuration
- [x] TypeScript configuration
- [x] Vitest configuration through package scripts
- [x] Example Remotion composition
- [x] Basic Go CLI skeleton
- [x] Go CLI can invoke a Node process
- [x] One command runs tests
- [x] One command launches a Remotion example

### Validation

- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] TypeScript build passes
- [x] Remotion example launches
- [x] Go CLI invokes Node successfully

## Phase 1 — Storyboard IR

Status: Complete

### Deliverables

- [x] Storyboard schema
- [x] Scene schema
- [x] Element schema
- [x] Motion action schema
- [x] Layout schema
- [x] Timeline event schema
- [x] Zod validation
- [x] Hero fixture storyboard
- [x] API → Redis cache-flow fixture storyboard
- [x] Schema documentation

### Validation

- [x] Valid storyboard parses
- [x] Invalid fields fail
- [x] Unknown enum values fail
- [x] Version mismatch fails
- [x] Useful validation errors are exposed
- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] Existing Phase 0 behavior remains intact

## Phase 2 — Deterministic Remotion Rendering

Status: Complete

### Deliverables

- [x] Basic Storyboard compiler
- [x] RenderPlan model
- [x] Remotion adapter
- [x] Two usable scene types: `hero` and `request-flow`
- [x] Reusable visual components: HeroText, ServiceNode, DatabaseNode, Connection
- [x] Motion primitives: fade, slide, scale, spring, draw
- [x] Storyboard-driven cache-hit render example

### Validation

- [x] Compiler output is deterministic
- [x] Timeline dependencies compile to frame ranges
- [x] Timeline cycles are rejected
- [x] Unknown timeline element references are rejected
- [x] Unit tests pass
- [x] Full workspace tests pass
- [x] TypeScript build passes
- [x] Go CLI regression tests pass
- [x] Cache-hit Storyboard renders to MP4 without AI

## Phase 3 — Plugin Runtime

Status: Not started

## Phase 4 — Semantic Resolution

Status: Not started

## Phase 5 — Timeline + Layout Compiler

Status: Not started

## Phase 6 — Go CLI MVP

Status: Not started

## Phase 7 — Agent Integration

Status: Not started

## Phase 8 — Built-in Packs

Status: Not started

## Phase 9 — Markdown / Declarative Authoring

Status: Not started

## Phase 10 — Desktop GUI

Status: Not started

## Phase 11 — Plugin SDK Maturity

Status: Not started

## Phase 12 — Marketplace

Status: Not started

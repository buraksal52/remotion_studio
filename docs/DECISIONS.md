# Architecture Decision Log

This document records important decisions so the project does not repeatedly reopen settled questions.

---

## ADR-001 — Remotion as initial rendering backend

**Status:** Accepted

Remotion will be the initial rendering backend.

Reason:
- React/TypeScript ecosystem
- programmable frame-level animation
- strong fit with reusable components
- existing familiarity

Core will compile to a RenderPlan before the Remotion adapter.

---

## ADR-002 — Storyboard as intermediate representation

**Status:** Accepted

Agents and future GUIs will author Storyboards rather than low-level Remotion code.

Reason:
- validation
- deterministic compilation
- lower agent context usage
- reuse
- plugin independence

---

## ADR-003 — Agent does not own low-level motion implementation

**Status:** Accepted

Agents should primarily produce:
- intent
- scene structure
- semantic actions
- ordering

Motion Engine owns actual low-level motion.

---

## ADR-004 — Capability-based plugin system

**Status:** Accepted

Storyboard requests semantic capabilities instead of concrete component class names where practical.

Reason:
- plugin/theme replacement
- provider abstraction
- marketplace compatibility

---

## ADR-005 — Semantic metadata + hard constraints

**Status:** Accepted

Plugin components expose both positive and negative usage guidance.

Hard compatibility rules are enforced independently from LLM judgement.

---

## ADR-006 — CLI before GUI

**Status:** Accepted

The first full workflow will be CLI-based.

Reason:
- validates core product before UI work
- easier testing
- enables agents
- reduces early scope

---

## ADR-007 — Go CLI

**Status:** Accepted for prototype

CLI will be implemented in Go.

TypeScript remains the Motion Core language.

The Go CLI orchestrates; it does not duplicate engine logic.

Revisit if cross-language process overhead becomes a material development burden.

---

## ADR-008 — Desktop-first GUI

**Status:** Planned

Desktop GUI will use Tauri + React after CLI/core maturity.

Authoring is desktop-first because of:
- local files
- local assets
- plugins
- rendering
- coding-agent integration

---

## ADR-009 — Marketplace deferred

**Status:** Accepted

Architecture may support future plugin distribution, but marketplace implementation is out of MVP scope.

---

## ADR-010 — Deterministic rule-based resolver first

**Status:** Accepted

Do not introduce embeddings/ML-based recommendation in MVP.

Use:
- capability match
- semantic tags
- compatibility constraints
- deterministic scoring

Only add semantic search when registry scale proves it necessary.

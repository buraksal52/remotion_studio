# MVP Scope

## MVP Goal

Prove that a declarative storyboard can be compiled through a semantic plugin system into a deterministic Remotion render.

## Must Have

- Storyboard JSON
- Zod schema
- RenderPlan
- Remotion adapter
- plugin registry
- capability resolver
- semantic compatibility rules
- basic timeline compilation
- basic layout abstraction
- Go CLI
- agent-friendly capability inspection
- one useful technical animation demo

## Initial Built-In Content

### Scene types
Suggested:
- hero
- text-explainer
- architecture
- request-flow
- code
- comparison

### Components
Suggested:
- HeroText
- TextBlock
- ServiceNode
- DatabaseNode
- Connection
- Badge
- CodeBlock
- Terminal
- BrowserWindow
- Loader
- Metric
- Progress

### Motion
Suggested:
- fade
- slide
- spring
- scale
- stagger
- draw-connection
- highlight
- pulse
- text-reveal

### Layouts
- center
- split
- flow
- grid

## Explicitly Not MVP

- marketplace
- cloud account
- billing
- collaboration
- TTS
- music sync
- beat detection
- Figma import
- sophisticated timeline editor
- drag-and-drop editing
- animation graph editor
- custom DSL parser beyond JSON
- remote render farm
- plugin sandboxing
- recommendation embeddings
- full GUI

## MVP Success Test

Given:

> “Show an API request going to Redis and indicate a cache hit.”

The system should be able to represent it declaratively, resolve compatible visual components, validate them, compile timing/layout, and render a polished Remotion video.

If the user replaces the visual plugin/theme, the storyboard should remain mostly unchanged.

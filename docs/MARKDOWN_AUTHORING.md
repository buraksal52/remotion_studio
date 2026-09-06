# Markdown Authoring

Markdown is a human-friendly authoring format that compiles to the same
Storyboard IR used by JSON, agents, and the renderer.

## Minimal syntax

```md
# How RAG Works

:::architecture
User -> Embedding -> VectorDB -> LLM
:::
```

The level-one heading becomes `metadata.title`. Each `:::scene-type` block
becomes one scene. Arrow-separated labels become elements and deterministic
timeline events.

## Scene attributes

Attributes are optional `key=value` tokens on the opening directive:

```md
# Product Demo

:::product-demo id=launch layout=grid columns=2 intent=show-feature tone=playful
Browser -> Screenshot -> Feature
:::
```

Supported attributes are `id`, `layout`, `direction`, `columns`, `intent`, and
`tone`. Supported layouts are `flow`, `center`, `split`, `grid`, and `graph`.
The document metadata defaults to 30 FPS, 1920×1080, and `technical-dark`.

## Compilation

The TypeScript API is:

```ts
import {compileMarkdown} from "@motion-studio/markdown";

const storyboard = compileMarkdown(markdownSource);
```

From the project CLI, compile a file into a JSON Storyboard:

```bash
motion compile explainer.md --output storyboard.json
```

The compiler validates the result with `StoryboardSchema`. It does not emit
Remotion code, coordinates, or CSS. After compilation, run normal semantic
validation and rendering against the resulting Storyboard.

Markdown is intentionally small in this phase. Unsupported syntax should be
expressed in JSON Storyboard IR until a later phase defines it explicitly.

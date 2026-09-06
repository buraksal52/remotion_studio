# Agent Workflow

Motion Studio agents (Claude Code, Codex, or another coding agent) work at the
Storyboard IR level. The agent chooses intent and capabilities; the engine
chooses provider implementations, timing, layout, and motion details.

Motion Studio also includes a local deterministic planner for prompt-to-preview
experiments:

```bash
motion agent "Show an API request going to Redis and indicate a cache hit" --preview
```

It produces a validated `out/agent-storyboard.json`. This planner is an
embedded baseline, not an LLM; external LLM adapters can be added later while
keeping the same Storyboard and validation boundary.

## Canonical loop

1. Inspect available capabilities:

   ```bash
   motion capabilities --json
   motion capabilities --scene request-flow --intent show-data-flow --json
   ```

2. Create or open a project:

   ```bash
   motion new cache-explainer
   ```

3. Edit only the project's `storyboard.json`. Use an existing capability and
   semantic actions such as `enter`, `connect`, and `activate`.

4. Validate before previewing or rendering:

   ```bash
   motion validate --storyboard cache-explainer/storyboard.json --json
   ```

5. If validation fails, change the smallest relevant part of the storyboard
   and run the same validation command again. Do not work around a failure by
   writing custom Remotion code.

6. Preview and render only after validation succeeds:

   ```bash
   motion preview --storyboard cache-explainer/storyboard.json
   motion render --storyboard cache-explainer/storyboard.json --output out/cache-explainer.mp4
   ```

## Safe storyboard patch workflow

Storyboard edits should be reviewable and reversible:

- inspect the current scene and query relevant capabilities first;
- make one focused JSON change at a time;
- validate the changed file before preview or render;
- keep the original file until validation succeeds;
- preserve scene IDs, element IDs, and event IDs unless the change requires
  renaming them;
- never add raw CSS, arbitrary pixel animation, or Remotion imports to the
  Storyboard.

For a larger change, an agent should work in a temporary copy, validate it,
then copy the validated `storyboard.json` into the project as the final patch.
The CLI is intentionally read-only during validation and rendering does not
modify the storyboard.

## Recovering from validation errors

The validation loop is deliberately layered:

| Error kind | Agent action |
| --- | --- |
| Schema error | Fix the field shape, enum, or required value. |
| Timeline/compiler error | Fix missing references, duplicate IDs, or dependency cycles. |
| Semantic error | Choose a capability allowed for the scene and intent. |
| Capability error | Query `motion capabilities --json` and use an eligible provider. |

After each fix, rerun `motion validate`. The agent should not guess provider
IDs or bypass the registry.

## Definition of done

An agent-created storyboard is complete when:

- `motion validate` succeeds;
- every element resolves through the plugin registry;
- timeline dependencies compile deterministically;
- the project can be previewed or rendered without editing Remotion internals.

See `examples/agent-created/storyboard.json` for a minimal valid result.

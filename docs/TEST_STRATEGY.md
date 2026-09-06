# Test Strategy

## Goals

The most important properties are:
- determinism
- schema correctness
- semantic safety
- plugin compatibility
- stable compilation

## Unit Tests

### Schema
- valid storyboard parses
- invalid fields fail
- unknown enum values fail
- version mismatch behavior

### Registry
- plugin registration
- duplicate capability handling
- provider priority
- compatibility filtering

### Resolver
- valid component chosen
- forbidden component rejected
- fallback provider chosen
- no provider error

### Timeline
- dependency ordering
- multiple dependencies
- explicit start
- cycle detection
- deterministic frame output

### Layout
- deterministic output
- no missing node positions
- flow direction behavior

## Integration Tests

Pipeline:

```text
Storyboard
→ Validate
→ Resolve
→ Compile
→ RenderPlan
```

Use fixture Storyboards.

## Render Smoke Tests

Do not rely only on visual inspection.

At minimum:
- render several known frames
- assert render completes
- assert output duration
- assert dimensions
- assert no runtime error

Visual regression can be added later.

## CLI Tests

- exit codes
- JSON output
- invalid project behavior
- Node runtime invocation
- render progress parsing

## Plugin Contract Tests

Plugin SDK should eventually expose a reusable conformance test suite.

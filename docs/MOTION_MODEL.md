# Motion Model

## Three-Level Motion Abstraction

The animation model has three levels.

## 1. Semantic Actions

Used by agents and high-level authoring tools.

Examples:
- enter
- exit
- activate
- connect
- focus
- highlight
- reveal
- progress

These describe intent, not implementation.

## 2. Motion Presets

Resolved by the active motion pack/theme.

Examples:
- node-enter
- success-pulse
- connection-draw
- text-reveal
- dashboard-reveal

A theme or plugin may map the same semantic action differently.

Example:

```text
Semantic action:
enter

Minimal pack:
fade + 8px translate

Technical pack:
spring + subtle glow

Cinematic pack:
blur + scale + fade
```

## 3. Animation Primitives

Actual low-level motion behavior.

Examples:
- opacity
- translate
- scale
- spring
- interpolate
- blur
- path length
- stagger

Remotion executes these primitive calculations frame-by-frame.

## Responsibility Split

```text
Agent
"What should happen?"

Motion Resolver
"Which preset expresses that intent?"

Motion Primitive
"How is that preset mathematically animated?"

Remotion
"What should be rendered on this frame?"
```

## Important Rule

Agents should not normally choose low-level primitive values.

Bad:

```json
{
  "scale": [1, 1.08, 1],
  "frames": [0, 8, 20]
}
```

Preferred:

```json
{
  "action": "activate"
}
```

or, when needed:

```json
{
  "action": "activate",
  "preset": "success-pulse"
}
```

# Immediate Next Steps

## First Development Session

1. Create monorepo.
2. Add `packages/schema`.
3. Define Storyboard v0.1 with Zod.
4. Add two fixture Storyboards:
   - hero
   - API → Redis cache flow
5. Add schema tests.
6. Create `renderer-remotion` package.
7. Render the simplest storyboard manually.

Do not build plugin discovery first.

The first question to answer is:

> Can a clean Storyboard IR produce a useful Remotion video?

## First Technical Milestone

Input:

```text
examples/cache-hit/storyboard.json
```

Pipeline:

```text
Zod
↓
Compile
↓
RenderPlan
↓
Remotion Adapter
↓
MP4
```

No AI.

No marketplace.

No desktop.

## Second Milestone

Move component ownership into a plugin:

```text
core-motion
```

Then prove:

```text
same storyboard
+
different provider/theme
=
different visual output
```

## Third Milestone

Add semantic rejection.

Test case:

```text
HeroScene + PremiumLoader
```

Expected:

```text
semantic validation error
```

At that point, the main architectural thesis of the project is proven.

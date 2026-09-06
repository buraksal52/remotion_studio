# Motion Studio Desktop

The desktop application is a Tauri shell around the same TypeScript compiler,
plugin registry, semantic resolver, and Remotion Player used by the CLI.

Run the frontend during development:

```bash
pnpm --filter @motion-studio/desktop dev
```

The native shell is configured under `src-tauri/`. Rendering remains a CLI
operation in this phase; the Render Manager exposes the exact `motion render`
handoff command so the GUI and CLI share the same runtime path.

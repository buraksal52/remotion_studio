# Marketplace Specification

## Phase 12 scope

The first marketplace layer is a deterministic local catalog and installed
state contract. It supports discovery, compatibility filtering, install,
update, and remove operations without executing downloaded code.

The catalog is stored at `marketplace/catalog.json`. Project-installed state is
stored at `motion-plugins.json`. Both files are versioned and validated before
use.

## CLI

```bash
motion plugins list [--json]
motion plugins search <query> [--json]
motion plugin add <plugin-id> [--json]
motion plugin update <plugin-id> [--json]
motion plugin remove <plugin-id> [--json]
```

The CLI delegates catalog/state operations to the TypeScript runtime. Plugin
install currently records a compatible, trusted package in project state; it
does not download or execute native code. Runtime registry loading remains an
explicit future adapter so arbitrary remote code cannot silently enter a
render process.

## Future remote marketplace

A later implementation may add signed package downloads, publisher identity,
ratings, paid packages, and revenue sharing. Those services must preserve the
same manifest compatibility checks and add authentication, integrity, and
trust policy before native plugin execution.

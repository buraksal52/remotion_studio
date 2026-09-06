# `@motion-studio/resolver`

The semantic resolver selects an eligible capability provider using hard
compatibility rules followed by deterministic scoring. It does not use
embeddings or ML recommendations.

Hard constraints always win over score:

- forbidden scene
- scene outside `allowedScenes`
- missing `requiredContext`
- explicit `doNotUseWhen` intent

import {parseStoryboard, type Storyboard} from "@motion-studio/schema";

export type AgentPlan = {
  storyboard: Storyboard;
  matchedIntent: string;
  explanation: string;
};

/**
 * Local deterministic agent used when no external LLM adapter is configured.
 * It plans in Storyboard IR and only chooses registered capabilities/actions.
 */
export function planPrompt(prompt: string): AgentPlan {
  const normalized = prompt.trim().toLocaleLowerCase();
  if (!normalized) throw new Error("Agent prompt cannot be empty");

  if (/(redis|cache|api|request|endpoint)/.test(normalized)) {
    return {
      matchedIntent: "explain-cache-hit",
      explanation: "Request-flow plan selected from API/cache language.",
      storyboard: parseStoryboard({
        version: "0.1",
        metadata: {title: prompt.trim(), fps: 30, width: 1920, height: 1080, theme: "technical-dark"},
        scenes: [{
          id: "agent-request-flow",
          type: "request-flow",
          intent: {primary: "explain-cache-hit", secondary: ["show-data-flow"], tone: "technical"},
          layout: {type: "flow", direction: "LR"},
          elements: [
            {id: "api", capability: "diagram.node.service", props: {label: "API"}, animation: [{action: "enter"}]},
            {id: "redis", capability: "diagram.node.database", props: {label: "Redis"}, semantic: {role: "cache"}, animation: [{action: "enter"}, {action: "activate"}]},
          ],
          timeline: [
            {id: "api-enter", action: "enter", target: "api"},
            {id: "redis-enter", action: "enter", target: "redis", after: "api-enter"},
            {id: "connection-draw", action: "connect", from: "api", to: "redis", after: "redis-enter"},
            {id: "redis-activate", action: "activate", target: "redis", after: "connection-draw"},
          ],
        }],
      }),
    };
  }

  if (/(rag|architecture|system|database|embedding|vector)/.test(normalized)) {
    return {
      matchedIntent: "explain-architecture",
      explanation: "Architecture-flow plan selected from system/RAG language.",
      storyboard: parseStoryboard({
        version: "0.1",
        metadata: {title: prompt.trim(), fps: 30, width: 1920, height: 1080, theme: "technical-dark"},
        scenes: [{
          id: "agent-architecture",
          type: "architecture",
          intent: {primary: "explain-architecture", secondary: ["show-data-flow"], tone: "technical"},
          layout: {type: "flow", direction: "LR"},
          elements: [
            {id: "source", capability: "diagram.node.client", props: {label: "User"}, animation: [{action: "enter"}]},
            {id: "embedding", capability: "diagram.node.gateway", props: {label: "Embedding"}, animation: [{action: "enter"}]},
            {id: "vector-db", capability: "diagram.node.cache", props: {label: "Vector DB"}, animation: [{action: "enter"}]},
          ],
          timeline: [
            {id: "source-enter", action: "enter", target: "source"},
            {id: "embedding-enter", action: "enter", target: "embedding", after: "source-enter"},
            {id: "vector-db-enter", action: "enter", target: "vector-db", after: "embedding-enter"},
            {id: "architecture-connect", action: "connect", from: "source", to: "embedding", after: "vector-db-enter"},
          ],
        }],
      }),
    };
  }

  if (/(product|feature|browser|dashboard|demo)/.test(normalized)) {
    return {
      matchedIntent: "show-feature",
      explanation: "Product-demo plan selected from product/feature language.",
      storyboard: parseStoryboard({
        version: "0.1",
        metadata: {title: prompt.trim(), fps: 30, width: 1920, height: 1080, theme: "product-dark"},
        scenes: [{
          id: "agent-product-demo",
          type: "product-demo",
          intent: {primary: "show-feature", tone: "playful"},
          layout: {type: "grid", columns: 2},
          elements: [
            {id: "browser", capability: "product.browser", props: {label: "Product"}, animation: [{action: "enter"}]},
            {id: "feature", capability: "product.feature-card", props: {label: prompt.trim()}, animation: [{action: "reveal"}]},
          ],
          timeline: [
            {id: "browser-enter", action: "enter", target: "browser"},
            {id: "feature-reveal", action: "reveal", target: "feature", after: "browser-enter"},
          ],
        }],
      }),
    };
  }

  return {
    matchedIntent: "introduce-motion-studio",
    explanation: "Hero plan selected as the safe fallback for a general prompt.",
    storyboard: parseStoryboard({
      version: "0.1",
      metadata: {title: prompt.trim(), fps: 30, width: 1920, height: 1080, theme: "technical-dark"},
      scenes: [{
        id: "agent-hero",
        type: "hero",
        intent: {primary: "introduce-motion-studio", tone: "technical"},
        layout: {type: "center"},
        elements: [{id: "title", capability: "ui.hero-text", props: {text: prompt.trim()}, animation: [{action: "enter"}]}],
        timeline: [{id: "title-enter", action: "enter", target: "title"}],
      }],
    }),
  };
}

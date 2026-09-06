import {defineComponent, definePlugin} from "@motion-studio/plugin-sdk";
import {Connection, DatabaseNode, HeroText, ServiceNode} from "./components";

export const coreMotionPlugin = definePlugin({
  id: "@motion-studio/core-motion",
  version: "0.1.0",
  core: "^0.1.0",
  themes: ["technical-dark"],
  capabilities: ["ui.hero-text", "diagram.node.service", "diagram.node.database", "diagram.connection.request"],
  components: [
    defineComponent({id: "hero-text", capability: "ui.hero-text", allowedScenes: ["hero"], intents: ["introduce-motion-studio"], priority: 10, component: HeroText}),
    defineComponent({id: "service-node", capability: "diagram.node.service", allowedScenes: ["request-flow"], intents: ["show-data-flow"], priority: 10, component: ServiceNode}),
    defineComponent({id: "database-node", capability: "diagram.node.database", allowedScenes: ["request-flow"], intents: ["show-data-flow"], priority: 10, component: DatabaseNode}),
    defineComponent({id: "connection", capability: "diagram.connection.request", allowedScenes: ["request-flow", "architecture", "pipeline"], intents: ["show-data-flow", "explain-architecture", "show-processing"], priority: 10, component: Connection}),
  ],
});

export {Connection, DatabaseNode, HeroText, ServiceNode} from "./components";
export {drawProgress, fadeProgress, highlightProgress, progressFill, revealProgress, scaleProgress, slideOffset, springProgress} from "./motion";

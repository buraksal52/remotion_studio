import {defineComponent, definePlugin} from "@motion-studio/plugin-sdk";
import {Connection, DatabaseNode, HeroText, ServiceNode} from "./components";

export const coreMotionPlugin = definePlugin({
  id: "@motion-studio/core-motion",
  version: "0.1.0",
  core: "^0.1.0",
  capabilities: ["ui.hero-text", "diagram.node.service", "diagram.node.database", "diagram.connection.request"],
  components: [
    defineComponent({id: "hero-text", capability: "ui.hero-text", priority: 10, component: HeroText}),
    defineComponent({id: "service-node", capability: "diagram.node.service", priority: 10, component: ServiceNode}),
    defineComponent({id: "database-node", capability: "diagram.node.database", priority: 10, component: DatabaseNode}),
    defineComponent({id: "connection", capability: "diagram.connection.request", priority: 10, component: Connection}),
  ],
});

export {Connection, DatabaseNode, HeroText, ServiceNode} from "./components";

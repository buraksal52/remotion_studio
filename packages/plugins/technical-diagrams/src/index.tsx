import {defineComponent, definePlugin} from "@motion-studio/plugin-sdk";
import {CacheNode, ClientNode, DataPacket, GatewayNode, PipelineStep, QueueNode} from "./components";

export const technicalDiagramsPlugin = definePlugin({
  id: "@motion-studio/technical-diagrams",
  version: "0.1.0",
  core: "^0.1.0",
  sdk: "^0.1.0",
  themes: ["technical-dark", "clean-light"],
  capabilities: ["diagram.node.client", "diagram.node.gateway", "diagram.node.queue", "diagram.node.cache", "diagram.data-packet", "diagram.pipeline-step"],
  components: [
    defineComponent({id: "client-node", capability: "diagram.node.client", allowedScenes: ["architecture", "request-flow"], intents: ["show-data-flow", "explain-architecture"], priority: 10, component: ClientNode}),
    defineComponent({id: "gateway-node", capability: "diagram.node.gateway", allowedScenes: ["architecture", "request-flow"], intents: ["explain-architecture"], priority: 10, component: GatewayNode}),
    defineComponent({id: "queue-node", capability: "diagram.node.queue", allowedScenes: ["architecture", "pipeline"], intents: ["explain-architecture", "show-processing"], priority: 10, component: QueueNode}),
    defineComponent({id: "cache-node", capability: "diagram.node.cache", allowedScenes: ["architecture", "request-flow"], intents: ["explain-cache-hit", "show-data-flow"], priority: 10, component: CacheNode}),
    defineComponent({id: "data-packet", capability: "diagram.data-packet", allowedScenes: ["request-flow", "pipeline"], intents: ["show-data-flow"], priority: 10, component: DataPacket}),
    defineComponent({id: "pipeline-step", capability: "diagram.pipeline-step", allowedScenes: ["pipeline"], intents: ["show-processing"], priority: 10, component: PipelineStep}),
  ],
});

export {CacheNode, ClientNode, DataPacket, GatewayNode, PipelineStep, QueueNode} from "./components";

import {defineComponent, definePlugin, testPluginConformance} from "@motion-studio/plugin-sdk";
import type {CSSProperties} from "react";

const ExampleCard = ({label = "Example"}: {label?: string}) => {
  const style: CSSProperties = {padding: 24, borderRadius: 16, background: "#1d2433", color: "white", fontFamily: "sans-serif"};
  return <div style={style}>{label}</div>;
};

export const examplePlugin = definePlugin({
  id: "@your-scope/motion-plugin",
  version: "0.1.0",
  core: "^0.1.0",
  sdk: "^0.1.0",
  capabilities: ["example.card"],
  themes: ["example-dark"],
  components: [defineComponent({
    id: "example-card",
    capability: "example.card",
    intents: ["show-example"],
    allowedScenes: ["example"],
    component: ExampleCard,
  })],
});

// Use this in a package test or CI check for a stable plugin contract.
export const examplePluginConformance = testPluginConformance(examplePlugin);

export {ExampleCard};

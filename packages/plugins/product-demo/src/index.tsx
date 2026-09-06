import {defineComponent, definePlugin} from "@motion-studio/plugin-sdk";
import {Badge, BrowserChrome, Cursor, FeatureCard, MetricCard, ProductScreenshot} from "./components";

export const productDemoPlugin = definePlugin({
  id: "@motion-studio/product-demo",
  version: "0.1.0",
  core: "^0.1.0",
  sdk: "^0.1.0",
  themes: ["product-dark", "clean-light"],
  capabilities: ["product.browser", "product.screenshot", "product.feature-card", "product.metric", "product.cursor", "product.badge"],
  components: [
    defineComponent({id: "browser-chrome", capability: "product.browser", allowedScenes: ["product-demo", "feature-demo"], intents: ["introduce-product"], priority: 10, component: BrowserChrome}),
    defineComponent({id: "product-screenshot", capability: "product.screenshot", allowedScenes: ["product-demo", "feature-demo"], intents: ["show-feature"], priority: 10, component: ProductScreenshot}),
    defineComponent({id: "feature-card", capability: "product.feature-card", allowedScenes: ["product-demo", "feature-demo", "product-overview"], intents: ["show-feature"], priority: 10, component: FeatureCard}),
    defineComponent({id: "metric-card", capability: "product.metric", allowedScenes: ["product-overview"], intents: ["show-metrics"], priority: 10, component: MetricCard}),
    defineComponent({id: "cursor", capability: "product.cursor", allowedScenes: ["product-demo", "feature-demo"], intents: ["show-feature"], priority: 10, component: Cursor}),
    defineComponent({id: "badge", capability: "product.badge", allowedScenes: ["product-overview", "feature-demo"], intents: ["show-feature"], priority: 10, component: Badge}),
  ],
});

export {Badge, BrowserChrome, Cursor, FeatureCard, MetricCard, ProductScreenshot} from "./components";

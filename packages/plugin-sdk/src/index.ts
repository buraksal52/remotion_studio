import type {ComponentType} from "react";

export type PluginComponent<Props = any> = ComponentType<Props>;

export type ComponentDefinition<Props = any> = {
  id: string;
  capability: string;
  priority?: number;
  intents?: string[];
  useWhen?: string[];
  doNotUseWhen?: string[];
  allowedScenes?: string[];
  forbiddenScenes?: string[];
  requiredContext?: string[];
  component: PluginComponent<Props>;
};

export type PluginDefinition = {
  id: string;
  version: string;
  core: string;
  capabilities: string[];
  components: ComponentDefinition[];
  themes?: string[];
};

export function defineComponent<Props = any>(
  definition: ComponentDefinition<Props>,
): ComponentDefinition<Props> {
  return definition;
}

export function definePlugin(definition: PluginDefinition): PluginDefinition {
  if (definition.capabilities.length === 0) {
    throw new Error(`Plugin "${definition.id}" must provide at least one capability`);
  }
  if (definition.components.length === 0) {
    throw new Error(`Plugin "${definition.id}" must provide at least one component`);
  }

  const declaredCapabilities = new Set(definition.capabilities);
  for (const component of definition.components) {
    if (!declaredCapabilities.has(component.capability)) {
      throw new Error(`Plugin "${definition.id}" does not declare capability "${component.capability}"`);
    }
  }

  return definition;
}

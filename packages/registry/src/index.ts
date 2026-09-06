import {
  isCoreCompatible,
  MOTION_STUDIO_PLUGIN_SDK_VERSION,
  validatePlugin,
  type ComponentDefinition,
  type PluginDefinition,
} from "@motion-studio/plugin-sdk";

export type CapabilityProvider = {
  plugin: PluginDefinition;
  component: ComponentDefinition;
};

export class PluginRegistry {
  private readonly plugins = new Map<string, PluginDefinition>();
  private readonly componentIds = new Set<string>();

  public constructor(
    private readonly coreVersion = "0.1.0",
    private readonly sdkVersion = MOTION_STUDIO_PLUGIN_SDK_VERSION,
  ) {}

  public register(plugin: PluginDefinition): void {
    const contractErrors = validatePlugin(plugin);
    if (contractErrors.length > 0) {
      throw new Error(`Plugin "${plugin.id}" failed validation: ${contractErrors.join("; ")}`);
    }
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin "${plugin.id}" is already registered`);
    }
    if (!isCoreCompatible(plugin.core, this.coreVersion)) {
      throw new Error(`Plugin "${plugin.id}" requires core "${plugin.core}" but current core is "${this.coreVersion}"`);
    }
    if (plugin.sdk && !isCoreCompatible(plugin.sdk, this.sdkVersion)) {
      throw new Error(`Plugin "${plugin.id}" requires SDK "${plugin.sdk}" but current SDK is "${this.sdkVersion}"`);
    }

    const localComponentIds = new Set<string>();
    for (const component of plugin.components) {
      if (localComponentIds.has(component.id) || this.componentIds.has(component.id)) {
        throw new Error(`Component "${component.id}" is already registered`);
      }
      if (!plugin.capabilities.includes(component.capability)) {
        throw new Error(`Plugin "${plugin.id}" does not declare capability "${component.capability}"`);
      }
      localComponentIds.add(component.id);
    }

    this.plugins.set(plugin.id, plugin);
    for (const component of plugin.components) this.componentIds.add(component.id);
  }

  public listPlugins(): PluginDefinition[] {
    return [...this.plugins.values()].sort((a, b) => a.id.localeCompare(b.id));
  }

  public listCapabilities(): string[] {
    return [...new Set(this.listPlugins().flatMap((plugin) => plugin.capabilities))].sort();
  }

  public resolve(capability: string): CapabilityProvider {
    const providers = this.providersFor(capability);

    const provider = providers[0];
    if (!provider) throw new Error(`No provider registered for capability "${capability}"`);
    return provider;
  }

  public providersFor(capability: string): CapabilityProvider[] {
    return this.listPlugins()
      .flatMap((plugin) => plugin.components.filter((component) => component.capability === capability).map((component) => ({plugin, component})))
      .sort((a, b) => {
        const priorityDifference = (b.component.priority ?? 0) - (a.component.priority ?? 0);
        if (priorityDifference !== 0) return priorityDifference;
        const pluginDifference = a.plugin.id.localeCompare(b.plugin.id);
        return pluginDifference !== 0 ? pluginDifference : a.component.id.localeCompare(b.component.id);
      });
  }
}

export {isCoreCompatible};

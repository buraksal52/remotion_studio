import type {ComponentType} from "react";

export const MOTION_STUDIO_CORE_VERSION = "0.1.0" as const;
export const MOTION_STUDIO_PLUGIN_SDK_VERSION = "0.1.0" as const;

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
  /** Optional SDK range for plugins that need a specific SDK contract. */
  sdk?: string;
  capabilities: string[];
  components: ComponentDefinition[];
  themes?: string[];
  presets?: string[];
};

export function defineComponent<Props = any>(
  definition: ComponentDefinition<Props>,
): ComponentDefinition<Props> {
  if (!definition.id.trim()) throw new Error("Component ID must not be empty");
  if (!definition.capability.trim()) throw new Error(`Component "${definition.id}" must declare a capability`);
  if (typeof definition.component !== "function") throw new Error(`Component "${definition.id}" must provide an implementation`);
  return definition;
}

export function definePlugin(definition: PluginDefinition): PluginDefinition {
  const errors = validatePlugin(definition);
  if (errors.length > 0) throw new Error(`Plugin "${definition.id}" failed conformance:\n- ${errors.join("\n- ")}`);
  return definition;
}

export function validatePlugin(definition: PluginDefinition): string[] {
  const errors: string[] = [];
  if (!definition.id.trim()) errors.push("plugin id must not be empty");
  if (!isExactVersion(definition.version)) errors.push(`plugin "${definition.id}" has an invalid version "${definition.version}"`);
  if (!isVersionRange(definition.core)) errors.push(`plugin "${definition.id}" has an invalid core range "${definition.core}"`);
  if (definition.sdk !== undefined && !isVersionRange(definition.sdk)) errors.push(`plugin "${definition.id}" has an invalid SDK range "${definition.sdk}"`);
  if (definition.capabilities.length === 0) {
    errors.push(`plugin "${definition.id}" must provide at least one capability`);
  }
  if (definition.components.length === 0) {
    errors.push(`plugin "${definition.id}" must provide at least one component`);
  }

  const declaredCapabilities = new Set(definition.capabilities);
  if (declaredCapabilities.size !== definition.capabilities.length) errors.push(`plugin "${definition.id}" declares duplicate capabilities`);
  const componentIds = new Set<string>();
  for (const component of definition.components) {
    if (componentIds.has(component.id)) errors.push(`plugin "${definition.id}" declares duplicate component "${component.id}"`);
    componentIds.add(component.id);
    if (!declaredCapabilities.has(component.capability)) {
      errors.push(`plugin "${definition.id}" does not declare capability "${component.capability}"`);
    }
  }

  return errors;
}

export function assertPluginConformance(definition: PluginDefinition): void {
  const errors = validatePlugin(definition);
  if (errors.length > 0) throw new Error(`Plugin "${definition.id}" failed conformance:\n- ${errors.join("\n- ")}`);
}

export type PluginConformanceReport = {
  valid: boolean;
  errors: string[];
};

/** Small dependency-free harness for plugin package and CI tests. */
export function testPluginConformance(definition: PluginDefinition): PluginConformanceReport {
  const errors = validatePlugin(definition);
  return {valid: errors.length === 0, errors};
}

export function isCoreCompatible(range: string, version: string): boolean {
  return satisfiesVersionRange(range, version);
}

export function satisfiesVersionRange(range: string, version: string): boolean {
  const current = parseVersion(version);
  if (!current || range === "*") return current !== undefined;
  if (range === version) return true;
  const caret = range.startsWith("^") ? parseVersion(range.slice(1)) : undefined;
  if (caret) {
    const sameCompatibleBand = caret.major > 0
      ? current.major === caret.major
      : caret.minor > 0
        ? current.major === 0 && current.minor === caret.minor
        : current.major === 0 && current.minor === 0 && current.patch === caret.patch;
    return sameCompatibleBand && compareVersions(current, caret) >= 0;
  }
  const tilde = range.startsWith("~") ? parseVersion(range.slice(1)) : undefined;
  if (tilde) return current.major === tilde.major && current.minor === tilde.minor && compareVersions(current, tilde) >= 0;
  return false;
}

export function isExactVersion(version: string): boolean {
  return parseVersion(version) !== undefined;
}

export function isVersionRange(range: string): boolean {
  return range === "*" || isExactVersion(range) || (range.length > 1 && ["^", "~"].includes(range[0]) && isExactVersion(range.slice(1)));
}

export type ParsedVersion = {major: number; minor: number; patch: number};

export function parseVersion(version: string): ParsedVersion | undefined {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) return undefined;
  return {major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3])};
}

function compareVersions(left: ParsedVersion, right: ParsedVersion): number {
  return left.major - right.major || left.minor - right.minor || left.patch - right.patch;
}

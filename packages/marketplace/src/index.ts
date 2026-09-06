import {isCoreCompatible, type ParsedVersion, parseVersion} from "@motion-studio/plugin-sdk";

export const MARKETPLACE_FORMAT_VERSION = 1 as const;

export type MarketplaceEntry = {
  id: string;
  name: string;
  version: string;
  packageName: string;
  description: string;
  core: string;
  sdk?: string;
  capabilities: string[];
  themes?: string[];
  source?: string;
};

export type MarketplaceCatalog = {
  version: typeof MARKETPLACE_FORMAT_VERSION;
  plugins: MarketplaceEntry[];
};

export type InstalledPlugin = {
  id: string;
  version: string;
  packageName: string;
  installedFrom: string;
};

export type MarketplaceState = {
  version: typeof MARKETPLACE_FORMAT_VERSION;
  plugins: InstalledPlugin[];
};

export type MarketplaceResult = {
  state: MarketplaceState;
  entry: MarketplaceEntry;
};

export function createEmptyState(): MarketplaceState {
  return {version: MARKETPLACE_FORMAT_VERSION, plugins: []};
}

export function validateCatalog(catalog: MarketplaceCatalog): string[] {
  const errors: string[] = [];
  if (catalog.version !== MARKETPLACE_FORMAT_VERSION) errors.push(`unsupported catalog version "${catalog.version}"`);
  const ids = new Set<string>();
  for (const plugin of catalog.plugins) {
    if (ids.has(plugin.id)) errors.push(`duplicate catalog plugin "${plugin.id}"`);
    ids.add(plugin.id);
    if (!plugin.id.trim()) errors.push("catalog plugin ID must not be empty");
    if (!parseVersion(plugin.version)) errors.push(`plugin "${plugin.id}" has an invalid version "${plugin.version}"`);
    if (!plugin.packageName.trim()) errors.push(`plugin "${plugin.id}" must declare a package name`);
    if (!plugin.core || !isCoreCompatible(plugin.core, plugin.core.replace(/^\^|~/, ""))) errors.push(`plugin "${plugin.id}" has an invalid core range`);
  }
  return errors;
}

export function validateState(state: MarketplaceState): string[] {
  const errors: string[] = [];
  if (state.version !== MARKETPLACE_FORMAT_VERSION) errors.push(`unsupported state version "${state.version}"`);
  const ids = new Set<string>();
  for (const plugin of state.plugins) {
    if (ids.has(plugin.id)) errors.push(`duplicate installed plugin "${plugin.id}"`);
    ids.add(plugin.id);
    if (!plugin.id.trim() || !parseVersion(plugin.version) || !plugin.packageName.trim()) errors.push(`invalid installed plugin "${plugin.id}"`);
  }
  return errors;
}

export function searchCatalog(catalog: MarketplaceCatalog, query = ""): MarketplaceEntry[] {
  const normalized = query.trim().toLocaleLowerCase();
  return catalog.plugins
    .filter((plugin) => !normalized || [plugin.id, plugin.name, plugin.description, ...plugin.capabilities].join(" ").toLocaleLowerCase().includes(normalized))
    .sort((left, right) => left.id.localeCompare(right.id));
}

export function compatibleEntries(catalog: MarketplaceCatalog, coreVersion: string, sdkVersion: string): MarketplaceEntry[] {
  return searchCatalog(catalog).filter((plugin) => isCoreCompatible(plugin.core, coreVersion) && (!plugin.sdk || isCoreCompatible(plugin.sdk, sdkVersion)));
}

export function installPlugin(catalog: MarketplaceCatalog, state: MarketplaceState, id: string, coreVersion: string, sdkVersion: string): MarketplaceResult {
  const entry = catalog.plugins.find((plugin) => plugin.id === id);
  if (!entry) throw new Error(`Plugin "${id}" was not found in the marketplace catalog`);
  if (!isCoreCompatible(entry.core, coreVersion)) throw new Error(`Plugin "${id}" is incompatible with core "${coreVersion}"`);
  if (entry.sdk && !isCoreCompatible(entry.sdk, sdkVersion)) throw new Error(`Plugin "${id}" is incompatible with SDK "${sdkVersion}"`);
  if (state.plugins.some((plugin) => plugin.id === id)) throw new Error(`Plugin "${id}" is already installed`);
  return {entry, state: {...state, plugins: [...state.plugins, {id: entry.id, version: entry.version, packageName: entry.packageName, installedFrom: entry.source ?? "catalog"}].sort((left, right) => left.id.localeCompare(right.id))}};
}

export function removePlugin(state: MarketplaceState, id: string): MarketplaceState {
  if (!state.plugins.some((plugin) => plugin.id === id)) throw new Error(`Plugin "${id}" is not installed`);
  return {...state, plugins: state.plugins.filter((plugin) => plugin.id !== id)};
}

export function updatePlugin(catalog: MarketplaceCatalog, state: MarketplaceState, id: string, coreVersion: string, sdkVersion: string): MarketplaceResult {
  const entry = catalog.plugins.find((plugin) => plugin.id === id);
  if (!entry) throw new Error(`Plugin "${id}" was not found in the marketplace catalog`);
  if (!state.plugins.some((plugin) => plugin.id === id)) throw new Error(`Plugin "${id}" is not installed`);
  if (!isCoreCompatible(entry.core, coreVersion) || (entry.sdk && !isCoreCompatible(entry.sdk, sdkVersion))) throw new Error(`Plugin "${id}" is incompatible with the current runtime`);
  return {entry, state: {...state, plugins: state.plugins.map((plugin) => plugin.id === id ? {id: entry.id, version: entry.version, packageName: entry.packageName, installedFrom: entry.source ?? "catalog"} : plugin).sort((left, right) => left.id.localeCompare(right.id))}};
}

export function isNewerVersion(candidate: string, installed: string): boolean {
  const left = parseVersion(candidate);
  const right = parseVersion(installed);
  return left !== undefined && right !== undefined && compareVersions(left, right) > 0;
}

function compareVersions(left: ParsedVersion, right: ParsedVersion): number {
  return left.major - right.major || left.minor - right.minor || left.patch - right.patch;
}

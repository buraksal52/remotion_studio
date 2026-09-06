import type {ComponentDefinition, PluginDefinition} from "@motion-studio/plugin-sdk";
import {PluginRegistry, type CapabilityProvider} from "@motion-studio/registry";

export type ResolutionContext = {
  capability: string;
  sceneType?: string;
  intents?: string[];
  theme?: string;
  preferredPlugin?: string;
  availableContext?: string[];
};

export type ResolutionCandidate = {
  provider: CapabilityProvider;
  score: number;
  reasons: string[];
};

export class SemanticResolutionError extends Error {
  public constructor(
    public readonly context: ResolutionContext,
    public readonly diagnostics: string[],
  ) {
    super(`No eligible provider for capability "${context.capability}": ${diagnostics.join("; ")}`);
    this.name = "SemanticResolutionError";
  }
}

export class SemanticResolver {
  public constructor(private readonly registry: PluginRegistry) {}

  public resolve(context: ResolutionContext): ResolutionCandidate {
    const candidates = this.inspect(context);
    const selected = candidates[0];
    if (!selected) {
      const diagnostics = this.diagnostics(context);
      throw new SemanticResolutionError(context, diagnostics);
    }
    return selected;
  }

  public eligible(context: ResolutionContext): ResolutionCandidate[] {
    return this.inspect(context);
  }

  private inspect(context: ResolutionContext): ResolutionCandidate[] {
    return this.registry
      .providersFor(context.capability)
      .map((provider) => this.score(provider, context))
      .filter((candidate): candidate is ResolutionCandidate => candidate !== undefined)
      .sort((a, b) => {
        const scoreDifference = b.score - a.score;
        if (scoreDifference !== 0) return scoreDifference;
        const pluginDifference = a.provider.plugin.id.localeCompare(b.provider.plugin.id);
        return pluginDifference !== 0
          ? pluginDifference
          : a.provider.component.id.localeCompare(b.provider.component.id);
      });
  }

  private score(provider: CapabilityProvider, context: ResolutionContext): ResolutionCandidate | undefined {
    const component = provider.component;
    const intents = context.intents ?? [];
    const availableContext = new Set(context.availableContext ?? []);

    if (component.forbiddenScenes?.includes(context.sceneType ?? "")) return undefined;
    if (component.allowedScenes && context.sceneType && !component.allowedScenes.includes(context.sceneType)) return undefined;
    if (component.requiredContext?.some((required) => !availableContext.has(required))) return undefined;
    if (component.doNotUseWhen?.some((intent) => intents.includes(intent))) return undefined;

    let score = component.priority ?? 0;
    const reasons: string[] = [];
    const intentMatches = [...(component.intents ?? []), ...(component.useWhen ?? [])].filter((intent) => intents.includes(intent));
    if (intentMatches.length > 0) {
      score += intentMatches.length * 5;
      reasons.push(`intent match +${intentMatches.length * 5}`);
    }
    if (context.sceneType && component.allowedScenes?.includes(context.sceneType)) {
      score += 3;
      reasons.push("scene match +3");
    }
    if (context.theme && provider.plugin.themes?.includes(context.theme)) {
      score += 2;
      reasons.push("theme match +2");
    }
    if (context.preferredPlugin === provider.plugin.id) {
      score += 2;
      reasons.push("preferred plugin +2");
    }

    return {provider, score, reasons};
  }

  private diagnostics(context: ResolutionContext): string[] {
    const providers = this.registry.providersFor(context.capability);
    if (providers.length === 0) return ["capability is not registered"];
    return providers.map(({plugin, component}) => {
      const reasons: string[] = [];
      if (component.forbiddenScenes?.includes(context.sceneType ?? "")) reasons.push(`forbidden scene "${context.sceneType}"`);
      if (component.allowedScenes && context.sceneType && !component.allowedScenes.includes(context.sceneType)) reasons.push(`scene "${context.sceneType}" is not allowed`);
      if (component.requiredContext?.some((required) => !(context.availableContext ?? []).includes(required))) reasons.push("required context is missing");
      if (component.doNotUseWhen?.some((intent) => (context.intents ?? []).includes(intent))) reasons.push("intent is forbidden");
      return `${plugin.id}/${component.id}: ${reasons.join(", ") || "not eligible"}`;
    });
  }
}

export type {ComponentDefinition, PluginDefinition};

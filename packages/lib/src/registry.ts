import type { EmbedProvider } from "./provider";

/**
 * Registry class for managing a collection of {@link EmbedProvider} instances.
 *
 * @remarks
 * This class allows you to register multiple providers, then discover which provider
 * can parse a particular URL. You can also retrieve a provider by its name.
 *
 * @public
 */
export class EmbedProviderRegistry {
  /**
   * Internal map storing each provider by name.
   *
   * @privateRemarks
   * We map `provider.name` -> `EmbedProvider`.
   */
  private providers: Map<string, EmbedProvider>;

  /**
   * Creates an instance of {@link EmbedProviderRegistry}.
   */
  constructor() {
    this.providers = new Map();
  }

  /**
   * Registers a provider.
   *
   * @remarks
   * If a provider with the same name is already present, it will be overwritten.
   *
   * @param provider - The {@link EmbedProvider} instance to register.
   */
  register(provider: EmbedProvider) {
    this.providers.set(provider.name, provider);
  }

  /**
   * Lists all registered providers.
   *
   * @returns An array of all currently registered {@link EmbedProvider} instances.
   */
  listProviders(): EmbedProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Retrieves a provider by name.
   *
   * @param name - A provider’s `name` property.
   * @returns The matching {@link EmbedProvider}, or `undefined` if not found.
   */
  getProviderByName(name: string): EmbedProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Finds the first provider that can parse the given URL.
   *
   * @param url - The URL to analyze.
   * @returns The matching {@link EmbedProvider}, or `undefined` if no provider recognizes it.
   */
  findProviderByUrl(url: string): EmbedProvider | undefined {
    for (const provider of this.providers.values()) {
      if (provider.canParseUrl(url)) {
        return provider;
      }
    }
    return undefined;
  }

  /**
   * Registers multiple providers at once.
   *
   * @remarks
   * If a provider with the same name is already present, it will be overwritten.
   *
   * @param providers - An array of {@link EmbedProvider} instances to register.
   */
  registerAll(providers: EmbedProvider[]) {
    for (const provider of providers) {
      this.register(provider);
    }
  }

  /**
   * Creates a new registry with the same providers as this one.
   *
   * @returns A new {@link EmbedProviderRegistry} with the same providers.
   */
  clone(): EmbedProviderRegistry {
    const newRegistry = new EmbedProviderRegistry();
    newRegistry.registerAll(this.listProviders());
    return newRegistry;
  }
}

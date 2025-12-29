/**
 * Mutable store wrapper for MatcherRegistry with reactivity.
 *
 * @remarks
 * Provides a subscribe/notify pattern for browser components that need
 * to react when matchers are registered at runtime (e.g., CDN scenarios).
 *
 * The core `MatcherRegistry` is immutable; this store manages the mutable
 * reference and notifies subscribers when it changes.
 */

import type { MatcherInput, UrlMatcher } from "./matcher";
import { extractMatcher, extractPriority } from "./matcher";
import { MatcherRegistry } from "./registry";

/**
 * Listener callback for registry changes.
 */
export type RegistryListener = (registry: MatcherRegistry) => void;

/**
 * Unsubscribe function returned by subscribe().
 */
export type Unsubscribe = () => void;

/**
 * Mutable store for a MatcherRegistry with reactivity.
 *
 * @remarks
 * Use cases:
 * - CDN/browser: Register matchers at runtime, WC re-renders
 * - SSR: Not needed - use MatcherRegistry directly
 *
 * The store holds a reference to an immutable MatcherRegistry.
 * When `register()` or `unregister()` is called, a new registry
 * is created and subscribers are notified.
 *
 * @example
 * ```typescript
 * // Create store with defaults
 * const store = new RegistryStore();
 *
 * // Subscribe to changes (e.g., in a web component)
 * const unsubscribe = store.subscribe((registry) => {
 *   this.requestUpdate();  // LitElement re-render
 * });
 *
 * // Register a new matcher (triggers notification)
 * store.register(MyCustomMatcher);
 *
 * // Cleanup when component disconnects
 * unsubscribe();
 * ```
 */
export class RegistryStore {
  private registry: MatcherRegistry;
  private listeners: Set<RegistryListener> = new Set();

  /**
   * Create a new RegistryStore.
   *
   * @param initial - Initial registry (defaults to MatcherRegistry.withDefaults())
   */
  constructor(initial?: MatcherRegistry) {
    this.registry = initial ?? MatcherRegistry.withDefaults();
  }

  /**
   * Get the current registry.
   */
  get current(): MatcherRegistry {
    return this.registry;
  }

  /**
   * Subscribe to registry changes.
   *
   * @param listener - Callback invoked when registry changes
   * @returns Unsubscribe function
   */
  subscribe(listener: RegistryListener): Unsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Register a matcher (replaces existing with same name).
   *
   * @param matcher - Matcher to register (or [matcher, { priority }] tuple)
   */
  register(matcher: MatcherInput): void {
    const m = extractMatcher(matcher);
    const priority = extractPriority(matcher);

    // Create new registry with the matcher
    // Using without() first ensures replacement if name exists
    this.registry = this.registry
      .without(m.name)
      .with({ matcher: m, priority });
    this.notify();
  }

  /**
   * Unregister a matcher by name.
   *
   * @param name - Name of matcher to remove
   */
  unregister(name: string): void {
    if (!this.registry.has(name)) return;

    this.registry = this.registry.without(name);
    this.notify();
  }

  /**
   * Replace the registry with a new one.
   *
   * @param registry - New registry to use
   */
  setRegistry(registry: MatcherRegistry): void {
    this.registry = registry;
    this.notify();
  }

  /**
   * Notify all listeners of a registry change.
   */
  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.registry);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Convenience Delegation Methods
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Match a URL against the current registry.
   *
   * @see MatcherRegistry.match
   */
  match(url: string) {
    return this.registry.match(url);
  }

  /**
   * Get embed URL for a matched URL.
   *
   * @see MatcherRegistry.toEmbedUrl
   */
  toEmbedUrl(
    url: string,
    options?: Parameters<MatcherRegistry["toEmbedUrl"]>[1],
  ) {
    return this.registry.toEmbedUrl(url, options);
  }

  /**
   * Get structured output for a matched URL.
   *
   * @see MatcherRegistry.toOutput
   */
  toOutput(url: string, options?: Parameters<MatcherRegistry["toOutput"]>[1]) {
    return this.registry.toOutput(url, options);
  }

  /**
   * Check if a matcher is registered.
   *
   * @see MatcherRegistry.has
   */
  has(name: string): boolean {
    return this.registry.has(name);
  }

  /**
   * Get a matcher by name.
   *
   * @see MatcherRegistry.get
   */
  get(name: string): UrlMatcher | undefined {
    return this.registry.get(name);
  }

  /**
   * List all registered matchers.
   *
   * @see MatcherRegistry.list
   */
  list(): UrlMatcher[] {
    return this.registry.list();
  }

  /**
   * Get the number of registered matchers.
   */
  get size(): number {
    return this.registry.size;
  }
}

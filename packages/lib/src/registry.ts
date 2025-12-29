import { createContext, getBaseDomain, type MatchContext } from "./context";
import { renderIframe } from "./escape";
import {
  extractMatcher,
  extractPriority,
  type MatcherInput,
  type MatchResult,
  type UrlMatcher,
} from "./matcher";
import { ALL_MATCHERS } from "./matchers";
import type { EmbedOutput, OutputOptions, PrivacyOptions } from "./output";
import type { MatchError } from "./result";

/**
 * Create a MatchResult error.
 */
function matchError(message: string): { ok: false; error: MatchError } {
  return {
    error: { code: "NO_MATCH", message },
    ok: false,
  };
}

/**
 * Internal entry for a registered matcher with priority.
 */
interface MatcherEntry {
  matcher: UrlMatcher;
  priority: number;
}

/**
 * Options for creating a MatcherRegistry.
 */
export interface RegistryOptions {
  /**
   * Custom resolver for conflict resolution.
   * Called when multiple matchers claim the same URL.
   *
   * @param candidates - Matchers that can handle the URL (in dispatch order:
   *   domain-specific → scheme-based → wildcards, each category sorted by priority)
   * @param url - The URL being matched
   * @returns The winning matcher, or undefined for no match
   */
  resolver?: (candidates: UrlMatcher[], url: string) => UrlMatcher | undefined;
}

/**
 * Immutable registry for URL matchers with indexed dispatch.
 *
 * @remarks
 * Provides O(1) domain-based lookup for efficient matching.
 * Immutable by design: use `with()` and `without()` to create new registries.
 *
 * **Indexed dispatch algorithm:**
 * 1. Extract domain from URL
 * 2. Look up domain in `byDomain` map → O(1)
 * 3. Scan only that domain's matchers (typically 1-2)
 * 4. Fall back to wildcards if no match
 * 5. Resolve conflicts via priority, then registration order
 *
 * @example
 * ```typescript
 * // Create with defaults
 * const registry = MatcherRegistry.withDefaults();
 *
 * // Match a URL
 * const result = registry.match("https://youtu.be/abc123");
 * if (result.ok) {
 *   console.log(result.data); // { videoId: "abc123" }
 * }
 *
 * // Get embed URL directly
 * const embedUrl = registry.toEmbedUrl("https://youtu.be/abc123");
 *
 * // Get structured output
 * const output = registry.toOutput("https://youtu.be/abc123", { width: 800 });
 * ```
 */
export class MatcherRegistry {
  /**
   * Index: domain → matchers for that domain.
   * Enables O(1) lookup by domain.
   */
  private readonly byDomain: Map<string, MatcherEntry[]>;

  /**
   * Index: matcher name → matcher.
   * Enables O(1) lookup by name.
   */
  private readonly byName: Map<string, MatcherEntry>;

  /**
   * Matchers without domain hints.
   * Checked as fallback when domain lookup fails.
   */
  private readonly wildcards: MatcherEntry[];

  /**
   * Custom resolver for conflict resolution.
   */
  private readonly resolver?: (
    candidates: UrlMatcher[],
    url: string,
  ) => UrlMatcher | undefined;

  /**
   * Private constructor - use static factory methods.
   */
  private constructor(entries: MatcherEntry[], options: RegistryOptions = {}) {
    this.byDomain = new Map();
    this.byName = new Map();
    this.wildcards = [];
    this.resolver = options.resolver;

    for (const entry of entries) {
      this.addEntry(entry);
    }
  }

  /**
   * Add an entry to the internal indexes.
   */
  private addEntry(entry: MatcherEntry): void {
    const { matcher } = entry;

    // Add to name index
    this.byName.set(matcher.name, entry);

    // Add to domain index or wildcards
    if (matcher.domains && matcher.domains.length > 0) {
      for (const domain of matcher.domains) {
        const key = domain.toLowerCase();
        const existing = this.byDomain.get(key) ?? [];
        existing.push(entry);
        // Sort by priority (highest first)
        existing.sort((a, b) => b.priority - a.priority);
        this.byDomain.set(key, existing);
      }
    } else {
      this.wildcards.push(entry);
      // Sort wildcards by priority
      this.wildcards.sort((a, b) => b.priority - a.priority);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Static Factory Methods
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Create an empty registry.
   *
   * @param matchers - Optional initial matchers
   * @param options - Registry options
   * @returns A new MatcherRegistry
   */
  static create(
    matchers: MatcherInput[] = [],
    options: RegistryOptions = {},
  ): MatcherRegistry {
    const entries = matchers.map((input) => ({
      matcher: extractMatcher(input),
      priority: extractPriority(input),
    }));
    return new MatcherRegistry(entries, options);
  }

  /**
   * Create a registry with all built-in matchers.
   *
   * @returns A new MatcherRegistry with default matchers
   *
   * @example
   * ```typescript
   * const registry = MatcherRegistry.withDefaults();
   * const result = registry.match("https://youtu.be/abc123");
   * ```
   */
  static withDefaults(): MatcherRegistry {
    return MatcherRegistry.create([...ALL_MATCHERS]);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Immutable Composition
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Create a new registry with additional matchers.
   *
   * @param matchers - Matchers to add
   * @returns A new MatcherRegistry with added matchers
   *
   * @remarks
   * Does not modify the original registry.
   */
  with(...matchers: MatcherInput[]): MatcherRegistry {
    const existingEntries = Array.from(this.byName.values());
    const newEntries = matchers.map((input) => ({
      matcher: extractMatcher(input),
      priority: extractPriority(input),
    }));
    return new MatcherRegistry([...existingEntries, ...newEntries], {
      resolver: this.resolver,
    });
  }

  /**
   * Create a new registry without specified matchers.
   *
   * @param names - Names of matchers to remove
   * @returns A new MatcherRegistry without specified matchers
   *
   * @remarks
   * Does not modify the original registry.
   */
  without(...names: string[]): MatcherRegistry {
    const nameSet = new Set(names);
    const remaining = Array.from(this.byName.values()).filter(
      (entry) => !nameSet.has(entry.matcher.name),
    );
    return new MatcherRegistry(remaining, { resolver: this.resolver });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Core Operations
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Match a URL against registered matchers.
   *
   * @param url - URL to match
   * @returns MatchResult with matcher and data, or error
   *
   * @remarks
   * Uses indexed dispatch for O(1) domain lookup.
   * Falls back to wildcards if no domain match.
   *
   * @example
   * ```typescript
   * const result = registry.match("https://youtu.be/abc123");
   * if (result.ok) {
   *   console.log(result.matcher.name); // "YouTube"
   *   console.log(result.data);          // { videoId: "abc123" }
   * }
   * ```
   */
  match(url: string): MatchResult {
    // Create context (parse URL)
    const ctxResult = createContext(url);
    if (!ctxResult.ok) {
      return { error: ctxResult.error, ok: false };
    }
    const ctx = ctxResult.value;

    // Find candidates via indexed dispatch
    const candidates = this.findCandidates(ctx);
    if (candidates.length === 0) {
      return matchError("No matcher found for URL");
    }

    // Try custom resolver first
    if (this.resolver) {
      const matchers = candidates.map((e) => e.matcher);
      const winner = this.resolver(matchers, url);
      if (winner) {
        const result = winner.parse(ctx);
        if (result.ok) {
          return { data: result.value, matcher: winner, ok: true };
        }
      }
      return matchError("Custom resolver returned no match");
    }

    // Try candidates in priority order
    for (const { matcher } of candidates) {
      if (matcher.canMatch(ctx)) {
        const result = matcher.parse(ctx);
        if (result.ok) {
          return { data: result.value, matcher, ok: true };
        }
        // If parse returned fatal error, stop trying
        if (!result.ok && result.error.fatal) {
          return { error: result.error, ok: false };
        }
      }
    }

    return matchError("No matcher matched the URL");
  }

  /**
   * Find candidate matchers for a context.
   */
  private findCandidates(ctx: MatchContext): MatcherEntry[] {
    const candidates: MatcherEntry[] = [];

    // Try domain-based lookup first
    if (ctx.host) {
      // Try exact domain match
      const exact = this.byDomain.get(ctx.host);
      if (exact) {
        candidates.push(...exact);
      }

      // Try base domain match (e.g., open.spotify.com → spotify.com)
      const baseDomain = getBaseDomain(ctx.host);
      if (baseDomain !== ctx.host) {
        const base = this.byDomain.get(baseDomain);
        if (base) {
          // Add only matchers not already in candidates
          for (const entry of base) {
            if (
              !candidates.some((e) => e.matcher.name === entry.matcher.name)
            ) {
              candidates.push(entry);
            }
          }
        }
      }
    }

    // Check scheme-based matchers
    if (ctx.scheme && ctx.scheme !== "http" && ctx.scheme !== "https") {
      for (const entry of this.byName.values()) {
        if (
          entry.matcher.schemes?.includes(ctx.scheme) &&
          !candidates.some((e) => e.matcher.name === entry.matcher.name)
        ) {
          candidates.push(entry);
        }
      }
    }

    // Add wildcards as fallback (with deduplication)
    for (const entry of this.wildcards) {
      if (!candidates.some((e) => e.matcher.name === entry.matcher.name)) {
        candidates.push(entry);
      }
    }

    // Note: No global sort needed - each category is already sorted by priority
    // when added in addEntry(). Global sort would break the dispatch hierarchy:
    // domain-specific → scheme-based → wildcards.

    return candidates;
  }

  /**
   * Get embed URL for a matched URL.
   *
   * @param url - URL to convert
   * @param options - Privacy options
   * @returns Embed URL or undefined if no match
   */
  toEmbedUrl(url: string, options?: PrivacyOptions): string | undefined {
    const result = this.match(url);
    if (!result.ok) return undefined;
    return result.matcher.toEmbedUrl(result.data, options);
  }

  /**
   * Get structured output for a matched URL.
   *
   * @param url - URL to convert
   * @param options - Output and privacy options
   * @returns EmbedOutput or undefined if no match
   */
  toOutput(
    url: string,
    options?: OutputOptions & PrivacyOptions,
  ): EmbedOutput | undefined {
    const result = this.match(url);
    if (!result.ok) return undefined;
    return result.matcher.toOutput(result.data, options);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Discovery
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * List all registered matchers.
   *
   * @returns Array of registered matchers
   */
  list(): UrlMatcher[] {
    return Array.from(this.byName.values()).map((e) => e.matcher);
  }

  /**
   * Get a matcher by name.
   *
   * @param name - Matcher name
   * @returns The matcher or undefined
   */
  get(name: string): UrlMatcher | undefined {
    return this.byName.get(name)?.matcher;
  }

  /**
   * Check if a matcher is registered.
   *
   * @param name - Matcher name
   * @returns true if registered
   */
  has(name: string): boolean {
    return this.byName.has(name);
  }

  /**
   * Get the number of registered matchers.
   */
  get size(): number {
    return this.byName.size;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Render Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render an EmbedOutput to an HTML string.
 *
 * @param output - The EmbedOutput to render
 * @returns HTML string
 *
 * @remarks
 * For SSR use. Browser rendering should use `mount()` from the
 * browser module to properly handle script loading.
 *
 * @example
 * ```typescript
 * const output = registry.toOutput("https://youtu.be/abc123");
 * const html = renderOutput(output);
 * // => '<iframe src="..." ...></iframe>'
 * ```
 */
export function renderOutput(output: EmbedOutput | undefined): string {
  if (!output) return "";

  return output.nodes
    .map((node) => {
      if (node.type === "iframe") {
        return renderIframe(node.src, node.attributes);
      }
      if (node.type === "rawHtml") {
        return node.content;
      }
      return "";
    })
    .join("\n");
}

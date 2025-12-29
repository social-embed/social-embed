import { hostMatches, type MatchContext } from "../context";
import type { UrlMatcher } from "../matcher";
import type {
  EmbedOutput,
  OutputOptions,
  PrivacyOptions,
  ScriptRequest,
} from "../output";
import { noMatch, ok, type Result } from "../result";

/**
 * Configuration for defining a script-hydrated matcher.
 *
 * @remarks
 * Use this factory for providers that:
 * - Require loading external scripts to hydrate embeds
 * - Use blockquote/placeholder HTML that gets transformed
 *
 * Examples: Twitter, Instagram, TikTok
 *
 * ⚠️ This is a STUB for future implementation.
 * Currently, the library only supports iframe-based embeds.
 *
 * @typeParam TName - Literal string type for the matcher name
 * @typeParam TData - The parsed data type
 */
export interface ScriptMatcherConfig<TName extends string, TData> {
  /**
   * Unique name identifying this matcher.
   */
  name: TName;

  /**
   * Domains this matcher handles.
   */
  domains: readonly string[];

  /**
   * Regex patterns to match URLs.
   */
  patterns: readonly RegExp[];

  /**
   * Parse URL into structured data.
   *
   * @param ctx - Match context
   * @param match - Regex match result
   * @returns Parsed data
   */
  parseData: (ctx: MatchContext, match: RegExpMatchArray) => TData;

  /**
   * Render the placeholder HTML that will be hydrated by the script.
   *
   * @param data - Parsed data
   * @returns HTML string (must be pre-escaped)
   */
  renderPlaceholder: (data: TData) => string;

  /**
   * Script configuration for hydration.
   */
  script: {
    /** Script URL */
    src: string;

    /** Key for deduplication across multiple embeds */
    dedupeKey: string;

    /** Load asynchronously (default: true) */
    async?: boolean;
  };
}

/**
 * Define a script-hydrated URL matcher.
 *
 * @param config - Matcher configuration
 * @returns A UrlMatcher instance
 *
 * @remarks
 * ⚠️ STUB: This factory is not fully implemented.
 * Script-hydrated embeds (Twitter, Instagram) will be supported
 * in a future version.
 *
 * For now, use the browser `mount()` function to handle script loading
 * when using these matchers.
 *
 * @example
 * ```typescript
 * // Future implementation example
 * const TwitterMatcher = defineScriptMatcher({
 *   name: "Twitter",
 *   domains: ["twitter.com", "x.com"],
 *   patterns: [/(?:twitter|x)\.com\/\w+\/status\/(\d+)/],
 *   parseData: (ctx, match) => ({ tweetId: match[1] }),
 *   // tweetId is digits-only from \d+ regex, so no escaping needed here.
 *   // For user-provided strings, use escapeHtml() or escapeAttr().
 *   renderPlaceholder: (data) => `
 *     <blockquote class="twitter-tweet">
 *       <a href="https://twitter.com/i/status/${data.tweetId}">Loading...</a>
 *     </blockquote>
 *   `,
 *   script: {
 *     src: "https://platform.twitter.com/widgets.js",
 *     dedupeKey: "twitter-widgets",
 *     async: true,
 *   },
 * });
 * ```
 */
export function defineScriptMatcher<TName extends string, TData>(
  config: ScriptMatcherConfig<TName, TData>,
): UrlMatcher<TName, TData> {
  const { name, domains, patterns, parseData, renderPlaceholder, script } =
    config;

  return {
    canMatch(ctx: MatchContext): boolean {
      return hostMatches(ctx, domains);
    },
    domains,
    name,

    parse(ctx: MatchContext): Result<TData> {
      for (const pattern of patterns) {
        const match = ctx.raw.match(pattern);
        if (match) {
          return ok(parseData(ctx, match));
        }
      }
      return noMatch(`No pattern matched for ${name}`);
    },
    supportsPrivacyMode: false,

    toEmbedUrl(_data: TData, _options?: PrivacyOptions): string {
      // Script-based embeds don't have a simple embed URL
      throw new Error(
        `${name} requires script execution. Use toOutput() instead of toEmbedUrl().`,
      );
    },

    toOutput(
      data: TData,
      _options?: OutputOptions & PrivacyOptions,
    ): EmbedOutput {
      const scriptRequest: ScriptRequest = {
        async: script.async ?? true,
        dedupeKey: script.dedupeKey,
        src: script.src,
      };

      return {
        nodes: [
          {
            content: renderPlaceholder(data),
            type: "dangerouslySetHtml",
          },
        ],
        scripts: [scriptRequest],
      };
    },
  };
}

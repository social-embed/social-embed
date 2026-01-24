/**
 * Matcher factory functions.
 *
 * @remarks
 * These factories simplify creating URL matchers for common patterns:
 *
 * - `defineMatcher`: Unified factory with `type` discriminant (recommended)
 * - `defineIframeMatcher`: For standard iframe embeds (YouTube, Vimeo, etc.)
 * - `defineScriptMatcher`: For script-hydrated embeds (Twitter, Instagram)
 *
 * @example
 * ```typescript
 * import { defineMatcher } from "@social-embed/lib";
 *
 * // Recommended: Use unified factory with type discriminant
 * const MyMatcher = defineMatcher({
 *   type: "iframe",
 *   name: "MyService",
 *   domains: ["myservice.com"],
 *   patterns: [/myservice\.com\/v\/(\w+)/],
 *   embedUrl: (id) => `https://myservice.com/embed/${id}`,
 * });
 * ```
 */

import type { UrlMatcher } from "../matcher";
import {
  defineIframeMatcher,
  type IframeMatcherConfig,
  type IframeParseResult,
} from "./iframe";
import { defineScriptMatcher, type ScriptMatcherConfig } from "./script";

// Re-export specialized factories and types
export {
  defineIframeMatcher,
  type IframeMatcherConfig,
  type IframeParseResult,
} from "./iframe";

export { defineScriptMatcher, type ScriptMatcherConfig } from "./script";

/**
 * Unified matcher configuration.
 * Use `type` to select the embed strategy.
 */
export type MatcherConfig<TName extends string, TData = unknown> =
  | ({ type: "iframe" } & IframeMatcherConfig<TName>)
  | ({ type: "script" } & ScriptMatcherConfig<TName, TData>);

/**
 * Define a URL matcher using the unified factory.
 *
 * @param config - Matcher configuration with `type` discriminant
 * @returns A UrlMatcher instance
 *
 * @remarks
 * This is the recommended entry point for defining custom matchers.
 * It delegates to specialized factories based on the `type` property:
 * - `"iframe"`: Creates an iframe-based embed (most common)
 * - `"script"`: Creates a script-hydrated embed (Twitter, Instagram, etc.)
 *
 * @example
 * ```typescript
 * // Simple iframe matcher
 * const VimeoMatcher = defineMatcher({
 *   type: "iframe",
 *   name: "Vimeo",
 *   domains: ["vimeo.com"],
 *   patterns: [/vimeo\.com\/(\d+)/],
 *   embedUrl: (id) => `https://player.vimeo.com/video/${id}`,
 * });
 *
 * // Register with a store
 * store.register(VimeoMatcher);
 * ```
 */
export function defineMatcher<TName extends string>(
  config: { type: "iframe" } & IframeMatcherConfig<TName>,
): UrlMatcher<TName, IframeParseResult>;
export function defineMatcher<TName extends string, TData>(
  config: { type: "script" } & ScriptMatcherConfig<TName, TData>,
): UrlMatcher<TName, TData>;
export function defineMatcher<TName extends string, TData>(
  config: MatcherConfig<TName, TData>,
): UrlMatcher<TName, IframeParseResult | TData> {
  if (config.type === "iframe") {
    // Extract type and pass rest to iframe factory
    const { type: _, ...iframeConfig } = config;
    return defineIframeMatcher(iframeConfig) as UrlMatcher<
      TName,
      IframeParseResult | TData
    >;
  }
  // Extract type and pass rest to script factory
  const { type: _, ...scriptConfig } = config;
  return defineScriptMatcher(scriptConfig) as UrlMatcher<
    TName,
    IframeParseResult | TData
  >;
}

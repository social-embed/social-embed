/**
 * Matcher factory functions.
 *
 * @remarks
 * These factories simplify creating URL matchers for common patterns:
 *
 * - `defineIframeMatcher`: For standard iframe embeds (YouTube, Vimeo, etc.)
 * - `defineScriptMatcher`: For script-hydrated embeds (Twitter, Instagram) [Future]
 *
 * @example
 * ```typescript
 * import { defineIframeMatcher } from "@social-embed/lib/factories";
 *
 * const MyMatcher = defineIframeMatcher({
 *   name: "MyService",
 *   domains: ["myservice.com"],
 *   patterns: [/myservice\.com\/v\/(\w+)/],
 *   embedUrl: (id) => `https://myservice.com/embed/${id}`,
 * });
 * ```
 */

export {
  defineIframeMatcher,
  type IframeMatcherConfig,
  type IframeParseResult,
} from "./iframe";

export { defineScriptMatcher, type ScriptMatcherConfig } from "./script";

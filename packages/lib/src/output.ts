/**
 * Structured output that describes an embed without executing it.
 *
 * @remarks
 * SSR-safe: Contains no DOM APIs, just pure data.
 * Can be rendered to HTML string for SSR, or mounted to DOM in browser.
 *
 * The separation of `nodes`, `scripts`, and `styles` enables:
 * - Deferred script loading (Twitter, Instagram embeds)
 * - Style deduplication across multiple embeds
 * - SSR with progressive enhancement
 */
export interface EmbedOutput {
  /**
   * HTML nodes to render (typically one iframe or blockquote).
   * Ordered array - render in sequence.
   */
  nodes: EmbedNode[];

  /**
   * External scripts that need loading.
   * Used by script-hydrated embeds (future: Twitter, Instagram).
   */
  scripts?: ScriptRequest[];

  /**
   * Inline styles or CSS URLs.
   * Used for embeds that need custom styling (future).
   */
  styles?: StyleChunk[];
}

/**
 * A renderable HTML node in the embed output.
 *
 * @remarks
 * Two types:
 * - `iframe`: Standard iframe embed (YouTube, Vimeo, Spotify)
 * - `html`: Raw HTML content (Twitter blockquotes, Instagram embeds)
 *
 * The `html` type requires careful escaping - only use for
 * trusted, pre-sanitized content from built-in matchers.
 */
export type EmbedNode = IframeNode | HtmlNode;

/**
 * An iframe node with structured attributes.
 *
 * @remarks
 * Attributes are key-value strings. Boolean attributes like
 * `allowfullscreen` use empty string as value.
 */
export interface IframeNode {
  type: "iframe";

  /** The iframe src URL */
  src: string;

  /**
   * HTML attributes for the iframe.
   * Keys are attribute names, values are attribute values.
   *
   * @example
   * ```typescript
   * {
   *   width: "560",
   *   height: "315",
   *   allowfullscreen: "",  // Boolean attribute
   *   frameborder: "0",
   *   allow: "encrypted-media",
   * }
   * ```
   */
  attributes: Record<string, string>;
}

/**
 * Raw HTML content node.
 *
 * @remarks
 * ⚠️ Security warning: Only use with trusted, pre-escaped content.
 * This is for blockquote-based embeds where scripts will hydrate
 * the content after loading.
 *
 * @example
 * Twitter embed placeholder:
 * ```typescript
 * {
 *   type: "html",
 *   content: '<blockquote class="twitter-tweet">...</blockquote>'
 * }
 * ```
 */
export interface HtmlNode {
  type: "html";

  /** Pre-escaped HTML content */
  content: string;
}

/**
 * External script request for embed hydration.
 *
 * @remarks
 * Some embeds (Twitter, Instagram) require loading external scripts
 * to hydrate blockquote placeholders into rich embeds.
 *
 * The `dedupeKey` enables loading a script once for multiple embeds.
 */
export interface ScriptRequest {
  /** Script URL */
  src: string;

  /** Load script asynchronously (default: true) */
  async?: boolean;

  /** Defer script execution (default: false) */
  defer?: boolean;

  /**
   * Key for deduplication across multiple embeds.
   * If two embeds have the same dedupeKey, script loads once.
   *
   * @example "twitter-widgets" for all Twitter embeds
   */
  dedupeKey?: string;
}

/**
 * CSS styling chunk for embeds.
 *
 * @remarks
 * Future use for embeds that need custom styling.
 */
export interface StyleChunk {
  /** Type of style chunk */
  type: "inline" | "url";

  /** CSS content (if inline) or URL (if url type) */
  content: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Output Options (passed to toOutput())
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Options for generating embed output.
 */
export interface OutputOptions {
  /** Iframe width (number in pixels or CSS string) */
  width?: string | number;

  /** Iframe height (number in pixels or CSS string) */
  height?: string | number;

  /** CSS class name to add to the iframe */
  className?: string;

  /** Additional HTML attributes for the iframe */
  attributes?: Record<string, string>;
}

/**
 * Privacy options for embed generation.
 *
 * @remarks
 * Privacy-enhanced mode is enabled by default.
 * - YouTube: Uses youtube-nocookie.com domain
 * - Other providers: Adds DNT/tracking-prevention where supported
 */
export interface PrivacyOptions {
  /**
   * Enable privacy-enhanced mode.
   * @default true
   */
  privacy?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Output Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create an iframe-based EmbedOutput.
 *
 * @param src - The iframe src URL
 * @param attributes - HTML attributes for the iframe
 * @returns EmbedOutput with a single iframe node
 */
export function createIframeOutput(
  src: string,
  attributes: Record<string, string> = {},
): EmbedOutput {
  return {
    nodes: [{ attributes, src, type: "iframe" }],
  };
}

/**
 * Create an HTML-based EmbedOutput with optional script.
 *
 * @param content - Pre-escaped HTML content
 * @param script - Optional script to load for hydration
 * @returns EmbedOutput with HTML node and optional script
 */
export function createHtmlOutput(
  content: string,
  script?: ScriptRequest,
): EmbedOutput {
  const output: EmbedOutput = {
    nodes: [{ content, type: "html" }],
  };
  if (script) {
    output.scripts = [script];
  }
  return output;
}

/**
 * Merge OutputOptions into iframe attributes.
 *
 * @param baseAttrs - Base attributes from matcher config
 * @param options - User-provided options
 * @param defaults - Default dimensions from matcher
 * @returns Merged attributes object
 */
export function mergeOutputOptions(
  baseAttrs: Record<string, string>,
  options: OutputOptions | undefined,
  defaults: { width?: string | number; height?: string | number } = {},
): Record<string, string> {
  const width = options?.width ?? defaults.width ?? 560;
  const height = options?.height ?? defaults.height ?? 315;

  const attrs: Record<string, string> = {
    ...baseAttrs,
    height: String(height),
    width: String(width),
  };

  if (options?.className) {
    attrs.class = options.className;
  }

  if (options?.attributes) {
    Object.assign(attrs, options.attributes);
  }

  return attrs;
}

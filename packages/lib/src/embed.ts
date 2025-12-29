/**
 * Embed class and related types.
 *
 * @remarks
 * The Embed class provides a rich object with methods for rendering,
 * replacing the previous EmbedOutput interface approach.
 *
 * This is the recommended API for v2:
 * - `embed.toHtml()` - Render to HTML string (SSR)
 * - `embed.toUrl()` - Get the primary embed URL
 * - `embed.toNodes()` - Get raw nodes for custom rendering
 */

import { renderIframe } from "./escape";

// ─────────────────────────────────────────────────────────────────────────────
// Node Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A renderable HTML node in the embed.
 *
 * @remarks
 * Two types:
 * - `iframe`: Standard iframe embed (YouTube, Vimeo, Spotify)
 * - `dangerouslySetHtml`: Pre-escaped HTML content (Twitter blockquotes, Instagram)
 *
 * The `dangerouslySetHtml` type requires careful escaping - only use for
 * trusted, pre-sanitized content. The "dangerous" name is intentional:
 * if you put unsanitized user data here, XSS is YOUR responsibility.
 */
export type EmbedNode = IframeNode | DangerousHtmlNode;

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
   * }
   * ```
   */
  attributes: Record<string, string>;
}

/**
 * Dangerous HTML content node.
 *
 * @remarks
 * Named to emphasize security responsibility - if you put unsanitized
 * user input in `content`, you WILL have XSS vulnerabilities.
 *
 * Use only with trusted, pre-escaped content from built-in matchers.
 */
export interface DangerousHtmlNode {
  type: "dangerouslySetHtml";

  /** Pre-escaped HTML content - MUST be sanitized */
  content: string;
}

/**
 * External script request for embed hydration.
 *
 * @remarks
 * Some embeds (Twitter, Instagram) require loading external scripts
 * to hydrate blockquote placeholders into rich embeds.
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
   */
  dedupeKey?: string;
}

/**
 * CSS styling chunk for embeds (future use).
 */
export interface StyleChunk {
  type: "inline" | "url";
  content: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Embed Data (raw data structure)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw embed data structure.
 *
 * @remarks
 * This is the data that matchers produce. The `Embed` class wraps this
 * and adds rendering methods.
 *
 * Equivalent to the previous `EmbedOutput` interface.
 */
export interface EmbedData {
  /** HTML nodes to render (typically one iframe or blockquote) */
  nodes: EmbedNode[];

  /** External scripts for hydration (future: Twitter, Instagram) */
  scripts?: ScriptRequest[];

  /** Inline styles or CSS URLs (future use) */
  styles?: StyleChunk[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Embed Class
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rich embed object with rendering methods.
 *
 * @remarks
 * The Embed class wraps embed data and provides convenient methods:
 * - `toHtml()` - Render to HTML string (for SSR)
 * - `toUrl()` - Get the primary embed URL
 * - `toNodes()` - Get raw nodes for custom rendering
 *
 * Created by matchers via `toEmbed()` or by registry via `registry.toEmbed()`.
 *
 * @example
 * ```typescript
 * const embed = registry.toEmbed("https://youtu.be/abc123");
 * if (embed) {
 *   const html = embed.toHtml();
 *   const url = embed.toUrl();
 * }
 * ```
 */
export class Embed {
  /**
   * The provider name that created this embed.
   */
  readonly provider: string;

  /**
   * The parsed data from the URL.
   */
  readonly data: unknown;

  /**
   * HTML nodes to render.
   */
  readonly nodes: EmbedNode[];

  /**
   * External scripts for hydration (future).
   */
  readonly scripts?: ScriptRequest[];

  /**
   * CSS styles (future).
   */
  readonly styles?: StyleChunk[];

  /**
   * Create a new Embed instance.
   *
   * @param provider - The name of the provider/matcher
   * @param data - The parsed data from the URL
   * @param embedData - The structured embed data
   */
  constructor(provider: string, data: unknown, embedData: EmbedData) {
    this.provider = provider;
    this.data = data;
    this.nodes = embedData.nodes;
    this.scripts = embedData.scripts;
    this.styles = embedData.styles;
  }

  /**
   * Render the embed to an HTML string.
   *
   * @returns HTML string suitable for innerHTML or SSR
   *
   * @remarks
   * For browser mounting with script support, use `mount()` from
   * `@social-embed/lib/browser` instead.
   *
   * @example
   * ```typescript
   * const embed = registry.toEmbed("https://youtu.be/abc123");
   * const html = embed.toHtml();
   * // '<iframe src="..." width="560" height="315"></iframe>'
   * ```
   */
  toHtml(): string {
    return this.nodes
      .map((node) => {
        if (node.type === "iframe") {
          return renderIframe(node.src, node.attributes);
        }
        if (node.type === "dangerouslySetHtml") {
          return node.content;
        }
        return "";
      })
      .join("\n");
  }

  /**
   * Get the primary embed URL.
   *
   * @returns The src URL of the first iframe node, or undefined
   *
   * @remarks
   * Returns the URL from the first iframe node. For script-based embeds
   * (Twitter, Instagram), this returns undefined as they use HTML nodes.
   *
   * @example
   * ```typescript
   * const embed = registry.toEmbed("https://youtu.be/abc123");
   * const url = embed.toUrl();
   * // "https://www.youtube-nocookie.com/embed/abc123"
   * ```
   */
  toUrl(): string | undefined {
    const iframeNode = this.nodes.find(
      (node): node is IframeNode => node.type === "iframe",
    );
    return iframeNode?.src;
  }

  /**
   * Get the raw nodes for custom rendering.
   *
   * @returns Array of embed nodes
   *
   * @remarks
   * Use this for custom rendering in frameworks like React or Vue
   * where you want to create elements programmatically.
   *
   * @example
   * ```typescript
   * const embed = registry.toEmbed("https://youtu.be/abc123");
   * for (const node of embed.toNodes()) {
   *   if (node.type === "iframe") {
   *     // Create iframe element with node.src and node.attributes
   *   }
   * }
   * ```
   */
  toNodes(): EmbedNode[] {
    return this.nodes;
  }

  /**
   * Convert to raw EmbedData (for backward compatibility).
   *
   * @returns The underlying EmbedData structure
   *
   * @remarks
   * Use this if you need the raw data structure for serialization
   * or interop with code expecting EmbedOutput/EmbedData.
   */
  toData(): EmbedData {
    const embedData: EmbedData = { nodes: this.nodes };
    if (this.scripts) embedData.scripts = this.scripts;
    if (this.styles) embedData.styles = this.styles;
    return embedData;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create an Embed from raw data.
 *
 * @param provider - The provider name
 * @param data - The parsed URL data
 * @param embedData - The embed data structure
 * @returns A new Embed instance
 */
export function createEmbed(
  provider: string,
  data: unknown,
  embedData: EmbedData,
): Embed {
  return new Embed(provider, data, embedData);
}

/**
 * Create an iframe-based Embed.
 *
 * @param provider - The provider name
 * @param data - The parsed URL data
 * @param src - The iframe src URL
 * @param attributes - HTML attributes for the iframe
 * @returns A new Embed instance
 */
export function createIframeEmbed(
  provider: string,
  data: unknown,
  src: string,
  attributes: Record<string, string> = {},
): Embed {
  return new Embed(provider, data, {
    nodes: [{ attributes, src, type: "iframe" }],
  });
}

/**
 * Create an HTML-based Embed with optional script.
 *
 * @param provider - The provider name
 * @param data - The parsed URL data
 * @param content - Pre-escaped HTML content (MUST be sanitized)
 * @param script - Optional script for hydration
 * @returns A new Embed instance
 *
 * @remarks
 * ⚠️ SECURITY: The `content` parameter is inserted as raw HTML.
 * You MUST sanitize any user input before passing it here.
 */
export function createHtmlEmbed(
  provider: string,
  data: unknown,
  content: string,
  script?: ScriptRequest,
): Embed {
  const embedData: EmbedData = {
    nodes: [{ content, type: "dangerouslySetHtml" }],
  };
  if (script) {
    embedData.scripts = [script];
  }
  return new Embed(provider, data, embedData);
}

// ─────────────────────────────────────────────────────────────────────────────
// Backward Compatibility
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Legacy type alias for backward compatibility.
 *
 * @deprecated Use `EmbedData` or `Embed` class instead.
 */
export type EmbedOutput = EmbedData;

/**
 * Legacy type alias for backward compatibility.
 *
 * @deprecated Use `DangerousHtmlNode` instead.
 */
export type RawHtmlNode = DangerousHtmlNode;

/**
 * Legacy node type for backward compatibility.
 *
 * @deprecated Use `DangerousHtmlNode` instead.
 */
export interface HtmlNode {
  type: "html";
  content: string;
}

/**
 * Convert legacy HtmlNode to DangerousHtmlNode.
 *
 * @internal
 */
export function normalizeNode(node: EmbedNode | HtmlNode): EmbedNode {
  if ("type" in node && node.type === "html") {
    return { content: (node as HtmlNode).content, type: "dangerouslySetHtml" };
  }
  return node as EmbedNode;
}

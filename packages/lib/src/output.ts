/**
 * Output types and options for embed generation.
 *
 * @remarks
 * This module re-exports core types from `./embed.ts` for backward
 * compatibility while providing output options for matchers.
 *
 * For the new Embed class API, import directly from `./embed.ts`.
 */

import type { EmbedData, ScriptRequest } from "./embed";

// Re-export core types from embed.ts for backward compatibility
export type {
  EmbedData,
  EmbedNode,
  EmbedOutput,
  HtmlNode,
  IframeNode,
  RawHtmlNode,
  ScriptRequest,
  StyleChunk,
} from "./embed";

// Re-export Embed class (value export includes the type)
export {
  createEmbed,
  createHtmlEmbed,
  createIframeEmbed,
  Embed,
  normalizeNode,
} from "./embed";

// ─────────────────────────────────────────────────────────────────────────────
// Output Options (passed to toOutput() / toEmbed())
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

/**
 * Combined options for embed generation.
 *
 * @remarks
 * Combines OutputOptions and PrivacyOptions for convenience.
 */
export type EmbedOptions = OutputOptions & PrivacyOptions;

// ─────────────────────────────────────────────────────────────────────────────
// Output Helpers (legacy)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create an iframe-based EmbedData.
 *
 * @param src - The iframe src URL
 * @param attributes - HTML attributes for the iframe
 * @returns EmbedData with a single iframe node
 *
 * @deprecated Use `createIframeEmbed()` from `./embed.ts` instead.
 */
export function createIframeOutput(
  src: string,
  attributes: Record<string, string> = {},
): EmbedData {
  return {
    nodes: [{ attributes, src, type: "iframe" }],
  };
}

/**
 * Create an HTML-based EmbedData with optional script.
 *
 * @param content - Pre-escaped HTML content
 * @param script - Optional script to load for hydration
 * @returns EmbedData with rawHtml node and optional script
 *
 * @deprecated Use `createHtmlEmbed()` from `./embed.ts` instead.
 */
export function createHtmlOutput(
  content: string,
  script?: ScriptRequest,
): EmbedData {
  const output: EmbedData = {
    nodes: [{ content, type: "rawHtml" }],
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

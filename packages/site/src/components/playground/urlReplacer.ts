/**
 * URL replacement logic for playground reroll functionality.
 * Detects <o-embed> elements and replaces URLs with seeded selections.
 */

import {
  PROVIDER_CHECK_ORDER,
  PROVIDER_PATTERNS,
  type ProviderType,
  URL_POOLS,
} from "../../lib/constants";
import { pickFromArray } from "../../lib/seededRng";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type EmbedInfo = {
  /** Index of this embed in the HTML (0-based) */
  index: number;
  /** The URL value from the url attribute */
  url: string;
  /** CSS selector to target this specific embed */
  selector: string;
  /** The quote character used (" or ') */
  quote: '"' | "'";
  /** Detected provider type, if any */
  provider: ProviderType | null;
};

export type AttributeUpdate = {
  selector: string;
  attribute: string;
  value: string;
};

export type ReplacementResult = {
  html: string;
  updates: AttributeUpdate[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Provider Detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect the provider type from a URL.
 */
export function detectProvider(url: string): ProviderType | null {
  for (const provider of PROVIDER_CHECK_ORDER) {
    if (PROVIDER_PATTERNS[provider].test(url)) {
      return provider;
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Embed Detection
// ─────────────────────────────────────────────────────────────────────────────

const O_EMBED_REGEX = /<o-embed\b([^>]*)>/gi;
const URL_ATTR_REGEX = /\burl\s*=\s*(["'])([\s\S]*?)\1/i;

/**
 * Detect all <o-embed> elements in HTML code.
 */
export function detectEmbeds(html: string): EmbedInfo[] {
  const embeds: EmbedInfo[] = [];
  const matches = html.matchAll(O_EMBED_REGEX);
  let index = 0;

  for (const match of matches) {
    const attrs = match[1];
    const urlMatch = attrs.match(URL_ATTR_REGEX);

    if (urlMatch) {
      const url = urlMatch[2];
      embeds.push({
        index,
        provider: detectProvider(url),
        quote: urlMatch[1] as '"' | "'",
        selector: `o-embed:nth-of-type(${index + 1})`,
        url,
      });
    }

    index++;
  }

  return embeds;
}

// ─────────────────────────────────────────────────────────────────────────────
// URL Replacement
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Replace URL attribute in HTML, preserving quote style.
 */
function replaceUrlAttribute(
  html: string,
  newUrl: string,
  embedIndex: number,
): string {
  let currentIndex = 0;

  return html.replace(O_EMBED_REGEX, (fullMatch, attrs) => {
    if (currentIndex++ !== embedIndex) {
      return fullMatch;
    }

    const newAttrs = attrs.replace(
      URL_ATTR_REGEX,
      (_: string, quote: string) => `url=${quote}${newUrl}${quote}`,
    );

    return `<o-embed${newAttrs}>`;
  });
}

/**
 * Select a URL from the pool for a given provider, using a seeded selection.
 */
export function selectUrlForProvider(
  provider: ProviderType,
  seed: string,
): string {
  const pool = URL_POOLS[provider];
  return pickFromArray(pool, seed);
}

// ─────────────────────────────────────────────────────────────────────────────
// Reactive Updates
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate attribute updates for postMessage reactive updates.
 * These can be sent to the iframe to update embeds without reloading.
 */
export function generateReactiveUpdates(
  html: string,
  seed: string,
): AttributeUpdate[] {
  const embeds = detectEmbeds(html);
  const updates: AttributeUpdate[] = [];

  for (const embed of embeds) {
    if (!embed.provider) continue;

    // Sub-seed by index for different values per embed
    const subSeed = `${seed}-${embed.index}`;
    const newUrl = selectUrlForProvider(embed.provider, subSeed);

    updates.push({
      attribute: "url",
      selector: embed.selector,
      value: newUrl,
    });
  }

  return updates;
}

// ─────────────────────────────────────────────────────────────────────────────
// Full Replacement
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Apply seeded URL replacement to HTML code.
 * Returns both the modified HTML and the attribute updates for reactive preview.
 */
export function applySeededUrls(html: string, seed: string): ReplacementResult {
  const embeds = detectEmbeds(html);
  const updates: AttributeUpdate[] = [];
  let result = html;

  for (const embed of embeds) {
    if (!embed.provider) continue;

    const subSeed = `${seed}-${embed.index}`;
    const newUrl = selectUrlForProvider(embed.provider, subSeed);

    result = replaceUrlAttribute(result, newUrl, embed.index);
    updates.push({
      attribute: "url",
      selector: embed.selector,
      value: newUrl,
    });
  }

  return { html: result, updates };
}

/**
 * Check if any embeds in the HTML can be randomized.
 */
export function canRandomize(html: string): boolean {
  const embeds = detectEmbeds(html);
  return embeds.some((embed) => embed.provider !== null);
}

import { ok, parseError, type Result } from "./result";

/**
 * Parsed URL components.
 *
 * @remarks
 * Mirrors the URL API but all fields are optional since
 * non-http URLs (like `spotify:track:abc`) may not have all parts.
 */
export interface ParsedInput {
  /** URL protocol (e.g., "https:", "spotify:") */
  protocol?: string;

  /** Hostname without port (e.g., "youtube.com") */
  hostname?: string;

  /** URL path (e.g., "/watch") */
  pathname?: string;

  /** Query parameters as URLSearchParams */
  searchParams?: URLSearchParams;

  /** URL hash/fragment (e.g., "#t=30") */
  hash?: string;
}

/**
 * Pre-parsed URL context for efficient matching.
 *
 * @remarks
 * Avoids re-parsing the same URL for each matcher.
 * Created once via `createContext()`, then passed to all matchers.
 *
 * The `host` field is extracted for O(1) domain-based dispatch
 * in the MatcherRegistry.
 */
export interface MatchContext {
  /** Original input string */
  raw: string;

  /** Parsed URL components */
  parsed: ParsedInput;

  /**
   * Extracted hostname for indexed dispatch.
   * Includes subdomains (e.g., "open.spotify.com").
   */
  host?: string;

  /**
   * URL scheme without colon (e.g., "https", "spotify").
   * Used for matching non-http URLs like `spotify:track:abc`.
   */
  scheme?: string;
}

/**
 * Regex for extracting domain from URL-like strings.
 * Captures protocol and hostname from standard URL formats.
 */
const URL_DOMAIN_REGEX = /^(?:([a-z][a-z0-9+.-]*):)?(?:\/\/)?([^/?#]+)?/i;

/**
 * Regex for detecting URI scheme patterns like `spotify:track:abc`.
 * These don't have `//` after the scheme.
 */
const URI_SCHEME_REGEX = /^([a-z][a-z0-9+.-]*):(?!\/\/)/i;

/**
 * Create a MatchContext from a raw URL string.
 *
 * @param input - Raw URL or URI string
 * @returns Result containing MatchContext or parse error
 *
 * @remarks
 * Uses the URL API for standard URLs, falls back to regex
 * for non-standard URIs like `spotify:track:abc`.
 *
 * @example
 * ```typescript
 * // Standard URL
 * const ctx = createContext("https://youtube.com/watch?v=abc");
 * if (ctx.ok) {
 *   console.log(ctx.value.host);    // "youtube.com"
 *   console.log(ctx.value.scheme);  // "https"
 * }
 *
 * // Spotify URI
 * const ctx2 = createContext("spotify:track:abc123");
 * if (ctx2.ok) {
 *   console.log(ctx2.value.scheme); // "spotify"
 *   console.log(ctx2.value.host);   // undefined
 * }
 * ```
 */
export function createContext(input: string): Result<MatchContext> {
  if (!input || typeof input !== "string") {
    return parseError("Input must be a non-empty string");
  }

  // Prevent ReDoS attacks with excessively long URLs
  if (input.length > 2048) {
    return parseError("URL too long (max 2048 characters)");
  }

  // Check for URI scheme pattern (spotify:track:abc, tel:+1234, etc.)
  const uriMatch = input.match(URI_SCHEME_REGEX);
  if (uriMatch) {
    return ok({
      parsed: {
        protocol: `${uriMatch[1]}:`,
      },
      raw: input,
      scheme: uriMatch[1].toLowerCase(),
    });
  }

  // Try parsing as standard URL
  try {
    const url = new URL(input);
    return ok({
      host: url.hostname.toLowerCase(),
      parsed: {
        hash: url.hash || undefined,
        hostname: url.hostname,
        pathname: url.pathname,
        protocol: url.protocol,
        searchParams: url.searchParams,
      },
      raw: input,
      scheme: url.protocol.replace(/:$/, "").toLowerCase(),
    });
  } catch {
    // URL API failed, try regex extraction
    const match = input.match(URL_DOMAIN_REGEX);
    if (match) {
      const protocol = match[1] ? `${match[1]}:` : undefined;
      const hostname = match[2];

      return ok({
        host: hostname?.toLowerCase(),
        parsed: {
          hostname,
          protocol,
        },
        raw: input,
        scheme: match[1]?.toLowerCase(),
      });
    }

    return parseError(`Failed to parse URL: ${input}`);
  }
}

/**
 * Extract the base domain from a hostname.
 * Removes subdomains to get the registrable domain.
 *
 * @param hostname - Full hostname (e.g., "open.spotify.com")
 * @returns Base domain (e.g., "spotify.com"), or undefined if hostname is nullish
 *
 * @remarks
 * This is a simple implementation that handles common cases.
 * For production use with edge cases (co.uk, etc.), consider
 * using a proper public suffix list library.
 *
 * The function uses TypeScript overloads for optimal DX:
 * - Pass a `string` → get a `string` back (guaranteed)
 * - Pass `string | null | undefined` → get `string | undefined` back
 *
 * @example
 * ```typescript
 * getBaseDomain("open.spotify.com")     // "spotify.com"
 * getBaseDomain("www.youtube.com")      // "youtube.com"
 * getBaseDomain("youtube.com")          // "youtube.com"
 * getBaseDomain(null)                   // undefined
 * getBaseDomain(undefined)              // undefined
 * ```
 */
export function getBaseDomain(hostname: string): string;
export function getBaseDomain(
  hostname: string | null | undefined,
): string | undefined;
export function getBaseDomain(
  hostname: string | null | undefined,
): string | undefined {
  if (!hostname) {
    return undefined;
  }
  const parts = hostname.toLowerCase().split(".");
  if (parts.length <= 2) {
    return hostname.toLowerCase();
  }
  // Simple heuristic: take last 2 parts
  // This doesn't handle TLDs like .co.uk, but works for common cases
  return parts.slice(-2).join(".");
}

/**
 * Extract video ID from a URL's query parameter.
 *
 * @param ctx - The MatchContext
 * @param param - Query parameter name (e.g., "v" for YouTube)
 * @returns The parameter value or undefined
 *
 * @example
 * ```typescript
 * // For URL: https://youtube.com/watch?v=abc123
 * const videoId = getQueryParam(ctx, "v"); // "abc123"
 * ```
 */
export function getQueryParam(
  ctx: MatchContext,
  param: string,
): string | undefined {
  return ctx.parsed.searchParams?.get(param) ?? undefined;
}

/**
 * Check if a context's host matches any of the given domains.
 *
 * @param ctx - The MatchContext
 * @param domains - Domains to check against
 * @returns True if host matches any domain
 *
 * @remarks
 * Handles subdomains: "open.spotify.com" matches "spotify.com".
 *
 * @example
 * ```typescript
 * hostMatches(ctx, ["youtube.com", "youtu.be"])
 * ```
 */
export function hostMatches(
  ctx: MatchContext,
  domains: readonly string[],
): boolean {
  if (!ctx.host) return false;

  const host = ctx.host.toLowerCase();
  return domains.some((domain) => {
    const d = domain.toLowerCase();
    return host === d || host.endsWith(`.${d}`);
  });
}

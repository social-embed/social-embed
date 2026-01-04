/**
 * URL state serialization for the library playground.
 * Enables shareable links with full playground state.
 */

import {
  DEFAULT_LIB_SOURCE,
  LIB_SOURCE_ORDER,
  type LibSourceType,
  type ProviderFilter,
} from "./constants";

export interface LibPlaygroundState {
  /** The input URL to test */
  url: string;
  /** Provider filter for reroll ('all' or specific provider) */
  providerFilter: ProviderFilter;
  /** Library source (local, CDN, etc.) */
  libSource: LibSourceType;
  /** Random seed for URL selection (reroll) */
  seed?: string;
}

/**
 * Serialized state for URL encoding.
 * Uses short keys for compact URLs.
 */
interface SerializedState {
  /** Version for future compatibility */
  v: number;
  /** URL */
  u?: string;
  /** Provider filter */
  p?: string;
  /** Library source */
  src?: string;
  /** Seed */
  s?: string;
}

const STATE_VERSION = 1;

const DEFAULT_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export const DEFAULT_STATE: LibPlaygroundState = {
  libSource: DEFAULT_LIB_SOURCE,
  providerFilter: "all",
  url: DEFAULT_URL,
};

/**
 * Check if a library source type is valid.
 */
function isValidLibSource(source: string): source is LibSourceType {
  return LIB_SOURCE_ORDER.includes(source as LibSourceType);
}

/**
 * Encode state to a URL-safe base64 string.
 * Optimizes by omitting default values.
 */
export function encodeLibState(state: LibPlaygroundState): string {
  const serialized: SerializedState = { v: STATE_VERSION };

  // Only store URL if different from default
  if (state.url && state.url !== DEFAULT_URL) {
    serialized.u = state.url;
  }

  // Only store provider filter if not 'all'
  if (state.providerFilter && state.providerFilter !== "all") {
    serialized.p = state.providerFilter;
  }

  // Only store lib source if not default
  if (state.libSource && state.libSource !== DEFAULT_LIB_SOURCE) {
    serialized.src = state.libSource;
  }

  // Store seed if present
  if (state.seed) {
    serialized.s = state.seed;
  }

  // If only version (no other data), return empty
  if (Object.keys(serialized).length === 1) {
    return "";
  }

  return btoa(JSON.stringify(serialized));
}

/**
 * Decode state from a URL-safe base64 string.
 */
export function decodeLibState(encoded: string): LibPlaygroundState {
  if (!encoded) {
    return { ...DEFAULT_STATE };
  }

  try {
    const serialized: SerializedState = JSON.parse(atob(encoded));

    // Version check for future compatibility
    if (serialized.v !== STATE_VERSION) {
      // Could handle migration here in the future
      return { ...DEFAULT_STATE };
    }

    return {
      libSource:
        serialized.src && isValidLibSource(serialized.src)
          ? serialized.src
          : DEFAULT_LIB_SOURCE,
      providerFilter: (serialized.p as ProviderFilter) || "all",
      seed: serialized.s,
      url: serialized.u || DEFAULT_URL,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/**
 * Get the current state from URL search params.
 */
export function getLibStateFromUrl(): LibPlaygroundState {
  if (typeof window === "undefined") {
    return { ...DEFAULT_STATE };
  }

  const params = new URLSearchParams(window.location.search);
  const state = params.get("state");

  return state ? decodeLibState(state) : { ...DEFAULT_STATE };
}

/**
 * Update the URL with the current state.
 * Uses history.replaceState to avoid creating new history entries.
 */
export function updateLibUrlWithState(state: LibPlaygroundState): void {
  if (typeof window === "undefined") {
    return;
  }

  const encoded = encodeLibState(state);
  const url = new URL(window.location.href);

  if (encoded) {
    url.searchParams.set("state", encoded);
  } else {
    url.searchParams.delete("state");
  }

  window.history.replaceState({}, "", url.toString());
}

/**
 * Create a shareable URL for the current state.
 */
export function createShareableUrl(
  state: LibPlaygroundState,
  baseUrl?: string,
): string {
  const encoded = encodeLibState(state);
  const base =
    baseUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/lib/playground/`
      : "/lib/playground/");

  if (!encoded) {
    return base;
  }

  return `${base}?state=${encoded}`;
}

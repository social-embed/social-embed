/**
 * URL state serialization for the playground.
 * Enables shareable links with full playground state.
 */

import {
  DEFAULT_PRESET,
  getPresetById,
} from "../components/playground/presets";
import {
  type CdnSource,
  DEFAULT_CDN_SOURCE,
  parseCdnSource,
  serializeCdnSource,
} from "./cdnSources";

export interface PlaygroundState {
  /** The HTML/JS code in the editor (display code, may be seeded) */
  code: string;
  /** The template code before URL randomization (for seed-based reconstruction) */
  templateCode?: string;
  /** The CDN source to use */
  cdnSource: CdnSource;
  /** The active preset ID (if any) */
  presetId?: string;
  /** The random seed for URL selection (reroll) */
  seed?: string;
}

interface SerializedState {
  /** Code (base64 encoded) */
  c?: string;
  /** CDN source type */
  cdn?: string;
  /** Preset ID */
  p?: string;
  /** Random seed for reroll */
  s?: string;
}

const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
  <script type="module" src="{{WC_URL}}"></script>
</head>
<body>
  <o-embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></o-embed>
</body>
</html>`;

export const DEFAULT_STATE: PlaygroundState = {
  cdnSource: DEFAULT_CDN_SOURCE,
  code: DEFAULT_CODE,
  presetId: undefined,
};

/**
 * Encode state to a URL-safe string.
 * Optimized to avoid storing redundant data:
 * - If preset + seed: store just presetId + seed (NOT the display code)
 * - If custom + seed: store template code + seed
 * - If code matches preset/default: don't store code
 * - Only store CDN if not the default
 */
export function encodePlaygroundState(state: PlaygroundState): string {
  const serialized: SerializedState = {};

  // Handle preset + seed case: store just presetId + seed (NOT the display code)
  if (state.presetId && state.seed) {
    if (state.presetId !== DEFAULT_PRESET.id) {
      serialized.p = state.presetId;
    }
    serialized.s = state.seed;
    // Don't store code - it will be regenerated from preset + seed
  }
  // Handle custom code + seed: store template + seed
  else if (state.seed && state.templateCode) {
    serialized.c = btoa(state.templateCode); // Store template, not display
    serialized.s = state.seed;
  }
  // Handle preset without seed
  else if (state.presetId) {
    const preset = getPresetById(state.presetId);
    if (preset && state.code === preset.code) {
      // Code matches preset - only store preset ID if not default
      if (state.presetId !== DEFAULT_PRESET.id) {
        serialized.p = state.presetId;
      }
    } else {
      // Preset was edited - store both
      serialized.p = state.presetId;
      serialized.c = btoa(state.code);
    }
  }
  // No preset, no seed - store custom code if different from default
  else if (state.code !== DEFAULT_PRESET.code) {
    serialized.c = btoa(state.code);
  }

  // Only store CDN if not default
  if (state.cdnSource.type !== DEFAULT_CDN_SOURCE.type) {
    serialized.cdn = serializeCdnSource(state.cdnSource);
  }

  // If nothing to encode, return empty string
  if (Object.keys(serialized).length === 0) {
    return "";
  }

  return btoa(JSON.stringify(serialized));
}

/**
 * Decode state from a URL-safe string.
 */
export function decodePlaygroundState(encoded: string): PlaygroundState {
  if (!encoded) {
    return { ...DEFAULT_STATE };
  }

  try {
    const serialized: SerializedState = JSON.parse(atob(encoded));

    return {
      cdnSource: serialized.cdn
        ? parseCdnSource(serialized.cdn)
        : DEFAULT_CDN_SOURCE,
      code: serialized.c ? atob(serialized.c) : DEFAULT_CODE,
      presetId: serialized.p,
      seed: serialized.s,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/**
 * Get the current state from URL search params.
 */
export function getStateFromUrl(): PlaygroundState {
  if (typeof window === "undefined") {
    return { ...DEFAULT_STATE };
  }

  const params = new URLSearchParams(window.location.search);
  const state = params.get("state");

  return state ? decodePlaygroundState(state) : { ...DEFAULT_STATE };
}

/**
 * Update the URL with the current state.
 */
export function updateUrlWithState(state: PlaygroundState): void {
  if (typeof window === "undefined") {
    return;
  }

  const encoded = encodePlaygroundState(state);
  const url = new URL(window.location.href);

  if (encoded) {
    url.searchParams.set("state", encoded);
  } else {
    url.searchParams.delete("state");
  }

  window.history.replaceState({}, "", url.toString());
}

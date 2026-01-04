/**
 * Constants for the library playground component.
 * Provider display metadata and library source configurations.
 */

import {
  PROVIDER_CHECK_ORDER,
  PROVIDER_PATTERNS,
  type ProviderType,
  URL_POOLS,
} from "../../lib/constants";

// Re-export for convenience
export { PROVIDER_CHECK_ORDER, PROVIDER_PATTERNS, URL_POOLS };
export type { ProviderType };

/**
 * Extended provider type including 'all' for no filtering.
 */
export type ProviderFilter = ProviderType | "all";

/**
 * Display metadata for each provider in the UI.
 */
export interface ProviderDisplayInfo {
  /** Human-readable name */
  name: string;
  /** Emoji icon for quick recognition */
  icon: string;
  /** Tailwind color class for badges/accents */
  colorClass: string;
}

/**
 * Provider display information for UI rendering.
 */
export const PROVIDER_DISPLAY: Record<ProviderType, ProviderDisplayInfo> = {
  dailymotion: {
    colorClass: "text-blue-600 dark:text-blue-400",
    icon: "📺",
    name: "DailyMotion",
  },
  loom: {
    colorClass: "text-purple-600 dark:text-purple-400",
    icon: "🖥️",
    name: "Loom",
  },
  "spotify-album": {
    colorClass: "text-green-600 dark:text-green-400",
    icon: "💿",
    name: "Spotify Album",
  },
  "spotify-artist": {
    colorClass: "text-green-600 dark:text-green-400",
    icon: "🎤",
    name: "Spotify Artist",
  },
  "spotify-episode": {
    colorClass: "text-green-600 dark:text-green-400",
    icon: "🎧",
    name: "Spotify Episode",
  },
  "spotify-playlist": {
    colorClass: "text-green-600 dark:text-green-400",
    icon: "📋",
    name: "Spotify Playlist",
  },
  "spotify-show": {
    colorClass: "text-green-600 dark:text-green-400",
    icon: "🎙️",
    name: "Spotify Show",
  },
  "spotify-track": {
    colorClass: "text-green-600 dark:text-green-400",
    icon: "🎵",
    name: "Spotify Track",
  },
  vimeo: {
    colorClass: "text-blue-500 dark:text-blue-400",
    icon: "🎬",
    name: "Vimeo",
  },
  wistia: {
    colorClass: "text-cyan-600 dark:text-cyan-400",
    icon: "🎥",
    name: "Wistia",
  },
  youtube: {
    colorClass: "text-red-600 dark:text-red-400",
    icon: "▶️",
    name: "YouTube",
  },
  "youtube-shorts": {
    colorClass: "text-red-600 dark:text-red-400",
    icon: "📱",
    name: "YouTube Shorts",
  },
};

/**
 * Library source types for loading @social-embed/lib.
 */
export type LibSourceType =
  | "local"
  | "esm-sh-gh"
  | "esm-sh"
  | "unpkg"
  | "jsdelivr";

/**
 * Library source configuration.
 */
export interface LibSourceConfig {
  /** Display label */
  label: string;
  /** CDN URL pattern (null for local import) */
  urlPattern: string | null;
  /** Description for tooltip */
  description: string;
}

/**
 * Get the current git branch for esm.sh GitHub imports.
 * Falls back to 'master' if not available.
 */
function getGitBranch(): string {
  if (typeof window !== "undefined" && "__GIT_BRANCH__" in window) {
    return (window as unknown as { __GIT_BRANCH__: string }).__GIT_BRANCH__;
  }
  return "master";
}

/**
 * Library source configurations.
 * Order determines button display order in UI.
 */
export const LIB_SOURCES: Record<LibSourceType, LibSourceConfig> = {
  "esm-sh": {
    description: "esm.sh from npm (published package)",
    label: "esm.sh (npm)",
    urlPattern: "https://esm.sh/@social-embed/lib",
  },
  "esm-sh-gh": {
    description: "esm.sh from GitHub (latest branch)",
    label: "esm.sh (GitHub)",
    urlPattern: `https://esm.sh/gh/nicholasgriffintn/social-embed@${getGitBranch()}/packages/lib/dist/index.js`,
  },
  jsdelivr: {
    description: "jsDelivr CDN (npm mirror)",
    label: "jsDelivr",
    urlPattern: "https://cdn.jsdelivr.net/npm/@social-embed/lib",
  },
  local: {
    description: "Local monorepo build (development)",
    label: "Local",
    urlPattern: null,
  },
  unpkg: {
    description: "unpkg CDN (npm mirror)",
    label: "unpkg",
    urlPattern: "https://unpkg.com/@social-embed/lib",
  },
};

/**
 * Ordered list of library source types for UI rendering.
 */
export const LIB_SOURCE_ORDER: readonly LibSourceType[] = [
  "local",
  "esm-sh-gh",
  "esm-sh",
  "unpkg",
  "jsdelivr",
];

/**
 * Default library source.
 */
export const DEFAULT_LIB_SOURCE: LibSourceType = "local";

/**
 * Get all provider types as an array for iteration.
 */
export function getAllProviderTypes(): readonly ProviderType[] {
  return PROVIDER_CHECK_ORDER;
}

/**
 * Get all provider filter options including 'all'.
 */
export function getProviderFilterOptions(): readonly ProviderFilter[] {
  return ["all", ...PROVIDER_CHECK_ORDER];
}

/**
 * Get display info for a provider, with fallback for 'all'.
 */
export function getProviderDisplayInfo(
  provider: ProviderFilter,
): ProviderDisplayInfo {
  if (provider === "all") {
    return {
      colorClass: "text-slate-600 dark:text-slate-400",
      icon: "🌐",
      name: "All Providers",
    };
  }
  return PROVIDER_DISPLAY[provider];
}

/**
 * Get URL pool for a provider filter.
 * When 'all', combines all provider pools.
 */
export function getUrlPoolForFilter(filter: ProviderFilter): readonly string[] {
  if (filter === "all") {
    return PROVIDER_CHECK_ORDER.flatMap(
      (provider) => URL_POOLS[provider] ?? [],
    );
  }
  return URL_POOLS[filter] ?? [];
}

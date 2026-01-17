/**
 * Mock search data for development and testing.
 * Simulates Pagefind API responses with realistic content.
 */

import type { SearchResult } from "./searchTypes";

/**
 * Mock search results database.
 * Maps search terms to results for testing different scenarios.
 */
export const mockSearchResults: SearchResult[] = [
  {
    excerpt:
      "Get started with <mark>social-embed</mark> library. Install via npm or pnpm and start embedding videos in minutes.",
    id: "result-1",
    meta: {
      title: "Getting Started",
    },
    sub_results: [
      {
        anchor: "installation",
        excerpt:
          "Install the <mark>social-embed</mark> package using your preferred package manager: pnpm add @social-embed/lib",
        id: "result-1-sub-1",
        title: "Installation",
        url: "/getting-started/#installation",
      },
      {
        anchor: "quick-start",
        excerpt:
          "Import and use the <mark>embed</mark> function to convert URLs to embed codes automatically.",
        id: "result-1-sub-2",
        title: "Quick Start",
        url: "/getting-started/#quick-start",
      },
    ],
    url: "/getting-started/",
    word_count: 450,
  },
  {
    excerpt:
      "Embed <mark>YouTube</mark> videos with full support for standard URLs, Shorts, playlists, and live streams.",
    id: "result-2",
    meta: {
      title: "YouTube Embeds",
    },
    sub_results: [
      {
        anchor: "supported-url-formats",
        excerpt:
          "Supports watch URLs, short URLs (youtu.be), <mark>Shorts</mark>, embeds, and playlist URLs.",
        id: "result-2-sub-1",
        title: "Supported URL Formats",
        url: "/wc/providers/youtube/#supported-url-formats",
      },
      {
        anchor: "customization",
        excerpt:
          "Customize <mark>YouTube</mark> embeds with autoplay, start time, and privacy-enhanced mode.",
        id: "result-2-sub-2",
        title: "Customization Options",
        url: "/wc/providers/youtube/#customization",
      },
    ],
    url: "/wc/providers/youtube/",
    word_count: 820,
  },
  {
    excerpt:
      "Embed <mark>Vimeo</mark> videos with support for standard and unlisted videos, plus privacy controls.",
    id: "result-3",
    meta: {
      title: "Vimeo Embeds",
    },
    sub_results: [
      {
        anchor: "privacy",
        excerpt:
          "Control <mark>Vimeo</mark> embed privacy with DNT mode and hash-protected unlisted videos.",
        id: "result-3-sub-1",
        title: "Privacy Settings",
        url: "/wc/providers/vimeo/#privacy",
      },
    ],
    url: "/wc/providers/vimeo/",
    word_count: 340,
  },
  {
    excerpt:
      "Embed <mark>Spotify</mark> tracks, albums, playlists, and podcasts with customizable themes.",
    id: "result-4",
    meta: {
      title: "Spotify Embeds",
    },
    sub_results: [
      {
        anchor: "compact",
        excerpt:
          "Use compact mode for <mark>Spotify</mark> embeds in tight spaces, showing minimal player controls.",
        id: "result-4-sub-1",
        title: "Compact Mode",
        url: "/wc/providers/spotify/#compact",
      },
      {
        anchor: "themes",
        excerpt:
          "Match your site's theme with <mark>Spotify</mark> dark mode embed support.",
        id: "result-4-sub-2",
        title: "Theme Options",
        url: "/wc/providers/spotify/#themes",
      },
    ],
    url: "/wc/providers/spotify/",
    word_count: 510,
  },
  {
    excerpt:
      "Use <mark>social-embed</mark> Web Components for framework-agnostic video embeds with zero dependencies.",
    id: "result-5",
    meta: {
      title: "Web Components Installation",
    },
    sub_results: [
      {
        anchor: "cdn",
        excerpt:
          "Load <mark>social-embed</mark> Web Components directly from CDN without a build step.",
        id: "result-5-sub-1",
        title: "CDN Usage",
        url: "/wc/installation/#cdn",
      },
    ],
    url: "/wc/installation/",
    word_count: 380,
  },
  {
    excerpt:
      "Complete <mark>API</mark> examples for the social-embed library including all functions and options.",
    id: "result-6",
    meta: {
      title: "Library Examples",
    },
    sub_results: [
      {
        anchor: "getembedurl",
        excerpt:
          "The getEmbedUrl function extracts embed URLs from video links. Returns null for unsupported <mark>URLs</mark>.",
        id: "result-6-sub-1",
        title: "getEmbedUrl()",
        url: "/lib/examples/#getembedurl",
      },
      {
        anchor: "detectprovider",
        excerpt:
          "Detect which video provider a <mark>URL</mark> belongs to. Returns 'youtube', 'vimeo', 'spotify', etc.",
        id: "result-6-sub-2",
        title: "detectProvider()",
        url: "/lib/examples/#detectprovider",
      },
    ],
    url: "/lib/examples/",
    word_count: 1200,
  },
  {
    excerpt:
      "List of all supported <mark>video</mark> providers including YouTube, Vimeo, Spotify, Dailymotion, and more.",
    id: "result-7",
    meta: {
      title: "Supported Providers",
    },
    sub_results: [],
    url: "/lib/providers/",
    word_count: 280,
  },
  {
    excerpt:
      "Install <mark>social-embed</mark> library with improved TypeScript support and provider integrations.",
    id: "result-8",
    meta: {
      title: "Library Installation",
    },
    sub_results: [
      {
        anchor: "package-managers",
        excerpt:
          "Install using npm, pnpm, or yarn to add <mark>social-embed</mark> to your project.",
        id: "result-8-sub-1",
        title: "Package Managers",
        url: "/lib/installation/#package-managers",
      },
    ],
    url: "/lib/installation/",
    word_count: 650,
  },
];

/**
 * Filter mock results by search query.
 * Simulates search matching by checking title and excerpt.
 */
export function filterMockResults(query: string): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const terms = normalizedQuery.split(/\s+/);

  return mockSearchResults
    .filter((result) => {
      const searchableText = [
        result.meta.title,
        result.excerpt,
        ...result.sub_results.map((sub) => sub.title),
        ...result.sub_results.map((sub) => sub.excerpt),
      ]
        .join(" ")
        .toLowerCase();

      // Match if any search term is found
      return terms.some((term) => searchableText.includes(term));
    })
    .map((result) => ({
      ...result,
      // Re-highlight matches in excerpt (replace existing marks and add new ones)
      excerpt: highlightMatches(stripMarks(result.excerpt), terms),
      sub_results: result.sub_results.map((sub) => ({
        ...sub,
        excerpt: highlightMatches(stripMarks(sub.excerpt), terms),
      })),
    }));
}

/**
 * Strip existing <mark> tags from text.
 */
function stripMarks(text: string): string {
  return text.replace(/<\/?mark>/g, "");
}

/**
 * Add <mark> tags around matching terms.
 */
function highlightMatches(text: string, terms: string[]): string {
  let result = text;
  for (const term of terms) {
    // Case-insensitive replace with preserved case
    const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");
    result = result.replace(regex, "<mark>$1</mark>");
  }
  return result;
}

/**
 * Escape special regex characters.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Simulate search delay for realistic loading states.
 */
export async function simulateSearchDelay(
  minMs = 100,
  maxMs = 300,
): Promise<void> {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

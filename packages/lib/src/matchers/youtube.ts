import { defineIframeMatcher } from "../factories/iframe";

/**
 * YouTube URL patterns.
 *
 * @remarks
 * Matches:
 * - `https://www.youtube.com/watch?v=VIDEO_ID`
 * - `https://youtu.be/VIDEO_ID`
 * - `https://www.youtube.com/shorts/VIDEO_ID`
 * - `https://www.youtube-nocookie.com/embed/VIDEO_ID`
 *
 * Video ID is always 11 characters.
 */
const YOUTUBE_PATTERNS = [
  // Standard watch URL: youtube.com/watch?v=VIDEO_ID
  /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,

  // Short URL: youtu.be/VIDEO_ID
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,

  // Shorts URL: youtube.com/shorts/VIDEO_ID
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,

  // Embed URL: youtube.com/embed/VIDEO_ID or youtube-nocookie.com/embed/VIDEO_ID
  /youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/,
] as const;

/**
 * YouTube matcher for video embeds.
 *
 * @remarks
 * - Supports standard, short, and embed URLs
 * - Privacy mode uses youtube-nocookie.com (default: enabled)
 * - Default dimensions: 560x315
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([YouTubeMatcher]);
 * const result = registry.match("https://youtu.be/dQw4w9WgXcQ");
 * if (result.ok) {
 *   console.log(result.data); // { id: "dQw4w9WgXcQ" }
 * }
 * ```
 */
export const YouTubeMatcher = defineIframeMatcher({
  defaultDimensions: {
    height: 315,
    width: 560,
  },

  domains: ["youtube.com", "youtu.be", "youtube-nocookie.com"],

  embedUrl: (id, options) => {
    const privacy = options?.privacy ?? true;
    const domain = privacy ? "youtube-nocookie.com" : "youtube.com";
    return `https://www.${domain}/embed/${id}`;
  },

  iframeAttributes: {
    allow:
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  },
  name: "YouTube",

  patterns: [...YOUTUBE_PATTERNS],

  supportsPrivacyMode: true,
});

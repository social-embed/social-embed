import type { EmbedProvider } from "../provider";

/**
 * Regex matcher for YouTube URLs
 */
export const youTubeUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?.com|youtu.be)(?:\/watch\?v)?[=/]([a-zA-Z0-9_-]{11})(?:\\?|=|&|$)/;

export const getYouTubeIdFromUrl = (url: string | undefined): string => {
  if (url) {
    // credit: https://stackoverflow.com/a/42442074
    return url.match(youTubeUrlRegex)?.[1] ?? "";
  }
  return "";
};

export const getYouTubeEmbedUrlFromId = (id: string | undefined): string => {
  return `https://www.youtube.com/embed/${id}`;
};

export const YouTubeProvider: EmbedProvider = {
  name: "YouTube",

  canParseUrl(url: string) {
    return youTubeUrlRegex.test(url);
  },

  getIdFromUrl(url: string) {
    return getYouTubeIdFromUrl(url);
  },

  getEmbedUrlFromId(id: string) {
    return getYouTubeEmbedUrlFromId(id);
  },
};

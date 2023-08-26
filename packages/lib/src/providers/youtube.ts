/**
 * Regex matcher for YouTube URLs
 */
export const youTubeUrlRegex =
  "^(?:(?:https?):)?(?://)?[^/]*(?:youtube(?:-nocookie)?.com|youtu.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)";

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

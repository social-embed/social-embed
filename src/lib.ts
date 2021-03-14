export const extractYouTubeId = (url: string | undefined) => {
  if (url) {
    // credit: https://stackoverflow.com/a/42442074
    return url.match(
      '^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?.com|youtu.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)'
    )?.[1];
  }
  return '';
};

export const youtubeUrlFromYoutubeId = (youtubeID: string | undefined) => {
  return `https://www.youtube.com/embed/${youtubeID}`;
};

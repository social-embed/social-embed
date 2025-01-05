import type { EmbedProvider } from "../provider";

// regex: derived from https://gist.github.com/TrevorJTClarke/a14c37db3c11ee23a700
// Thank you @TrevorJTClarke
export const spotifyUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)([-\w]{22})(?:\?si=[_-\w]{22})?$/;

export const spotifySymbolRegex =
  /spotify:(?:(album|track|playlist):|\?uri=spotify:track:)([-\w]{22})/;

export const getSpotifyIdAndTypeFromUrl = (url: string): [string, string] => {
  const [, spotifyType, spotifyId] =
    url.match(spotifyUrlRegex) || url.match(spotifySymbolRegex) || [];

  return [spotifyId, spotifyType];
};

export const getSpotifyEmbedUrlFromIdAndType = (
  id: string,
  ...args: unknown[]
): string => {
  const spotifyType = typeof args[0] === "string" ? args[0] : "";
  return `https://open.spotify.com/embed/${spotifyType}/${id}`;
};

export const SpotifyProvider: EmbedProvider = {
  name: "Spotify",

  canParseUrl(url: string) {
    return spotifyUrlRegex.test(url) || spotifySymbolRegex.test(url);
  },

  getIdFromUrl(url: string) {
    return getSpotifyIdAndTypeFromUrl(url);
  },

  getEmbedUrlFromId(id: string) {
    return getSpotifyEmbedUrlFromIdAndType(id);
  },
};

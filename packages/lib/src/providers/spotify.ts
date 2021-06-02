// regex: derived from https://gist.github.com/TrevorJTClarke/a14c37db3c11ee23a700
// Thank you @TrevorJTClarke
export const spotifyUrlRegex =
  /(?:(?:https?):)?(?:\/\/)?(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/;

export const spotifySymbolRegex =
  /spotify:(?:(album|track|playlist):|\?uri=spotify:track:)((\w|-){22})/;

export const getSpotifyIdAndTypeFromUrl = (url: string): [string, string] => {
  const [, spotifyType, spotifyId] =
    url.match(spotifyUrlRegex) || url.match(spotifySymbolRegex) || [];

  return [spotifyId, spotifyType];
};

export const getSpotifyEmbedUrlFromIdAndType = (
  spotifyId: string,
  spotifyType: string
): string => `https://open.spotify.com/embed/${spotifyType}/${spotifyId}`;

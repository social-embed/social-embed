export enum Provider {
  YouTube = 'YouTube',
  Spotify = 'Spotify',
  Vimeo = 'Vimeo',
  DailyMotion = 'DailyMotion',
}

export const getProviderFromUrl = (url: string): Provider | undefined => {
  if (!url) {
    return undefined;
  }
  if (url.match(/dailymotion/)) {
    return Provider.DailyMotion;
  }
  if (url.match(/spotify/)) {
    return Provider.Spotify;
  }
  if (url.match(/vimeo/)) {
    return Provider.Vimeo;
  }
  if (url.match(/youtu\.?be/)) {
    return Provider.YouTube;
  }
  return undefined;
};

// Credit: https://stackoverflow.com/a/50644701, (2021-03-14: Support ?playlist)
export const dailyMotionUrlRegex = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:\?playlist=[a-zA-Z0-9]+)?$/;
export const getDailyMotionIdFromUrl = (url: string): string => {
  return url.match(dailyMotionUrlRegex)?.[1] ?? '';
};
export const getDailyMotionEmbedFromId = (dailyMotionId: string): string => {
  return `https://www.dailymotion.com/embed/video/${dailyMotionId}`; // ?autoplay=1
};

// Credit: https://stackoverflow.com/a/50777192 (2021-03-14: modified / fixed to ignore unused groups)
export const vimeoUrlRegex = /(?:(?:https?):)?(?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
export const getVimeoIdFromUrl = (url: string): string =>
  url.match(vimeoUrlRegex)?.[1] ?? '';

export const getVimeoEmbedUrlFromId = (vimeoId: string): string =>
  `https://player.vimeo.com/video/${vimeoId}`;

// regex: derived from https://gist.github.com/TrevorJTClarke/a14c37db3c11ee23a700
// Thank you @TrevorJTClarke
export const spotifyUrlRegex = /(?:(?:https?):)?(?:\/\/)?(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/;
export const spotifySymbolRegex = /spotify:(?:(album|track|playlist):|\?uri=spotify:track:)((\w|-){22})/;
export const getSpotifyIdAndTypeFromUrl = (url: string): [string, string] => {
  const [, spotifyType, spotifyId] =
    url.match(spotifyUrlRegex) || url.match(spotifySymbolRegex) || [];

  return [spotifyId, spotifyType];
};

export const youTubeUrlRegex =
  '^(?:(?:https?):)?(?://)?[^/]*(?:youtube(?:-nocookie)?.com|youtu.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)';

export const getSpotifyEmbedUrlFromIdAndType = (
  spotifyId: string,
  spotifyType: string
): string => `https://open.spotify.com/embed/${spotifyType}/${spotifyId}`;

export const getYouTubeIdFromUrl = (url: string | undefined): string => {
  if (url) {
    // credit: https://stackoverflow.com/a/42442074
    return url.match(youTubeUrlRegex)?.[1] ?? '';
  }
  return '';
};

export const getYouTubeEmbedUrlFromId = (
  youtubeID: string | undefined
): string => {
  return `https://www.youtube.com/embed/${youtubeID}`;
};

export type ProviderKey = keyof typeof Provider;
export type ProviderType = typeof Provider[Provider];
type ValueOfProvider = `${Provider}`;

export const ProviderIdFunctionMap: {
  [P in ValueOfProvider]: (url: string) => string | string[];
} = {
  [Provider.DailyMotion]: getDailyMotionIdFromUrl,
  [Provider.Spotify]: getSpotifyIdAndTypeFromUrl,
  [Provider.Vimeo]: getVimeoIdFromUrl,
  [Provider.YouTube]: getYouTubeIdFromUrl,
};

export const ProviderIdUrlFunctionMap: {
  [P in ValueOfProvider]: (id: string, ...args: any) => string;
} = {
  [Provider.DailyMotion]: getDailyMotionEmbedFromId,
  [Provider.Spotify]: getSpotifyEmbedUrlFromIdAndType,
  [Provider.Vimeo]: getVimeoEmbedUrlFromId,
  [Provider.YouTube]: getYouTubeEmbedUrlFromId,
};

export const convertUrlToEmbedUrl = (url: string): string => {
  const provider = getProviderFromUrl(url);

  if (!provider) return '';

  const getId = ProviderIdFunctionMap[provider];
  const getEmbedUrlFromId = ProviderIdUrlFunctionMap[provider];

  const id = getId(url);

  if (Array.isArray(id)) {
    const _id = id.shift();
    if (!_id) {
      return '';
    }
    return getEmbedUrlFromId(_id, ...id);
  }
  return getEmbedUrlFromId(id);
};



import * as YouTube from './providers/youtube';
import * as Spotify from './providers/spotify';
import * as Vimeo from './providers/vimeo';
import * as DailyMotion from './providers/dailymotion';

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

export type ProviderKey = keyof typeof Provider;
export type ProviderType = typeof Provider[Provider];
type ValueOfProvider = `${Provider}`;

export const ProviderIdFunctionMap: {
  [P in ValueOfProvider]: (url: string) => string | string[];
} = {
  [Provider.DailyMotion]: DailyMotion.getDailyMotionIdFromUrl,
  [Provider.Spotify]: Spotify.getSpotifyIdAndTypeFromUrl,
  [Provider.Vimeo]: Vimeo.getVimeoIdFromUrl,
  [Provider.YouTube]: YouTube.getYouTubeIdFromUrl,
};

export const ProviderIdUrlFunctionMap: {
  [P in ValueOfProvider]: (id: string, ...args: any) => string;
} = {
  [Provider.DailyMotion]: DailyMotion.getDailyMotionEmbedFromId,
  [Provider.Spotify]: Spotify.getSpotifyEmbedUrlFromIdAndType,
  [Provider.Vimeo]: Vimeo.getVimeoEmbedUrlFromId,
  [Provider.YouTube]: YouTube.getYouTubeEmbedUrlFromId,
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

import * as YouTube from './providers/youtube';
import * as Spotify from './providers/spotify';
import * as Vimeo from './providers/vimeo';
import * as DailyMotion from './providers/dailymotion';
import * as EdPuzzle from './providers/edpuzzle';
import * as Loom from './providers/loom';
import * as Wistia from './providers/wistia';
import {Provider} from './constants';
import type {ValueOfProvider} from './types';

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
  if (url.match(/edpuzzle.com/)) {
    return Provider.EdPuzzle;
  }
  if (Wistia.getWistiaIdFromUrl(url)) {
    return Provider.Wistia;
  }
  if (Loom.getLoomIdFromUrl(url)) {
    return Provider.Loom;
  }
  return undefined;
};

export const ProviderIdFunctionMap: {
  [P in ValueOfProvider]: (url: string) => string | string[];
} = {
  [Provider.DailyMotion]: DailyMotion.getDailyMotionIdFromUrl,
  [Provider.Spotify]: Spotify.getSpotifyIdAndTypeFromUrl,
  [Provider.Vimeo]: Vimeo.getVimeoIdFromUrl,
  [Provider.YouTube]: YouTube.getYouTubeIdFromUrl,
  [Provider.EdPuzzle]: EdPuzzle.getEdPuzzleIdFromUrl,
  [Provider.Loom]: Loom.getLoomIdFromUrl,
  [Provider.Wistia]: Wistia.getWistiaIdFromUrl,
};

type ProviderIdFn = {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [P in ValueOfProvider]: (id: string, ...args: any[]) => string;
};

export const ProviderIdUrlFunctionMap: ProviderIdFn = {
  [Provider.DailyMotion]: DailyMotion.getDailyMotionEmbedFromId,
  [Provider.Spotify]: Spotify.getSpotifyEmbedUrlFromIdAndType,
  [Provider.Vimeo]: Vimeo.getVimeoEmbedUrlFromId,
  [Provider.YouTube]: YouTube.getYouTubeEmbedUrlFromId,
  [Provider.EdPuzzle]: EdPuzzle.getEdPuzzleEmbedUrlFromId,
  [Provider.Loom]: Loom.getLoomEmbedUrlFromId,
  [Provider.Wistia]: Wistia.getWistiaEmbedUrlFromId,
};

/**
 * Converts URL variations from sites to their "embed-friendly" URL.
 */
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

export const isString = (val: unknown): val is string => {
  return typeof val === 'string';
};

export const isRegExp = (val: unknown): val is RegExp => {
  return val instanceof RegExp;
};

/**
 * Factory to create regex matchers
 *
 * @param regex Regular expression or string pattern to match
 */
export const matcher =
  (regex: RegExp | string): ((value: string) => boolean) =>
  (value: string) => {
    return isString(value) && !isRegExp(regex)
      ? value.includes(regex)
      : new RegExp(regex).test(value);
  };

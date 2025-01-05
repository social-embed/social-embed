export * from "./providers";
export {
  ProviderIdFunctionMap,
  ProviderIdUrlFunctionMap,
  getProviderFromUrl,
  convertUrlToEmbedUrl,
} from "./utils";
import type { EmbedProvider } from "./provider";
import { DailyMotionProvider } from "./providers/dailymotion";
import { EdPuzzleProvider } from "./providers/edpuzzle";
import { LoomProvider } from "./providers/loom";
import { SpotifyProvider } from "./providers/spotify";
import { VimeoProvider } from "./providers/vimeo";
import { WistiaProvider } from "./providers/wistia";
import { YouTubeProvider } from "./providers/youtube";
import { EmbedProviderRegistry } from "./registry";

export const defaultProviders: EmbedProvider[] = [
  DailyMotionProvider,
  EdPuzzleProvider,
  LoomProvider,
  SpotifyProvider,
  VimeoProvider,
  WistiaProvider,
  YouTubeProvider,
];

/**
 * Create a default registry and register all built-in providers.
 */
export const defaultRegistry = new EmbedProviderRegistry();
for (const provider of defaultProviders) {
  defaultRegistry.register(provider);
}

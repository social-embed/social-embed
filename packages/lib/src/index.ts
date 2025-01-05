export * from "./providers";
export { Provider } from "./constants";
export type { ProviderKey, ProviderType } from "./types";
export {
  ProviderIdFunctionMap,
  ProviderIdUrlFunctionMap,
  getProviderFromUrl,
  convertUrlToEmbedUrl,
} from "./utils";
import { DailyMotionProvider } from "./providers/dailymotion";
import { EdPuzzleProvider } from "./providers/edpuzzle";
import { LoomProvider } from "./providers/loom";
import { SpotifyProvider } from "./providers/spotify";
import { VimeoProvider } from "./providers/vimeo";
import { YouTubeProvider } from "./providers/youtube";
import { EmbedProviderRegistry } from "./registry";

// Create an instance of the registry
export const defaultRegistry = new EmbedProviderRegistry();
defaultRegistry.register(DailyMotionProvider);
defaultRegistry.register(EdPuzzleProvider);
defaultRegistry.register(LoomProvider);
defaultRegistry.register(SpotifyProvider);
defaultRegistry.register(VimeoProvider);
defaultRegistry.register(YouTubeProvider);

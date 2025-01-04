export * from "./providers";
export { Provider } from "./constants";
export type { ProviderKey, ProviderType } from "./types";
export {
  ProviderIdFunctionMap,
  ProviderIdUrlFunctionMap,
  getProviderFromUrl,
  convertUrlToEmbedUrl,
} from "./utils";
import { YouTubeProvider } from "./providers/youtube";
import { EmbedProviderRegistry } from "./registry";

// Create an instance of the registry
export const defaultRegistry = new EmbedProviderRegistry();
defaultRegistry.register(YouTubeProvider);

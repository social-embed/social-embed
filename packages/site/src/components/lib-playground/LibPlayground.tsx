import {
  convertUrlToEmbedUrl,
  getProviderFromUrl,
  isYouTubeShortsUrl,
} from "@social-embed/lib";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createRng, generateSeed } from "../../lib/seededRng";
import { RerollButton } from "../playground/RerollButton";
import { detectProvider } from "../playground/urlReplacer";
import { CopyLinkButton } from "./CopyLinkButton";
import {
  getProviderFilterOptions,
  getUrlPoolForFilter,
  type LibSourceType,
  type ProviderFilter,
} from "./constants";
import { LibSourcePicker } from "./LibSourcePicker";
import {
  createShareableUrl,
  getLibStateFromUrl,
  type LibPlaygroundState,
  updateLibUrlWithState,
} from "./libPlaygroundState";
import { type LibOutput, OutputDisplay } from "./OutputDisplay";
import { ProviderSelector } from "./ProviderSelector";
import { UrlInput } from "./UrlInput";

export interface LibPlaygroundProps {
  /** Display mode */
  mode?: "mini" | "full";
  /** Initial URL to test */
  initialUrl?: string;
  /** Initial provider filter */
  initialProvider?: ProviderFilter;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Transform a URL using the library and return output data.
 */
function transformUrl(url: string): LibOutput {
  if (!url.trim()) {
    return {
      embedUrl: null,
      input: url,
      isValid: false,
      provider: null,
      providerId: null,
    };
  }

  try {
    const provider = getProviderFromUrl(url);

    if (!provider) {
      return {
        embedUrl: null,
        error: "No matching provider found for this URL",
        input: url,
        isValid: false,
        provider: null,
        providerId: null,
      };
    }

    const providerId = provider.getIdFromUrl(url);
    const embedUrl = convertUrlToEmbedUrl(url);

    const isShorts = isYouTubeShortsUrl(url);

    return {
      embedUrl: embedUrl || null,
      input: url,
      isShorts,
      isValid: true,
      provider: detectProvider(url),
      providerId,
    };
  } catch (err) {
    return {
      embedUrl: null,
      error: err instanceof Error ? err.message : "Unknown error",
      input: url,
      isValid: false,
      provider: null,
      providerId: null,
    };
  }
}

/**
 * Select a random URL from the pool using a seeded RNG.
 */
function selectRandomUrl(filter: ProviderFilter, seed: string): string {
  const pool = getUrlPoolForFilter(filter);
  if (pool.length === 0) {
    return "";
  }

  const rng = createRng(seed);
  const index = Math.floor(rng() * pool.length);
  return pool[index];
}

/**
 * Main library playground component.
 * Allows testing @social-embed/lib functions interactively.
 */
export function LibPlayground({
  mode = "full",
  initialUrl,
  initialProvider,
  className = "",
}: LibPlaygroundProps) {
  const [state, setState] = useState<LibPlaygroundState>(() => {
    const urlState = getLibStateFromUrl();
    return {
      ...urlState,
      providerFilter: initialProvider ?? urlState.providerFilter,
      url: initialUrl ?? urlState.url,
    };
  });

  const [output, setOutput] = useState<LibOutput | null>(null);

  // Check if reroll is available
  const canReroll = useMemo(() => {
    const options = getProviderFilterOptions();
    return options.length > 1;
  }, []);

  // Transform the URL whenever it changes
  useEffect(() => {
    if (state.url) {
      const result = transformUrl(state.url);
      setOutput(result);
    } else {
      setOutput(null);
    }
  }, [state.url]);

  // Sync state to URL (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateLibUrlWithState(state);
    }, 300);
    return () => clearTimeout(timeout);
  }, [state]);

  const handleUrlChange = useCallback((url: string) => {
    setState((prev) => ({ ...prev, seed: undefined, url }));
  }, []);

  const handleProviderChange = useCallback((providerFilter: ProviderFilter) => {
    setState((prev) => ({ ...prev, providerFilter, seed: undefined }));
  }, []);

  const handleLibSourceChange = useCallback((libSource: LibSourceType) => {
    setState((prev) => ({ ...prev, libSource }));
  }, []);

  const handleReroll = useCallback(() => {
    const newSeed = generateSeed();
    const newUrl = selectRandomUrl(state.providerFilter, newSeed);
    setState((prev) => ({ ...prev, seed: newSeed, url: newUrl }));
  }, [state.providerFilter]);

  const handleSubmit = useCallback(() => {
    // Force re-transform on submit (already happens via useEffect, but explicit)
    if (state.url) {
      const result = transformUrl(state.url);
      setOutput(result);
    }
  }, [state.url]);

  const isMini = mode === "mini";

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Header controls - full mode only */}
      {!isMini && (
        <div className="flex flex-wrap items-center gap-2">
          <ProviderSelector
            onChange={handleProviderChange}
            value={state.providerFilter}
          />
          {canReroll && (
            <RerollButton onClick={handleReroll} showLabel variant="xs" />
          )}
          <div className="flex-1" />
          <CopyLinkButton getUrl={() => createShareableUrl(state)} />
        </div>
      )}

      {/* URL Input with reroll */}
      <div className={isMini ? "flex items-center gap-2" : ""}>
        <UrlInput
          className={isMini ? "flex-1" : ""}
          onChange={handleUrlChange}
          onSubmit={handleSubmit}
          placeholder={
            isMini
              ? "Paste a URL..."
              : "Paste a video URL (YouTube, Vimeo, Spotify, etc.)"
          }
          value={state.url}
        />
        {isMini && canReroll && (
          <RerollButton onClick={handleReroll} variant="xs" />
        )}
      </div>

      {/* Output Display */}
      <OutputDisplay compact={isMini} output={output} />

      {/* Library source picker - full mode only */}
      {!isMini && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Library source:
          </p>
          <LibSourcePicker
            onChange={handleLibSourceChange}
            value={state.libSource}
          />
        </div>
      )}
    </div>
  );
}

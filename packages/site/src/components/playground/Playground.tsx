import { useCallback, useEffect, useMemo, useState } from "react";
import { type CdnSource, getCdnUrls } from "../../lib/cdnSources";
import {
  DEFAULT_STATE,
  getStateFromUrl,
  type PlaygroundState,
  updateUrlWithState,
} from "../../lib/playgroundState";
import { CdnSourcePicker } from "./CdnSourcePicker";
import { CodeEditor } from "./CodeEditor";
import { ConsoleOutput } from "./ConsoleOutput";
import { type ConsoleEntry, PreviewPane } from "./PreviewPane";
import { DEFAULT_PRESET, getPresetById, PRESETS, type Preset } from "./presets";

/**
 * Main playground component that orchestrates all playground features.
 */
export function Playground() {
  const [state, setState] = useState<PlaygroundState>(() => {
    // Initialize from URL or default
    const urlState = getStateFromUrl();
    if (urlState.presetId) {
      const preset = getPresetById(urlState.presetId);
      if (preset) {
        return { ...urlState, code: preset.code };
      }
    }
    return urlState.code !== DEFAULT_STATE.code
      ? urlState
      : { ...DEFAULT_STATE, code: DEFAULT_PRESET.code };
  });

  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [stableCode, setStableCode] = useState(state.code);

  // Debounce code changes for preview
  useEffect(() => {
    const timer = setTimeout(() => {
      setStableCode(state.code);
    }, 500);
    return () => clearTimeout(timer);
  }, [state.code]);

  // Update URL when state changes
  useEffect(() => {
    updateUrlWithState(state);
  }, [state]);

  // Get CDN URLs based on source
  const cdnUrls = useMemo(() => getCdnUrls(state.cdnSource), [state.cdnSource]);

  // Handlers
  const handleCodeChange = useCallback((code: string) => {
    setState((prev) => ({ ...prev, code, presetId: undefined }));
  }, []);

  const handleCdnSourceChange = useCallback((cdnSource: CdnSource) => {
    setState((prev) => ({ ...prev, cdnSource }));
    setConsoleLogs([]); // Clear console on CDN change
  }, []);

  const handlePresetChange = useCallback((preset: Preset) => {
    setState((prev) => ({
      ...prev,
      code: preset.code,
      presetId: preset.id,
    }));
    setConsoleLogs([]); // Clear console on preset change
  }, []);

  const handleConsoleMessage = useCallback((entry: ConsoleEntry) => {
    setConsoleLogs((prev) => [...prev, entry]);
  }, []);

  const handleClearConsole = useCallback(() => {
    setConsoleLogs([]);
  }, []);

  return (
    <div className="flex flex-col h-full min-h-[600px] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        {/* Preset selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Preset:
          </span>
          <select
            className="px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 focus:outline-none focus:border-blue-400"
            onChange={(e) => {
              const preset = getPresetById(e.target.value);
              if (preset) handlePresetChange(preset);
            }}
            value={state.presetId ?? ""}
          >
            <option value="">Custom</option>
            {PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* CDN source picker */}
        <div className="flex-1 min-w-[300px]">
          <CdnSourcePicker
            onChange={handleCdnSourceChange}
            value={state.cdnSource}
          />
        </div>
      </div>

      {/* Main content - responsive layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Editor pane */}
        <div className="flex-1 min-h-[200px] md:min-h-0 md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
          <CodeEditor
            className="h-full"
            language="html"
            onChange={handleCodeChange}
            theme="dark"
            value={state.code}
          />
        </div>

        {/* Preview + Console pane */}
        <div className="flex-1 flex flex-col min-h-[300px] md:min-h-0 md:w-1/2">
          {/* Preview */}
          <div className="flex-1 min-h-[150px]">
            <PreviewPane
              className="h-full"
              code={stableCode}
              onConsoleMessage={handleConsoleMessage}
              wcUrl={cdnUrls.wc}
            />
          </div>

          {/* Console output */}
          <ConsoleOutput
            className="h-[150px] shrink-0"
            logs={consoleLogs}
            onClear={handleClearConsole}
          />
        </div>
      </div>
    </div>
  );
}

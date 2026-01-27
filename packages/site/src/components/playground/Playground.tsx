import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type CdnSource, getCdnUrls } from "../../lib/cdnSources";
import {
  DEFAULT_STATE,
  getStateFromUrl,
  type PlaygroundState,
  updateUrlWithState,
} from "../../lib/playgroundState";
import { generateSeed } from "../../lib/seededRng";
import { CdnSourcePicker } from "./CdnSourcePicker";
import { CodeEditor } from "./CodeEditor";
import { ConsoleOutput } from "./ConsoleOutput";
import {
  type ConsoleEntry,
  PreviewPane,
  type PreviewPaneHandle,
} from "./PreviewPane";
import { DEFAULT_PRESET, getPresetById, PRESETS, type Preset } from "./presets";
import { RerollButton } from "./RerollButton";
import {
  applySeededUrls,
  canRandomize,
  generateReactiveUpdates,
} from "./urlReplacer";

/**
 * Main playground component that orchestrates all playground features.
 */
export function Playground() {
  const [state, setState] = useState<PlaygroundState>(() => {
    // Initialize from URL or default
    const urlState = getStateFromUrl();

    // Case 1: Preset + seed → compute display code from preset + seed
    if (urlState.presetId && urlState.seed) {
      const preset = getPresetById(urlState.presetId);
      if (preset) {
        const { html } = applySeededUrls(preset.code, urlState.seed);
        return {
          ...urlState,
          code: html, // Display code (seeded)
          templateCode: preset.code, // Template = preset code
        };
      }
    }

    // Case 1b: Seed only (no presetId) → assume default preset + seed
    // This happens when default preset was rerolled (we don't store presetId for default)
    if (
      urlState.seed &&
      !urlState.presetId &&
      urlState.code === DEFAULT_STATE.code
    ) {
      const { html } = applySeededUrls(DEFAULT_PRESET.code, urlState.seed);
      return {
        ...urlState,
        code: html, // Display code (seeded)
        presetId: DEFAULT_PRESET.id, // Set the preset ID
        templateCode: DEFAULT_PRESET.code, // Template = default preset code
      };
    }

    // Case 2: Template (custom code) + seed → compute display from template + seed
    if (urlState.seed && urlState.code !== DEFAULT_STATE.code) {
      // urlState.code here is the template (stored as 'c' in URL)
      const template = urlState.code;
      const { html } = applySeededUrls(template, urlState.seed);
      return {
        ...urlState,
        code: html, // Display code (seeded)
        templateCode: template, // Preserve original template
      };
    }

    // Case 3: Preset without seed
    if (urlState.presetId) {
      const preset = getPresetById(urlState.presetId);
      if (preset) {
        return { ...urlState, code: preset.code };
      }
    }

    // Case 4: Custom code or default
    return urlState.code !== DEFAULT_STATE.code
      ? urlState
      : {
          ...DEFAULT_STATE,
          code: DEFAULT_PRESET.code,
          presetId: DEFAULT_PRESET.id,
        };
  });

  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [stableCode, setStableCode] = useState(state.code);
  const previewRef = useRef<PreviewPaneHandle>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(() => {
    // Default: open on desktop (md: 768px+), closed on mobile
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 768px)").matches;
    }
    return true; // SSR fallback
  });

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
    // User edited the display code - clear seed, their edit becomes the template
    setState((prev) => ({
      ...prev,
      code,
      presetId: undefined,
      seed: undefined, // Clear seed - manual edit takes precedence
      templateCode: undefined, // Their edit IS the new template
    }));
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
      seed: undefined, // Clear any previous seed
      templateCode: undefined, // Will be derived from presetId
    }));
    setConsoleLogs([]); // Clear console on preset change
  }, []);

  const handleConsoleMessage = useCallback((entry: ConsoleEntry) => {
    setConsoleLogs((prev) => [...prev, entry]);
  }, []);

  const handleClearConsole = useCallback(() => {
    setConsoleLogs([]);
  }, []);

  // Reroll handler - generates new seed and updates URLs
  const handleReroll = useCallback(() => {
    const newSeed = generateSeed();

    // Get template (preset code, existing template, or current code)
    const template =
      state.templateCode ??
      (state.presetId ? getPresetById(state.presetId)?.code : undefined) ??
      state.code;

    // Reactive update via postMessage (no iframe reload)
    const updates = generateReactiveUpdates(template, newSeed);
    for (const update of updates) {
      previewRef.current?.updateAttribute(
        update.selector,
        update.attribute,
        update.value,
      );
    }

    // Compute display code from template + seed
    const { html } = applySeededUrls(template, newSeed);

    setState((prev) => ({
      ...prev,
      code: html, // Display code for editor
      seed: newSeed,
      templateCode: template, // Preserve template for URL encoding
    }));
  }, [state.code, state.templateCode, state.presetId]);

  // Check if current code can be randomized
  const canReroll = useMemo(() => canRandomize(state.code), [state.code]);

  return (
    <div className="flex flex-col h-full min-h-[600px] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        {/* Preset selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
            Preset:
          </span>
          <select
            className="h-[26px] px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 cursor-pointer select-none"
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

        {/* Reroll button */}
        {canReroll && <RerollButton onClick={handleReroll} variant="sm" />}

        {/* CDN source picker */}
        <div className="flex-1 min-w-[300px]">
          <CdnSourcePicker
            onChange={handleCdnSourceChange}
            value={state.cdnSource}
          />
        </div>

        {/* More sandboxes link */}
        <a
          className="h-[26px] px-2 py-1 text-xs rounded border transition-colors cursor-pointer select-none inline-flex items-center gap-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 no-underline"
          href="/wc/playground/external"
        >
          More sandboxes
          <svg
            aria-hidden="true"
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" x2="21" y1="14" y2="3" />
          </svg>
        </a>
      </div>

      {/* Main content - responsive layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Editor pane */}
        <div className="flex-1 min-h-[200px] md:min-h-0 md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
          <CodeEditor
            className="h-full"
            language="html"
            onChange={handleCodeChange}
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
              ref={previewRef}
              wcUrl={cdnUrls.wc}
            />
          </div>

          {/* Console output */}
          <ConsoleOutput
            className={isConsoleOpen ? "h-[150px] shrink-0" : "shrink-0"}
            isOpen={isConsoleOpen}
            logs={consoleLogs}
            onClear={handleClearConsole}
            onToggle={() => setIsConsoleOpen((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
}

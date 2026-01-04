import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type CdnSource, getCdnUrls } from "../../lib/cdnSources";
import { generateSeed } from "../../lib/seededRng";
import { CodeEditor } from "./CodeEditor";
import { ConsoleOutput } from "./ConsoleOutput";
import {
  type ConsoleEntry,
  PreviewPane,
  type PreviewPaneHandle,
} from "./PreviewPane";
import { DEFAULT_PRESET, getPresetById } from "./presets";
import { RerollButton } from "./RerollButton";
import {
  applySeededUrls,
  canRandomize,
  generateReactiveUpdates,
} from "./urlReplacer";

type TabId = "code" | "console" | "preview";

interface TabButtonProps {
  active: boolean;
  badge?: number;
  children: React.ReactNode;
  onClick: () => void;
}

function TabButton({ active, badge, children, onClick }: TabButtonProps) {
  return (
    <button
      className={`
        flex-1 py-2 px-3 text-xs font-medium border-b-2 transition-colors
        ${
          active
            ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }
      `}
      onClick={onClick}
      type="button"
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {badge !== undefined && badge > 0 && (
          <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-semibold inline-flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
    </button>
  );
}

export interface MiniPlaygroundProps {
  /** Additional CSS classes */
  className?: string;
  /** Initial HTML code (overrides preset) */
  initialCode?: string;
  /** Initial preset ID */
  initialPreset?: string;
}

/**
 * Compact playground widget with mobile tab support.
 * Simplified version of the full Playground without URL state management.
 */
export function MiniPlayground({
  className = "",
  initialCode,
  initialPreset,
}: MiniPlaygroundProps) {
  // Determine initial code
  const [code, setCode] = useState(() => {
    if (initialCode) return initialCode;
    if (initialPreset) {
      const preset = getPresetById(initialPreset);
      return preset?.code ?? DEFAULT_PRESET.code;
    }
    return DEFAULT_PRESET.code;
  });

  // Template for reroll (preserves original code with URL placeholders)
  const [templateCode, setTemplateCode] = useState<string | undefined>(
    undefined,
  );

  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [stableCode, setStableCode] = useState(code);
  const [activeTab, setActiveTab] = useState<TabId>("preview");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const previewRef = useRef<PreviewPaneHandle>(null);

  // Use unpkg as default CDN (reliable, no CORS issues)
  const cdnSource: CdnSource = useMemo(() => ({ type: "unpkg" }), []);
  const cdnUrls = useMemo(() => getCdnUrls(cdnSource), [cdnSource]);

  // Debounce code changes for preview
  useEffect(() => {
    const timer = setTimeout(() => {
      setStableCode(code);
    }, 500);
    return () => clearTimeout(timer);
  }, [code]);

  // Handle code changes from editor
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    // User edited - clear template, their edit becomes the source of truth
    setTemplateCode(undefined);
  }, []);

  // Handle console messages from preview
  const handleConsoleMessage = useCallback((entry: ConsoleEntry) => {
    setConsoleLogs((prev) => [...prev, entry]);
  }, []);

  const handleClearConsole = useCallback(() => {
    setConsoleLogs([]);
  }, []);

  // Reroll handler - generates new seed and updates URLs
  const handleReroll = useCallback(() => {
    const newSeed = generateSeed();

    // Get template (existing template or current code)
    const template = templateCode ?? code;

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

    setCode(html);
    setTemplateCode(template); // Preserve template for future rerolls
  }, [code, templateCode]);

  // Check if current code can be randomized
  const canReroll = useMemo(() => canRandomize(code), [code]);

  return (
    <div
      className={`flex flex-col h-full min-h-[400px] overflow-hidden bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}
    >
      {/* Compact toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
          Mini Playground
        </span>
        <div className="flex-1" />
        {canReroll && <RerollButton onClick={handleReroll} variant="xs" />}
      </div>

      {/* Mobile tabs - visible only on small screens */}
      <div className="flex sm:hidden border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <TabButton
          active={activeTab === "code"}
          onClick={() => setActiveTab("code")}
        >
          Code
        </TabButton>
        <TabButton
          active={activeTab === "preview"}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </TabButton>
        <TabButton
          active={activeTab === "console"}
          badge={consoleLogs.length}
          onClick={() => setActiveTab("console")}
        >
          Console
        </TabButton>
      </div>

      {/* Main content - vertical layout (code top, preview bottom) */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Code editor pane (top) */}
        <div
          className={`
            ${activeTab === "code" ? "flex" : "hidden"}
            sm:flex flex-1 min-h-[150px]
            border-b border-slate-200 dark:border-slate-700
          `}
        >
          <CodeEditor
            className="h-full w-full"
            language="html"
            onChange={handleCodeChange}
            theme="dark"
            value={code}
          />
        </div>

        {/* Preview + Console pane (bottom) */}
        <div
          className={`
            ${activeTab !== "code" ? "flex" : "hidden"}
            sm:flex flex-1 flex-col min-h-[150px]
          `}
        >
          {/* Preview */}
          <div
            className={`
              ${activeTab === "preview" ? "flex" : "hidden"}
              sm:flex flex-1 min-h-[100px]
            `}
          >
            <PreviewPane
              className="h-full w-full"
              code={stableCode}
              onConsoleMessage={handleConsoleMessage}
              ref={previewRef}
              wcUrl={cdnUrls.wc}
            />
          </div>

          {/* Console - on mobile shows as tab, on desktop shows collapsed/expanded */}
          <div
            className={`
              ${activeTab === "console" ? "flex flex-1" : "hidden"}
              sm:flex sm:flex-none
            `}
          >
            <ConsoleOutput
              className={`w-full ${isConsoleOpen ? "h-[120px]" : ""} ${activeTab === "console" ? "h-full" : ""}`}
              isOpen={activeTab === "console" || isConsoleOpen}
              logs={consoleLogs}
              onClear={handleClearConsole}
              onToggle={() => setIsConsoleOpen((prev) => !prev)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

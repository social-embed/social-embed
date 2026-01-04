import { useCallback, useEffect, useState } from "react";
import {
  CDN_SOURCE_DESCRIPTIONS,
  CDN_SOURCE_LABELS,
  type CdnSource,
  type CdnSourceType,
  getCdnUrls,
} from "../../lib/cdnSources";

export interface CdnSourcePickerProps {
  value: CdnSource;
  onChange: (source: CdnSource) => void;
  className?: string;
}

const SOURCE_TYPES: CdnSourceType[] = [
  "local",
  "cdn-dev",
  "esm-sh-gh",
  "esm-sh",
  "unpkg",
  "jsdelivr",
  "custom",
];

function CopyIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <svg
        aria-hidden="true"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <rect height="13" rx="2" width="13" x="9" y="9" />
      <path
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * CDN source selector for switching between local and CDN builds.
 */
export function CdnSourcePicker({
  value,
  onChange,
  className = "",
}: CdnSourcePickerProps) {
  const [customUrl, setCustomUrl] = useState(
    value.type === "custom" ? value.url : "",
  );

  // Sync customUrl when value changes from parent (e.g., URL state restoration)
  const valueUrl = value.type === "custom" ? value.url : "";
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally sync only on parent value changes
  useEffect(() => {
    if (value.type === "custom" && valueUrl !== customUrl) {
      setCustomUrl(valueUrl);
    }
  }, [value.type, valueUrl]);

  const handleSourceChange = (type: CdnSourceType) => {
    if (type === "custom") {
      onChange({ type: "custom", url: customUrl || "" });
    } else {
      onChange({ type });
    }
  };

  const handleCustomUrlChange = (url: string) => {
    setCustomUrl(url);
    if (value.type === "custom") {
      onChange({ type: "custom", url });
    }
  };

  const urls = getCdnUrls(value);

  const [copied, setCopied] = useState(false);

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(urls.wc);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy CDN URL:", err);
    }
  }, [urls.wc]);

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {/* Source type buttons */}
      {SOURCE_TYPES.map((type) => (
        <button
          className={`h-[26px] px-2 py-1 text-xs rounded border transition-colors cursor-pointer select-none ${
            value.type === type
              ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
          }`}
          key={type}
          onClick={() => handleSourceChange(type)}
          title={CDN_SOURCE_DESCRIPTIONS[type]}
          type="button"
        >
          {CDN_SOURCE_LABELS[type]}
        </button>
      ))}

      {/* Custom URL input */}
      {value.type === "custom" && (
        <input
          className="flex-1 min-w-[200px] px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400"
          onChange={(e) => handleCustomUrlChange(e.target.value)}
          placeholder="Enter lib URL (comma-separate for lib,wc)"
          type="text"
          value={customUrl}
        />
      )}

      {/* Resolved URL display */}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1 ml-2">
        <code className="truncate rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-700 dark:text-slate-400 font-mono">
          {urls.wc}
        </code>
        <button
          className={`h-[22px] w-[22px] shrink-0 inline-flex items-center justify-center rounded border-0 bg-transparent cursor-pointer transition-colors ${
            copied
              ? "text-green-600 dark:text-green-400"
              : "text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          }`}
          onClick={handleCopyUrl}
          title="Copy CDN URL"
          type="button"
        >
          <CopyIcon copied={copied} />
        </button>
      </div>
    </div>
  );
}

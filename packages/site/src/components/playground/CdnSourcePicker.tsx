import { useState } from "react";
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
  "jsdelivr",
  "unpkg",
  "esm-sh",
  "custom",
];

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

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {/* Source type buttons */}
      {SOURCE_TYPES.map((type) => (
        <button
          className={`h-[26px] px-2 py-1 text-xs rounded border transition-colors cursor-pointer select-none ${
            value.type === type
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-400"
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
          className="flex-1 min-w-[200px] px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 focus:outline-none focus:border-blue-400"
          onChange={(e) => handleCustomUrlChange(e.target.value)}
          placeholder="Enter lib URL (comma-separate for lib,wc)"
          type="text"
          value={customUrl}
        />
      )}

      {/* Resolved URL display */}
      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate ml-2">
        {urls.wc}
      </span>
    </div>
  );
}

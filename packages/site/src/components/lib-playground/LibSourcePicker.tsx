import { LIB_SOURCE_ORDER, LIB_SOURCES, type LibSourceType } from "./constants";

export interface LibSourcePickerProps {
  /** Currently selected library source */
  value: LibSourceType;
  /** Called when selection changes */
  onChange: (source: LibSourceType) => void;
  /** Additional CSS classes */
  className?: string;
  /** Disable the picker */
  disabled?: boolean;
}

/**
 * Library source selector for switching between local and CDN builds.
 * Allows testing against local development code or published npm/GitHub versions.
 */
export function LibSourcePicker({
  value,
  onChange,
  className = "",
  disabled = false,
}: LibSourcePickerProps) {
  return (
    <fieldset
      aria-label="Select library source"
      className={`flex flex-wrap items-center gap-1 border-0 p-0 m-0 ${className}`}
    >
      {LIB_SOURCE_ORDER.map((type) => {
        const source = LIB_SOURCES[type];
        const isSelected = value === type;

        return (
          <button
            aria-pressed={isSelected}
            className={`h-[26px] px-2 py-1 text-xs rounded border transition-colors cursor-pointer select-none ${
              isSelected
                ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={disabled}
            key={type}
            onClick={() => onChange(type)}
            title={source.description}
            type="button"
          >
            {source.label}
          </button>
        );
      })}

      {/* Show resolved URL for CDN sources */}
      {value !== "local" && LIB_SOURCES[value].urlPattern && (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate ml-2 max-w-[200px]">
          {LIB_SOURCES[value].urlPattern}
        </span>
      )}
    </fieldset>
  );
}

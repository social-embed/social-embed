import {
  getProviderDisplayInfo,
  getProviderFilterOptions,
  type ProviderFilter,
} from "./constants";

export interface ProviderSelectorProps {
  /** Currently selected provider filter */
  value: ProviderFilter;
  /** Called when selection changes */
  onChange: (provider: ProviderFilter) => void;
  /** Additional CSS classes */
  className?: string;
  /** Disable the selector */
  disabled?: boolean;
}

/**
 * Dropdown selector for filtering by provider type.
 * Allows selecting 'all' or a specific provider.
 */
export function ProviderSelector({
  value,
  onChange,
  className = "",
  disabled = false,
}: ProviderSelectorProps) {
  const options = getProviderFilterOptions();
  const currentInfo = getProviderDisplayInfo(value);

  return (
    <div className={`relative inline-block ${className}`}>
      <select
        aria-label="Select provider filter"
        className={`
          appearance-none
          h-[26px] pl-2 pr-7 py-1 text-xs rounded border
          transition-colors cursor-pointer select-none
          bg-white dark:bg-slate-800
          text-slate-700 dark:text-slate-300
          border-slate-300 dark:border-slate-600
          hover:border-slate-400 dark:hover:border-slate-500
          focus:outline-none focus:ring-1 focus:ring-slate-500
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as ProviderFilter)}
        title={`Filter: ${currentInfo.name}`}
        value={value}
      >
        {options.map((provider) => {
          const info = getProviderDisplayInfo(provider);
          return (
            <option key={provider} value={provider}>
              {info.icon} {info.name}
            </option>
          );
        })}
      </select>
      {/* Dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
        <svg
          aria-hidden="true"
          className="h-3 w-3 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>
    </div>
  );
}

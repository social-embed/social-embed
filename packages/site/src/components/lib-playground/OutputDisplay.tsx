import { getProviderDisplayInfo, type ProviderType } from "./constants";

export interface LibOutput {
  /** Original input URL */
  input: string;
  /** Detected provider type */
  provider: ProviderType | null;
  /** Extracted ID(s) */
  providerId: string | string[] | null;
  /** Generated embed URL */
  embedUrl: string | null;
  /** Whether URL is valid */
  isValid: boolean;
  /** Error message if parsing failed */
  error?: string;
  /** YouTube-specific: is this a Shorts URL? */
  isShorts?: boolean;
}

export interface OutputDisplayProps {
  /** The transformation output to display */
  output: LibOutput | null;
  /** Additional CSS classes */
  className?: string;
  /** Compact mode for mini display */
  compact?: boolean;
}

interface OutputRowProps {
  label: string;
  value: string | null | undefined;
  isCode?: boolean;
  isCopyable?: boolean;
  colorClass?: string;
}

function OutputRow({
  label,
  value,
  isCode = false,
  colorClass,
}: OutputRowProps) {
  if (value === null || value === undefined) {
    return null;
  }

  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 min-w-[80px] shrink-0">
        {label}:
      </span>
      <span
        className={`text-sm break-all ${
          isCode
            ? "font-mono text-slate-700 dark:text-slate-300"
            : colorClass || "text-slate-900 dark:text-slate-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Display component for library transformation output.
 * Shows provider, ID, embed URL, and metadata.
 */
export function OutputDisplay({
  output,
  className = "",
  compact = false,
}: OutputDisplayProps) {
  if (!output) {
    return (
      <div
        className={`p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 ${className}`}
      >
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center">
          Enter a URL above to see the transformation output
        </p>
      </div>
    );
  }

  if (!output.isValid || output.error) {
    return (
      <div
        className={`p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 ${className}`}
        role="alert"
      >
        <div className="flex items-start gap-2">
          <span aria-label="Error" className="text-red-500" role="img">
            ⚠️
          </span>
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Could not parse URL
            </p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
              {output.error || "No matching provider found for this URL"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const providerInfo = output.provider
    ? getProviderDisplayInfo(output.provider)
    : null;

  // Format providerId for display
  const formattedId = Array.isArray(output.providerId)
    ? output.providerId.join(", ")
    : output.providerId;

  return (
    <div
      className={`p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 ${className}`}
      data-testid="output-display"
    >
      <div className={`flex flex-col ${compact ? "gap-2" : "gap-3"}`}>
        {/* Provider */}
        {providerInfo && (
          <div className="flex items-center gap-2">
            <span aria-label={providerInfo.name} className="text-lg" role="img">
              {providerInfo.icon}
            </span>
            <span
              className={`text-sm font-semibold ${providerInfo.colorClass}`}
            >
              {providerInfo.name}
            </span>
            {output.isShorts && (
              <span className="px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded">
                Shorts
              </span>
            )}
          </div>
        )}

        {/* ID */}
        <OutputRow isCode label="ID" value={formattedId} />

        {/* Embed URL */}
        <OutputRow isCode label="Embed URL" value={output.embedUrl} />

        {/* Original URL (only in non-compact mode) */}
        {!compact && <OutputRow isCode label="Input" value={output.input} />}
      </div>
    </div>
  );
}

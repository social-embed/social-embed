import type { ConsoleEntry } from "./PreviewPane";

export interface ConsoleOutputProps {
  logs: ConsoleEntry[];
  onClear?: () => void;
  className?: string;
}

const LOG_TYPE_STYLES: Record<ConsoleEntry["type"], string> = {
  error: "text-red-600 dark:text-red-400",
  info: "text-blue-600 dark:text-blue-400",
  log: "text-slate-700 dark:text-slate-300",
  warn: "text-amber-600 dark:text-amber-400",
};

const LOG_TYPE_ICONS: Record<ConsoleEntry["type"], string> = {
  error: "✕",
  info: "ℹ",
  log: "›",
  warn: "⚠",
};

/**
 * Console output display for captured iframe logs.
 */
export function ConsoleOutput({
  logs,
  onClear,
  className = "",
}: ConsoleOutputProps) {
  return (
    <div
      className={`flex flex-col bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Console
          {logs.length > 0 && (
            <span className="ml-2 rounded-full bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px]">
              {logs.length}
            </span>
          )}
        </span>
        {onClear && logs.length > 0 && (
          <button
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            onClick={onClear}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-auto p-2 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-slate-400 dark:text-slate-500 italic">
            Console output will appear here...
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((entry, index) => (
              <div
                className={`flex items-start gap-2 ${LOG_TYPE_STYLES[entry.type]}`}
                key={`${entry.timestamp}-${index}`}
              >
                <span className="opacity-60 select-none">
                  {LOG_TYPE_ICONS[entry.type]}
                </span>
                <span className="whitespace-pre-wrap break-all">
                  {entry.args.join(" ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { type ClipboardEvent, type KeyboardEvent, useRef } from "react";

export interface UrlInputProps {
  /** Current URL value */
  value: string;
  /** Called when URL changes */
  onChange: (url: string) => void;
  /** Called when Enter is pressed or paste occurs */
  onSubmit?: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Disable the input */
  disabled?: boolean;
}

/**
 * URL input field with paste detection and keyboard shortcuts.
 * Automatically triggers onSubmit when pasting a URL or pressing Enter.
 */
export function UrlInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Paste a video URL (YouTube, Vimeo, Spotify, etc.)",
  className = "",
  disabled = false,
}: UrlInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    // Get pasted text and update value
    const pastedText = e.clipboardData.getData("text");
    if (pastedText) {
      // Let the paste happen naturally, then trigger submit
      setTimeout(() => {
        onSubmit?.();
      }, 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        aria-label="URL input"
        className={`
          w-full px-3 py-2 text-sm rounded-lg border
          transition-colors
          bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          border-slate-300 dark:border-slate-600
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          hover:border-slate-400 dark:hover:border-slate-500
          focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${value ? "pr-8" : ""}
        `}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={placeholder}
        ref={inputRef}
        type="url"
        value={value}
      />

      {/* Clear button */}
      {value && !disabled && (
        <button
          aria-label="Clear URL"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 inline-flex items-center justify-center rounded transition-colors cursor-pointer text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          onClick={handleClear}
          tabIndex={-1}
          title="Clear"
          type="button"
        >
          <svg
            aria-hidden="true"
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      )}
    </div>
  );
}

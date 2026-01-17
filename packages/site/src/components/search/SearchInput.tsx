/**
 * Search input component with icon, loading state, and clear button.
 * Designed for accessibility with proper ARIA attributes.
 */

import type { SearchInputProps } from "./searchTypes";

/**
 * Search input field with decorative icon and functional controls.
 */
export function SearchInput({
  value,
  onChange,
  onKeyDown,
  isLoading,
  inputRef,
  activeDescendantId,
  controlsId,
}: SearchInputProps) {
  return (
    <div className="relative">
      {/* Search icon (left) */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-[var(--nav-text-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* Input field */}
      <input
        aria-activedescendant={activeDescendantId}
        aria-autocomplete="list"
        aria-controls={controlsId}
        aria-expanded={!!controlsId}
        aria-label="Search documentation"
        autoComplete="off"
        className="
          w-full h-12 pl-10 pr-10 text-base
          bg-transparent border-0
          text-[var(--nav-text)]
          placeholder:text-[var(--nav-text-muted)]
          focus:outline-none
        "
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search documentation..."
        ref={inputRef}
        role="combobox"
        spellCheck={false}
        type="text"
        value={value}
      />

      {/* Right side: loading spinner or clear button */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <LoadingSpinner />
        ) : value ? (
          <button
            aria-label="Clear search"
            className="
              flex items-center justify-center w-6 h-6
              bg-transparent border-0 cursor-pointer rounded
              text-[var(--nav-text-muted)] hover:text-[var(--nav-text)]
              transition-colors
            "
            onClick={() => onChange("")}
            tabIndex={-1}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
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
        ) : null}
      </div>
    </div>
  );
}

/**
 * Small loading spinner for inline use.
 */
function LoadingSpinner() {
  return (
    <div className="w-5 h-5 relative">
      <div className="absolute inset-0 border-2 border-[var(--nav-border)] rounded-full" />
      <div className="absolute inset-0 border-2 border-transparent border-t-[var(--color-mv-blue)] rounded-full animate-spin" />
    </div>
  );
}

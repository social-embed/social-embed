/**
 * Empty state component for search results.
 * Shows loading, no results, or error states.
 */

import type { SearchEmptyStateProps } from "./searchTypes";

/**
 * Displays appropriate messaging based on search status.
 */
export function SearchEmptyState({
  query,
  status,
  error,
  useMockData,
}: SearchEmptyStateProps) {
  // Loading state
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-[var(--nav-text-muted)]">
          Searching...
        </p>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-mv-red-light)] dark:bg-[var(--color-mv-red-dark)] flex items-center justify-center mb-4">
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-[var(--color-mv-red)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-[var(--nav-text)]">
          Search error
        </p>
        <p className="mt-1 text-xs text-[var(--nav-text-muted)] max-w-xs">
          {error || "An unexpected error occurred. Please try again."}
        </p>
      </div>
    );
  }

  // No results state (only show if query is not empty and status is success)
  if (status === "success" && query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--search-kbd-bg)] flex items-center justify-center mb-4">
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-[var(--nav-text-muted)]"
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
        <p className="text-sm font-medium text-[var(--nav-text)]">
          No results found
        </p>
        <p className="mt-1 text-xs text-[var(--nav-text-muted)]">
          No results for "<span className="font-medium">{query}</span>"
        </p>
        <p className="mt-3 text-xs text-[var(--nav-text-muted)]">
          Try different keywords or check your spelling
        </p>
      </div>
    );
  }

  // Idle state - show search hint
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--search-kbd-bg)] flex items-center justify-center mb-4">
        <svg
          aria-hidden="true"
          className="w-6 h-6 text-[var(--nav-text-muted)]"
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
      <p className="text-sm text-[var(--nav-text-muted)]">
        Type to search documentation
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-[var(--search-breadcrumb)]">
        <span className="flex items-center gap-1">
          <kbd className="search-kbd-small">↑</kbd>
          <kbd className="search-kbd-small">↓</kbd>
          <span>to navigate</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="search-kbd-small">↵</kbd>
          <span>to select</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="search-kbd-small">esc</kbd>
          <span>to close</span>
        </span>
      </div>
      {useMockData && <MockDataIndicator />}
    </div>
  );
}

/**
 * Animated loading spinner.
 */
function LoadingSpinner() {
  return (
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 border-2 border-[var(--nav-border)] rounded-full" />
      <div className="absolute inset-0 border-2 border-transparent border-t-[var(--color-mv-blue)] rounded-full animate-spin" />
    </div>
  );
}

/**
 * Visual indicator when mock data is being used.
 */
function MockDataIndicator() {
  return (
    <div className="mt-6 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700">
      <span className="text-xs font-medium text-amber-800 dark:text-amber-200">
        Using mock data
      </span>
    </div>
  );
}

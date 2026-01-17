/**
 * Search modal with full keyboard navigation and accessibility support.
 * Wraps SearchInput and SearchResults with focus management.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchInput } from "./SearchInput";
import { thinSubResults } from "./SearchResultItem";
import { getResultItemId, SearchResults } from "./SearchResults";
import type { SearchModalProps, SearchResult } from "./searchTypes";
import { usePagefindSearch } from "./usePagefindSearch";

const RESULT_ID_PREFIX = "search-result";

/** Maximum sub-results shown in inline mode */
const INLINE_SUBRESULTS_LIMIT = 3;

/**
 * Get the number of navigable sub-results for a result based on display mode.
 * - 'inline': Limited to INLINE_SUBRESULTS_LIMIT
 * - 'toggle': All sub-results (but only when toggled - handled separately)
 * - 'breadcrumbs': No sub-results navigable
 */
function getNavigableSubResultCount(
  result: SearchResult,
  subResultsDisplay: "inline" | "toggle" | "breadcrumbs",
): number {
  if (subResultsDisplay === "breadcrumbs") {
    return 0;
  }
  if (subResultsDisplay === "inline") {
    return Math.min(result.sub_results.length, INLINE_SUBRESULTS_LIMIT);
  }
  // For toggle mode, sub-results are only navigable when expanded
  // For simplicity in keyboard nav, we treat toggle same as inline for now
  return Math.min(result.sub_results.length, INLINE_SUBRESULTS_LIMIT);
}

/**
 * Main search modal component.
 * Can be controlled externally via isOpen/onClose or used standalone.
 */
export function SearchModal({
  useMockData = false,
  initialQuery = "",
  onClose,
  isOpen: externalIsOpen,
  subResultsDisplay = "breadcrumbs",
  navigateSections = false,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen ?? internalIsOpen;

  const { state, setQuery, clear } = usePagefindSearch({
    debounceMs: 150,
    maxResults: 10,
    showSubResults: true,
    useMockData,
  });

  const { query, results, status, error, selectedIndex } = state;
  const [localSelectedIndex, setLocalSelectedIndex] = useState(-1);
  const [localSelectedSubIndex, setLocalSelectedSubIndex] = useState(-1);

  // Sync local selection with global state
  useEffect(() => {
    setLocalSelectedIndex(selectedIndex);
    setLocalSelectedSubIndex(-1); // Reset sub-selection when results change
  }, [selectedIndex]);

  // Reset sub-selection when main selection changes
  useEffect(() => {
    setLocalSelectedSubIndex(-1);
  }, []);

  // Set initial query if provided (on mount or when modal opens)
  useEffect(() => {
    if (initialQuery) {
      // For embedded mode (no isOpen control), set immediately
      // For dialog mode, set when modal opens
      const shouldSetQuery = externalIsOpen === undefined || isOpen;
      if (shouldSetQuery) {
        setQuery(initialQuery);
      }
    }
  }, [initialQuery, isOpen, externalIsOpen, setQuery]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure modal is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle close
  const handleClose = useCallback(() => {
    clear();
    setLocalSelectedIndex(-1);
    setLocalSelectedSubIndex(-1);
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  }, [clear, onClose]);

  // Navigate to a result URL
  const handleNavigate = useCallback(
    (url: string) => {
      window.location.href = url;
      handleClose();
    },
    [handleClose],
  );

  // Handle sub-result selection change from mouse
  const handleSubSelect = useCallback(
    (resultIndex: number, subIndex: number) => {
      setLocalSelectedIndex(resultIndex);
      setLocalSelectedSubIndex(subIndex);
    },
    [],
  );

  // Keyboard navigation with optional section navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const resultCount = results.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (navigateSections && subResultsDisplay === "inline") {
            // Section navigation mode
            const currentResult = results[localSelectedIndex];
            if (currentResult) {
              const subCount = getNavigableSubResultCount(
                currentResult,
                subResultsDisplay,
              );

              if (localSelectedSubIndex === -1 && subCount > 0) {
                // Move from main result to first sub-result
                setLocalSelectedSubIndex(0);
              } else if (localSelectedSubIndex < subCount - 1) {
                // Move to next sub-result
                setLocalSelectedSubIndex((prev) => prev + 1);
              } else if (localSelectedIndex < resultCount - 1) {
                // Move to next main result
                setLocalSelectedIndex((prev) => prev + 1);
                setLocalSelectedSubIndex(-1);
              }
            } else if (localSelectedIndex < resultCount - 1) {
              setLocalSelectedIndex((prev) => prev + 1);
            }
          } else {
            // Standard navigation (results only)
            setLocalSelectedIndex((prev) =>
              prev < resultCount - 1 ? prev + 1 : prev,
            );
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (navigateSections && subResultsDisplay === "inline") {
            // Section navigation mode
            if (localSelectedSubIndex > 0) {
              // Move to previous sub-result
              setLocalSelectedSubIndex((prev) => prev - 1);
            } else if (localSelectedSubIndex === 0) {
              // Move from first sub-result to main result
              setLocalSelectedSubIndex(-1);
            } else if (localSelectedIndex > 0) {
              // Move to previous result (and its last sub-result)
              const prevResult = results[localSelectedIndex - 1];
              const prevSubCount = prevResult
                ? getNavigableSubResultCount(prevResult, subResultsDisplay)
                : 0;
              setLocalSelectedIndex((prev) => prev - 1);
              setLocalSelectedSubIndex(
                prevSubCount > 0 ? prevSubCount - 1 : -1,
              );
            }
          } else {
            // Standard navigation (results only)
            setLocalSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;

        case "Enter":
          e.preventDefault();
          if (localSelectedIndex >= 0 && results[localSelectedIndex]) {
            const result = results[localSelectedIndex];
            if (localSelectedSubIndex >= 0) {
              // Navigate to sub-result
              const subResults =
                subResultsDisplay === "inline"
                  ? thinSubResults(result.sub_results, INLINE_SUBRESULTS_LIMIT)
                  : result.sub_results;
              const subResult = subResults[localSelectedSubIndex];
              if (subResult) {
                handleNavigate(subResult.url);
              }
            } else {
              // Navigate to main result
              handleNavigate(result.url);
            }
          }
          break;

        case "Escape":
          e.preventDefault();
          handleClose();
          break;

        case "Home":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setLocalSelectedIndex(0);
            setLocalSelectedSubIndex(-1);
          }
          break;

        case "End":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setLocalSelectedIndex(resultCount - 1);
            setLocalSelectedSubIndex(-1);
          }
          break;
      }
    },
    [
      results,
      localSelectedIndex,
      localSelectedSubIndex,
      navigateSections,
      subResultsDisplay,
      handleNavigate,
      handleClose,
    ],
  );

  // Get active descendant ID for accessibility
  const activeDescendantId =
    localSelectedIndex >= 0
      ? getResultItemId(RESULT_ID_PREFIX, localSelectedIndex)
      : undefined;

  const hasResults = results.length > 0;
  const showEmptyState =
    !hasResults && (status !== "idle" || query.trim() === "");

  return (
    <div className="search-modal-content flex flex-col max-h-full">
      {/* Search input with border */}
      <div className="search-input-container border-b border-[var(--nav-border)]">
        <SearchInput
          activeDescendantId={activeDescendantId}
          controlsId={hasResults ? `${RESULT_ID_PREFIX}-list` : undefined}
          inputRef={inputRef}
          isLoading={status === "loading"}
          onChange={setQuery}
          onKeyDown={handleKeyDown}
          value={query}
        />
      </div>

      {/* Results or empty state */}
      <div className="flex-1 overflow-hidden">
        {hasResults ? (
          <SearchResults
            idPrefix={RESULT_ID_PREFIX}
            navigateSections={navigateSections}
            onNavigate={handleNavigate}
            onSelect={setLocalSelectedIndex}
            onSubSelect={handleSubSelect}
            results={results}
            selectedIndex={localSelectedIndex}
            selectedSubIndex={localSelectedSubIndex}
            subResultsDisplay={subResultsDisplay}
          />
        ) : (
          showEmptyState && (
            <SearchEmptyState
              error={error}
              query={query}
              status={status}
              useMockData={useMockData}
            />
          )
        )}
      </div>

      {/* Footer with keyboard hints */}
      {hasResults && (
        <div className="search-footer border-t border-[var(--nav-border)] px-3 py-2 flex items-center justify-between text-xs text-[var(--search-breadcrumb)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="search-kbd-small">↑</kbd>
              <kbd className="search-kbd-small">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="search-kbd-small">↵</kbd>
              <span>select</span>
            </span>
          </div>
          <span>
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Standalone search modal wrapper with dialog management.
 * Use this when you need a complete modal experience.
 */
export function SearchModalDialog({
  useMockData = false,
  initialQuery = "",
  onClose,
  isOpen,
}: SearchModalProps & { isOpen: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync dialog open state with isOpen prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle dialog close event
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose?.();
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose?.();
      }
    },
    [onClose],
  );

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Native <dialog> element handles keyboard events (Escape to close) automatically
    <dialog
      className="search-dialog"
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <div className="dialog-frame">
        <SearchModal
          initialQuery={initialQuery}
          isOpen={isOpen}
          onClose={onClose}
          useMockData={useMockData}
        />
      </div>
    </dialog>
  );
}

/**
 * Search modal with full keyboard navigation and accessibility support.
 * Wraps SearchInput and SearchResults with focus management.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchInput } from "./SearchInput";
import { getResultItemId, SearchResults } from "./SearchResults";
import type { SearchModalProps } from "./searchTypes";
import { usePagefindSearch } from "./usePagefindSearch";

const RESULT_ID_PREFIX = "search-result";

/**
 * Main search modal component.
 * Can be controlled externally via isOpen/onClose or used standalone.
 */
export function SearchModal({
  useMockData = false,
  initialQuery = "",
  onClose,
  isOpen: externalIsOpen,
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

  // Sync local selection with global state
  useEffect(() => {
    setLocalSelectedIndex(selectedIndex);
  }, [selectedIndex]);

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

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const resultCount = results.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setLocalSelectedIndex((prev) =>
            prev < resultCount - 1 ? prev + 1 : prev,
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setLocalSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;

        case "Enter":
          e.preventDefault();
          if (localSelectedIndex >= 0 && results[localSelectedIndex]) {
            handleNavigate(results[localSelectedIndex].url);
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
          }
          break;

        case "End":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setLocalSelectedIndex(resultCount - 1);
          }
          break;
      }
    },
    [results, localSelectedIndex, handleNavigate, handleClose],
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
            onNavigate={handleNavigate}
            onSelect={setLocalSelectedIndex}
            results={results}
            selectedIndex={localSelectedIndex}
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

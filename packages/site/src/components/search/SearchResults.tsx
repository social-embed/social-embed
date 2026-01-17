/**
 * Search results list with keyboard navigation support.
 * Implements listbox pattern for accessibility.
 */

import { useCallback, useEffect, useRef } from "react";
import { SearchResultItem } from "./SearchResultItem";
import type { SearchResultsProps } from "./searchTypes";

/**
 * Results list container with virtualized-like scroll behavior.
 */
export function SearchResults({
  results,
  selectedIndex,
  onSelect,
  onNavigate,
  idPrefix = "search-result",
}: SearchResultsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < results.length) {
      const itemEl = itemRefs.current.get(selectedIndex);
      if (itemEl && listRef.current) {
        const listRect = listRef.current.getBoundingClientRect();
        const itemRect = itemEl.getBoundingClientRect();

        // Check if item is outside visible area
        if (itemRect.top < listRect.top) {
          itemEl.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (itemRect.bottom > listRect.bottom) {
          itemEl.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }
    }
  }, [selectedIndex, results.length]);

  const handleItemClick = useCallback(
    (index: number) => {
      const result = results[index];
      if (result) {
        onNavigate(result.url);
      }
    },
    [results, onNavigate],
  );

  const setItemRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      if (el) {
        itemRefs.current.set(index, el);
      } else {
        itemRefs.current.delete(index);
      }
    },
    [],
  );

  if (results.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Search results"
      className="search-results overflow-y-auto max-h-[60vh] py-2"
      id={`${idPrefix}-list`}
      ref={listRef}
      role="listbox"
    >
      <div className="space-y-1 px-2">
        {results.map((result, index) => (
          <div key={result.id} ref={setItemRef(index)}>
            <SearchResultItem
              id={`${idPrefix}-${index}`}
              isSelected={index === selectedIndex}
              onClick={() => handleItemClick(index)}
              onMouseEnter={() => onSelect(index)}
              result={result}
            />
          </div>
        ))}
      </div>

      {/* Results count - polite announcement for screen readers */}
      <div aria-live="polite" className="sr-only">
        {results.length} result{results.length !== 1 ? "s" : ""} found
      </div>
    </div>
  );
}

/**
 * Get the ID of a result item for aria-activedescendant.
 */
export function getResultItemId(idPrefix: string, index: number): string {
  return `${idPrefix}-${index}`;
}

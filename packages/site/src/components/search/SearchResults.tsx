/**
 * Search results list with keyboard navigation support.
 * Implements listbox pattern for accessibility.
 */

import { useCallback, useEffect, useRef } from "react";
import { SearchResultItem, thinSubResults } from "./SearchResultItem";
import type { SearchResultsProps } from "./searchTypes";

/** Maximum sub-results shown in inline mode (must match SearchResultItem) */
const INLINE_SUBRESULTS_LIMIT = 3;

/**
 * Results list container with virtualized-like scroll behavior.
 */
export function SearchResults({
  results,
  selectedIndex,
  onSelect,
  onNavigate,
  idPrefix = "search-result",
  subResultsDisplay = "toggle",
  navigateSections = false,
  selectedSubIndex = -1,
  onSubSelect,
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

  const handleSubResultClick = useCallback(
    (resultIndex: number, subIndex: number) => {
      const result = results[resultIndex];
      if (result) {
        // For inline mode, get the limited sub-results
        const subResults =
          subResultsDisplay === "inline"
            ? thinSubResults(result.sub_results, INLINE_SUBRESULTS_LIMIT)
            : result.sub_results;
        const subResult = subResults[subIndex];
        if (subResult) {
          onNavigate(subResult.url);
        }
      }
    },
    [results, onNavigate, subResultsDisplay],
  );

  const handleSubResultMouseEnter = useCallback(
    (resultIndex: number, subIndex: number) => {
      if (navigateSections && onSubSelect) {
        onSubSelect(resultIndex, subIndex);
      }
    },
    [navigateSections, onSubSelect],
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
              onSubResultClick={(subIndex) =>
                handleSubResultClick(index, subIndex)
              }
              onSubResultMouseEnter={(subIndex) =>
                handleSubResultMouseEnter(index, subIndex)
              }
              result={result}
              selectedSubIndex={index === selectedIndex ? selectedSubIndex : -1}
              subResultsDisplay={subResultsDisplay}
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

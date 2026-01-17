/**
 * React hook for Pagefind search with mock data support.
 * Wraps Pagefind's JavaScript API with debouncing and state management.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { filterMockResults, simulateSearchDelay } from "./mockSearchData";
import type {
  SearchResult,
  SearchState,
  UsePagefindSearchOptions,
  UsePagefindSearchReturn,
} from "./searchTypes";

// Pagefind types (not available at build time)
interface PagefindResult {
  id: string;
  data: () => Promise<PagefindResultData>;
}

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: {
    title?: string;
    image?: string;
  };
  sub_results?: Array<{
    title: string;
    url: string;
    excerpt: string;
    anchor?: string;
  }>;
  word_count?: number;
}

interface PagefindSearchResponse {
  results: PagefindResult[];
  totalResultCount?: number;
}

interface Pagefind {
  init: () => Promise<void>;
  search: (query: string) => Promise<PagefindSearchResponse>;
}

/** Initial search state */
const initialState: SearchState = {
  error: null,
  query: "",
  results: [],
  selectedIndex: -1,
  status: "idle",
  totalCount: 0,
};

/**
 * Hook for performing searches using Pagefind or mock data.
 *
 * @param options - Configuration options
 * @returns Search state and control functions
 */
export function usePagefindSearch(
  options: UsePagefindSearchOptions = {},
): UsePagefindSearchReturn {
  const {
    useMockData = false,
    debounceMs = 150,
    maxResults = 10,
    showSubResults = true,
  } = options;

  const [state, setState] = useState<SearchState>(initialState);
  const pagefindRef = useRef<Pagefind | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load Pagefind lazily
  const loadPagefind = useCallback(async (): Promise<Pagefind | null> => {
    if (useMockData) return null;
    if (pagefindRef.current) return pagefindRef.current;

    try {
      // Dynamic import from the built pagefind bundle
      const pagefind = await import(
        /* @vite-ignore */
        `${import.meta.env.BASE_URL.replace(/\/$/, "")}/pagefind/pagefind.js`
      );
      await pagefind.init();
      pagefindRef.current = pagefind as Pagefind;
      return pagefindRef.current;
    } catch (error) {
      console.error("Failed to load Pagefind:", error);
      return null;
    }
  }, [useMockData]);

  // Perform search with mock data
  const searchMock = useCallback(
    async (query: string): Promise<SearchResult[]> => {
      await simulateSearchDelay();
      const results = filterMockResults(query);
      return results.slice(0, maxResults);
    },
    [maxResults],
  );

  // Perform search with real Pagefind
  const searchPagefind = useCallback(
    async (
      query: string,
    ): Promise<{ results: SearchResult[]; total: number }> => {
      const pagefind = await loadPagefind();
      if (!pagefind) {
        throw new Error("Pagefind not available");
      }

      const response = await pagefind.search(query);
      const resultPromises = response.results
        .slice(0, maxResults)
        .map(async (result): Promise<SearchResult> => {
          const data = await result.data();
          return {
            excerpt: data.excerpt,
            id: result.id,
            meta: {
              image: data.meta.image,
              title: data.meta.title ?? data.url,
            },
            sub_results: showSubResults
              ? (data.sub_results ?? []).map((sub, index) => ({
                  anchor: sub.anchor ?? "",
                  excerpt: sub.excerpt,
                  id: `${result.id}-sub-${index}`,
                  title: sub.title,
                  url: sub.url,
                }))
              : [],
            url: data.url,
            word_count: data.word_count,
          };
        });

      const results = await Promise.all(resultPromises);
      return { results, total: response.totalResultCount ?? results.length };
    },
    [loadPagefind, maxResults, showSubResults],
  );

  // Main search function with debouncing
  const performSearch = useCallback(
    async (query: string) => {
      // Cancel any pending search
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      if (!query.trim()) {
        setState((prev) => ({
          ...prev,
          error: null,
          query,
          results: [],
          selectedIndex: -1,
          status: "idle",
          totalCount: 0,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        error: null,
        query,
        selectedIndex: -1,
        status: "loading",
      }));

      try {
        if (useMockData) {
          const results = await searchMock(query);
          // Check if search was aborted
          if (abortControllerRef.current?.signal.aborted) return;
          setState((prev) => ({
            ...prev,
            results,
            status: "success",
            totalCount: results.length,
          }));
        } else {
          const { results, total } = await searchPagefind(query);
          // Check if search was aborted
          if (abortControllerRef.current?.signal.aborted) return;
          setState((prev) => ({
            ...prev,
            results,
            status: "success",
            totalCount: total,
          }));
        }
      } catch (error) {
        // Check if search was aborted
        if (abortControllerRef.current?.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Search failed",
          results: [],
          status: "error",
          totalCount: 0,
        }));
      }
    },
    [useMockData, searchMock, searchPagefind],
  );

  // Debounced search trigger
  const setQuery = useCallback(
    (query: string) => {
      // Update query immediately for responsive input
      setState((prev) => ({ ...prev, query }));

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the actual search
      debounceTimerRef.current = setTimeout(() => {
        performSearch(query);
      }, debounceMs);
    },
    [performSearch, debounceMs],
  );

  // Clear search state
  const clear = useCallback(() => {
    // Cancel any pending operations
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    abortControllerRef.current?.abort();

    setState(initialState);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    clear,
    setQuery,
    state,
  };
}

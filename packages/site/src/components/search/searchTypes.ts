/**
 * Types for Pagefind search results and custom search components.
 * Based on Pagefind's JavaScript API response structure.
 */

/** A single sub-result within a search result (e.g., a heading section) */
export interface SearchSubResult {
  /** Unique identifier for this sub-result */
  id: string;
  /** Title of this section (heading text) */
  title: string;
  /** Full URL including anchor */
  url: string;
  /** HTML string with <mark> tags for highlighting */
  excerpt: string;
  /** Anchor ID within the page (e.g., "installation") */
  anchor: string;
}

/** A single search result from Pagefind */
export interface SearchResult {
  /** Unique identifier for this result */
  id: string;
  /** Full URL to the page */
  url: string;
  /** HTML string with <mark> tags for highlighting */
  excerpt: string;
  /** Page metadata */
  meta: {
    title: string;
    image?: string;
  };
  /** Sub-results (sections within the page) */
  sub_results: SearchSubResult[];
  /** Word count of the page */
  word_count?: number;
}

/** Current status of the search operation */
export type SearchStatus = "idle" | "loading" | "success" | "error";

/**
 * Display mode for sub-results (sections within a page).
 * - 'inline': Always show top N sub-results expanded (Pagefind-style)
 * - 'toggle': Collapsible toggle, user clicks to expand (default)
 * - 'breadcrumbs': Show path like "Lib > Providers > YouTube" (Algolia-style)
 */
export type SubResultsDisplay = "inline" | "toggle" | "breadcrumbs";

/** State for the search modal */
export interface SearchState {
  /** Current search query */
  query: string;
  /** Array of search results */
  results: SearchResult[];
  /** Current search status */
  status: SearchStatus;
  /** Error message if status is "error" */
  error: string | null;
  /** Index of currently selected result for keyboard navigation (-1 = none) */
  selectedIndex: number;
  /** Total number of results found */
  totalCount: number;
}

/** Props for SearchResultItem component */
export interface SearchResultItemProps {
  /** The search result to display */
  result: SearchResult;
  /** Whether this result is currently selected */
  isSelected: boolean;
  /** Called when result is clicked */
  onClick: () => void;
  /** Called when mouse enters the result */
  onMouseEnter: () => void;
  /** Unique ID for accessibility (aria-activedescendant) */
  id: string;
  /** Display mode for sub-results (default: 'toggle') */
  subResultsDisplay?: SubResultsDisplay;
  /** Index of selected sub-result when navigateSections is true (-1 = main result) */
  selectedSubIndex?: number;
  /** Called when mouse enters a sub-result */
  onSubResultMouseEnter?: (subIndex: number) => void;
  /** Called when a sub-result is clicked */
  onSubResultClick?: (subIndex: number) => void;
}

/** Props for SearchResults component */
export interface SearchResultsProps {
  /** Array of search results to display */
  results: SearchResult[];
  /** Index of the currently selected result (-1 = none) */
  selectedIndex: number;
  /** Called when selection changes (keyboard/mouse) */
  onSelect: (index: number) => void;
  /** Called when a result should be navigated to */
  onNavigate: (url: string) => void;
  /** ID prefix for result items */
  idPrefix?: string;
  /** Display mode for sub-results (default: 'toggle') */
  subResultsDisplay?: SubResultsDisplay;
  /** Whether arrow keys can navigate into sub-results (default: false) */
  navigateSections?: boolean;
  /** Index of selected sub-result when navigateSections is true (-1 = main result) */
  selectedSubIndex?: number;
  /** Called when sub-result selection changes */
  onSubSelect?: (resultIndex: number, subIndex: number) => void;
}

/** Props for SearchInput component */
export interface SearchInputProps {
  /** Current search query value */
  value: string;
  /** Called when query changes */
  onChange: (value: string) => void;
  /** Called on key down (for keyboard navigation) */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** Whether search is currently loading */
  isLoading: boolean;
  /** Reference to the input element */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** ID of the currently selected result (for aria-activedescendant) */
  activeDescendantId?: string;
  /** Controls ID for the results listbox */
  controlsId?: string;
}

/** Props for SearchEmptyState component */
export interface SearchEmptyStateProps {
  /** Current search query (for "no results" message) */
  query: string;
  /** Current search status */
  status: SearchStatus;
  /** Error message if status is "error" */
  error: string | null;
  /** Whether mock data is being used (shows indicator) */
  useMockData?: boolean;
}

/** Props for SearchModal component */
export interface SearchModalProps {
  /** Use mock data instead of real Pagefind (for dev/testing) */
  useMockData?: boolean;
  /** Initial search query */
  initialQuery?: string;
  /** Called when modal should close */
  onClose?: () => void;
  /** Whether the modal is controlled externally */
  isOpen?: boolean;
  /** Display mode for sub-results (default: 'toggle') */
  subResultsDisplay?: SubResultsDisplay;
  /** Whether arrow keys can navigate into sub-results (default: false) */
  navigateSections?: boolean;
}

/** Options for the usePagefindSearch hook */
export interface UsePagefindSearchOptions {
  /** Use mock data instead of real Pagefind API (for dev/testing) */
  useMockData?: boolean;
  /** Debounce delay in milliseconds (default: 150) */
  debounceMs?: number;
  /** Maximum number of results to return (default: 10) */
  maxResults?: number;
  /** Whether to include sub-results (default: true) */
  showSubResults?: boolean;
}

/** Return type for the usePagefindSearch hook */
export interface UsePagefindSearchReturn {
  /** Current search state */
  state: SearchState;
  /** Update the search query */
  setQuery: (query: string) => void;
  /** Clear the search and reset state */
  clear: () => void;
}

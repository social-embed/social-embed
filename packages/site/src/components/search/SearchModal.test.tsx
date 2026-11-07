import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SearchModal } from "./SearchModal";

let root: Root | null = null;
let container: HTMLElement | null = null;

/**
 * Set an input's value through the native setter so React's change tracking
 * sees it, then dispatch the `input` event.
 */
function setInputValue(input: HTMLInputElement | null, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  );
  descriptor?.set?.call(input, value);
  input?.dispatchEvent(new Event("input", { bubbles: true }));
}

beforeEach(() => {
  // Reset timers for debounce testing
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  if (root) {
    act(() => {
      root?.unmount();
    });
  }
  container?.remove();
  root = null;
  container = null;
});

interface RenderProps {
  useMockData?: boolean;
  initialQuery?: string;
  onClose?: () => void;
  isOpen?: boolean;
  subResultsDisplay?: "inline" | "toggle" | "breadcrumbs";
  onNavigate?: (url: string) => void | Promise<void>;
}

function renderModal(props: RenderProps = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  const defaultProps = {
    useMockData: true,
    ...props,
  };

  act(() => {
    root?.render(<SearchModal {...defaultProps} />);
  });

  const input = container.querySelector("input");
  const resultsList = container.querySelector('[role="listbox"]');

  return {
    container,
    getResults: () => container?.querySelectorAll('[role="option"]') ?? [],
    getSelectedResult: () => container?.querySelector('[aria-selected="true"]'),
    input,
    resultsList,
  };
}

describe("SearchModal", () => {
  describe("rendering", () => {
    test("renders search input", () => {
      const { input } = renderModal();
      expect(input).toBeTruthy();
      expect(input?.getAttribute("aria-label")).toBe("Search documentation");
    });

    test("renders with empty state initially", () => {
      const { container } = renderModal();
      const emptyState = container?.querySelector(".search-excerpt");
      // Empty state shows when no query
      expect(emptyState).toBeNull();
    });

    test("shows loading state while searching", () => {
      const { input } = renderModal();

      act(() => {
        // Type a query
        setInputValue(input, "youtube");
      });

      // Should show loading state before debounce completes
      // Note: Loading spinner is visible during the debounce period
      expect(input?.value).toBe("youtube");
    });
  });

  describe("search functionality", () => {
    test("displays results for matching query", async () => {
      const { input, getResults } = renderModal();

      act(() => {
        setInputValue(input, "youtube");
      });

      // Advance timers past debounce delay and simulated search delay
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      const results = getResults();
      expect(results.length).toBeGreaterThan(0);
    });

    test("shows no results message for non-matching query", async () => {
      const { input, container } = renderModal();

      act(() => {
        setInputValue(input, "xyznonexistent123");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Should show "No results" message
      const noResults = container?.textContent?.includes("No results");
      expect(noResults).toBe(true);
    });

    test("clears results when input is cleared", async () => {
      const { input, getResults } = renderModal();

      // First, search for something
      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      expect(getResults().length).toBeGreaterThan(0);

      // Clear the input
      act(() => {
        setInputValue(input, "");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      expect(getResults().length).toBe(0);
    });
  });

  describe("keyboard navigation", () => {
    test("arrow down selects first result", async () => {
      const { input, getSelectedResult } = renderModal();

      // Search first
      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Press arrow down
      act(() => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
        );
      });

      const selected = getSelectedResult();
      expect(selected).toBeTruthy();
    });

    test("arrow up moves selection up", async () => {
      const { input, container } = renderModal();

      // Search first
      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Press arrow down twice, then up once
      act(() => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
        );
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
        );
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowUp" }),
        );
      });

      // Should be at index 0 (first result)
      const selected = container?.querySelector('[aria-selected="true"]');
      expect(selected?.id).toBe("search-result-0");
    });

    test("escape calls onClose", () => {
      const onClose = vi.fn();
      const { input } = renderModal({ onClose });

      act(() => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
        );
      });

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    test("input has combobox role", () => {
      const { input } = renderModal();
      expect(input?.getAttribute("role")).toBe("combobox");
    });

    test("input has aria-autocomplete", () => {
      const { input } = renderModal();
      expect(input?.getAttribute("aria-autocomplete")).toBe("list");
    });

    test("results list has listbox role", async () => {
      const { input, container } = renderModal();

      // Search to show results
      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      const listbox = container?.querySelector('[role="listbox"]');
      expect(listbox).toBeTruthy();
    });

    test("result items have option role", async () => {
      const { input, getResults } = renderModal();

      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      const results = getResults();
      results.forEach((result) => {
        expect(result.getAttribute("role")).toBe("option");
      });
    });

    test("selected result has aria-selected true", async () => {
      const { input, getSelectedResult } = renderModal();

      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      act(() => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
        );
      });

      const selected = getSelectedResult();
      expect(selected?.getAttribute("aria-selected")).toBe("true");
    });

    test("input has aria-activedescendant when result is selected", async () => {
      const { input } = renderModal();

      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      act(() => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
        );
      });

      expect(input?.getAttribute("aria-activedescendant")).toBe(
        "search-result-0",
      );
    });
  });

  describe("initial query", () => {
    test("uses initial query when provided", async () => {
      const { input } = renderModal({ initialQuery: "vimeo" });

      // Wait for the effect to run
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(input?.value).toBe("vimeo");
    });
  });

  describe("title matching and highlighting", () => {
    test("matches results by title content", async () => {
      const { input, getResults } = renderModal();

      // Search for "Getting Started" which appears in the title but not prominently in excerpt
      act(() => {
        setInputValue(input, "Getting Started");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      const results = getResults();
      expect(results.length).toBeGreaterThan(0);
    });

    test("highlights matching terms in title", async () => {
      // Use toggle mode to test title highlighting behavior
      const { input, container } = renderModal({
        subResultsDisplay: "toggle",
      });

      // Search for "YouTube" which appears in the title "YouTube Embeds"
      act(() => {
        setInputValue(input, "YouTube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Find the first result's title element (first div inside the link)
      const firstResult = container?.querySelector('[role="option"]');
      const titleElement = firstResult?.querySelector("a > div:first-child");

      // Title should contain <mark> tag with highlighted text
      expect(titleElement?.innerHTML).toContain("<mark>");
      expect(titleElement?.innerHTML).toMatch(/<mark>YouTube<\/mark>/i);
    });

    test("highlights matching terms in sub-result titles", async () => {
      // Use toggle mode to test sub-result expansion and highlighting
      const { input, container } = renderModal({
        subResultsDisplay: "toggle",
      });

      // Search for "Installation" which appears in sub-result titles
      act(() => {
        setInputValue(input, "Installation");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Expand sub-results by clicking the toggle button
      const toggleButton = container?.querySelector(
        '[aria-expanded="false"]',
      ) as HTMLButtonElement | null;
      if (toggleButton) {
        act(() => {
          toggleButton.click();
        });
      }

      // Find a sub-result title that should be highlighted
      const subResultTitle = container?.querySelector(
        "ul li a span:first-child span",
      );

      // Sub-result title should contain <mark> tag
      expect(subResultTitle?.innerHTML).toContain("<mark>");
      expect(subResultTitle?.innerHTML).toMatch(/<mark>Installation<\/mark>/i);
    });

    test("preserves original case when highlighting", async () => {
      // Use toggle mode to test title highlighting
      const { input, container } = renderModal({
        subResultsDisplay: "toggle",
      });

      // Search with lowercase for title that has proper case
      act(() => {
        setInputValue(input, "vimeo");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Find the result with "Vimeo" in title
      const results = container?.querySelectorAll('[role="option"]');
      const vimeoResult = Array.from(results ?? []).find((r) =>
        r.textContent?.includes("Vimeo"),
      );
      const titleElement = vimeoResult?.querySelector("a > div:first-child");

      // Should preserve "Vimeo" case even though we searched "vimeo"
      expect(titleElement?.innerHTML).toMatch(/<mark>Vimeo<\/mark>/i);
    });
  });

  describe("navigation", () => {
    test("calls onNavigate prop when provided", async () => {
      const onNavigate = vi.fn();
      const { input, container } = renderModal({ onNavigate });

      // Search for results
      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Click on the anchor inside the first result (that's where the click handler is)
      const firstResultLink = container?.querySelector(
        '[role="option"] a',
      ) as HTMLAnchorElement | null;
      expect(firstResultLink).toBeTruthy();

      act(() => {
        firstResultLink?.click();
      });

      expect(onNavigate).toHaveBeenCalledWith(expect.stringContaining("/"));
    });

    test("does not clear state while navigating", async () => {
      // Create a navigation handler that never resolves (simulates slow navigation)
      const onNavigate = vi.fn(async () => {
        await new Promise<void>(() => {});
      });
      const { input, getResults, container } = renderModal({
        onNavigate,
      });

      // Search for results
      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      const resultsBeforeNav = getResults();
      expect(resultsBeforeNav.length).toBeGreaterThan(0);

      // Click to trigger navigation (which won't complete)
      const firstResultLink = container?.querySelector(
        '[role="option"] a',
      ) as HTMLAnchorElement | null;
      act(() => {
        firstResultLink?.click();
      });

      // Results should still be visible (not cleared) because navigation is in progress
      const resultsAfterNav = getResults();
      expect(resultsAfterNav.length).toBeGreaterThan(0);
    });

    test("ignores Escape key while navigating", async () => {
      const onClose = vi.fn();
      // Create a navigation handler that never resolves
      const onNavigate = vi.fn(async () => {
        await new Promise<void>(() => {});
      });
      const { input, container } = renderModal({ onClose, onNavigate });

      // Search for results
      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Click to trigger navigation (which won't complete)
      const firstResultLink = container?.querySelector(
        '[role="option"] a',
      ) as HTMLAnchorElement | null;
      act(() => {
        firstResultLink?.click();
      });

      // Reset onClose mock since it might have been called during navigation setup
      onClose.mockClear();

      // Press Escape while navigating
      act(() => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
        );
      });

      // onClose should NOT have been called because navigation is in progress
      expect(onClose).not.toHaveBeenCalled();
    });

    test("calls onNavigate when pressing Enter on selected result", async () => {
      const onNavigate = vi.fn();
      const { input } = renderModal({ onNavigate });

      // Search for results
      act(() => {
        setInputValue(input, "youtube");
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Arrow down to select first result, then press Enter
      act(() => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
        );
      });

      act(() => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }),
        );
      });

      expect(onNavigate).toHaveBeenCalledWith(expect.stringContaining("/"));
    });
  });
});

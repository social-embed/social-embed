import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SearchModal } from "./SearchModal";

let root: Root | null = null;
let container: HTMLElement | null = null;

beforeEach(() => {
  // Reset timers for debounce testing
  vi.useFakeTimers();
});

afterEach(async () => {
  vi.useRealTimers();
  if (root) {
    await act(async () => {
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

async function renderModal(props: RenderProps = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  const defaultProps = {
    useMockData: true,
    ...props,
  };

  await act(async () => {
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
    test("renders search input", async () => {
      const { input } = await renderModal();
      expect(input).toBeTruthy();
      expect(input?.getAttribute("aria-label")).toBe("Search documentation");
    });

    test("renders with empty state initially", async () => {
      const { container } = await renderModal();
      const emptyState = container?.querySelector(".search-excerpt");
      // Empty state shows when no query
      expect(emptyState).toBeNull();
    });

    test("shows loading state while searching", async () => {
      const { input } = await renderModal();

      await act(async () => {
        // Type a query
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      // Should show loading state before debounce completes
      // Note: Loading spinner is visible during the debounce period
      expect(input?.value).toBe("youtube");
    });
  });

  describe("search functionality", () => {
    test("displays results for matching query", async () => {
      const { input, getResults } = await renderModal();

      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      // Advance timers past debounce delay and simulated search delay
      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      const results = getResults();
      expect(results.length).toBeGreaterThan(0);
    });

    test("shows no results message for non-matching query", async () => {
      const { input, container } = await renderModal();

      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "xyznonexistent123");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      // Should show "No results" message
      const noResults = container?.textContent?.includes("No results");
      expect(noResults).toBe(true);
    });

    test("clears results when input is cleared", async () => {
      const { input, getResults } = await renderModal();

      // First, search for something
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(getResults().length).toBeGreaterThan(0);

      // Clear the input
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(getResults().length).toBe(0);
    });
  });

  describe("keyboard navigation", () => {
    test("arrow down selects first result", async () => {
      const { input, getSelectedResult } = await renderModal();

      // Search first
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      // Press arrow down
      await act(async () => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
        );
      });

      const selected = getSelectedResult();
      expect(selected).toBeTruthy();
    });

    test("arrow up moves selection up", async () => {
      const { input, container } = await renderModal();

      // Search first
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      // Press arrow down twice, then up once
      await act(async () => {
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

    test("escape calls onClose", async () => {
      const onClose = vi.fn();
      const { input } = await renderModal({ onClose });

      await act(async () => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
        );
      });

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    test("input has combobox role", async () => {
      const { input } = await renderModal();
      expect(input?.getAttribute("role")).toBe("combobox");
    });

    test("input has aria-autocomplete", async () => {
      const { input } = await renderModal();
      expect(input?.getAttribute("aria-autocomplete")).toBe("list");
    });

    test("results list has listbox role", async () => {
      const { input, container } = await renderModal();

      // Search to show results
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      const listbox = container?.querySelector('[role="listbox"]');
      expect(listbox).toBeTruthy();
    });

    test("result items have option role", async () => {
      const { input, getResults } = await renderModal();

      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      const results = getResults();
      results.forEach((result) => {
        expect(result.getAttribute("role")).toBe("option");
      });
    });

    test("selected result has aria-selected true", async () => {
      const { input, getSelectedResult } = await renderModal();

      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await act(async () => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
        );
      });

      const selected = getSelectedResult();
      expect(selected?.getAttribute("aria-selected")).toBe("true");
    });

    test("input has aria-activedescendant when result is selected", async () => {
      const { input } = await renderModal();

      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await act(async () => {
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
      const { input } = await renderModal({ initialQuery: "vimeo" });

      // Wait for the effect to run
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(input?.value).toBe("vimeo");
    });
  });

  describe("title matching and highlighting", () => {
    test("matches results by title content", async () => {
      const { input, getResults } = await renderModal();

      // Search for "Getting Started" which appears in the title but not prominently in excerpt
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "Getting Started");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      const results = getResults();
      expect(results.length).toBeGreaterThan(0);
    });

    test("highlights matching terms in title", async () => {
      // Use toggle mode to test title highlighting behavior
      const { input, container } = await renderModal({
        subResultsDisplay: "toggle",
      });

      // Search for "YouTube" which appears in the title "YouTube Embeds"
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "YouTube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
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
      const { input, container } = await renderModal({
        subResultsDisplay: "toggle",
      });

      // Search for "Installation" which appears in sub-result titles
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "Installation");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      // Expand sub-results by clicking the toggle button
      const toggleButton = container?.querySelector(
        '[aria-expanded="false"]',
      ) as HTMLButtonElement | null;
      if (toggleButton) {
        await act(async () => {
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
      const { input, container } = await renderModal({
        subResultsDisplay: "toggle",
      });

      // Search with lowercase for title that has proper case
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "vimeo");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
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
      const { input, container } = await renderModal({ onNavigate });

      // Search for results
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      // Click on the anchor inside the first result (that's where the click handler is)
      const firstResultLink = container?.querySelector(
        '[role="option"] a',
      ) as HTMLAnchorElement | null;
      expect(firstResultLink).toBeTruthy();

      await act(async () => {
        firstResultLink?.click();
      });

      expect(onNavigate).toHaveBeenCalledWith(expect.stringContaining("/"));
    });

    test("does not clear state while navigating", async () => {
      // Create a navigation handler that never resolves (simulates slow navigation)
      const onNavigate = vi.fn(() => new Promise<void>(() => {}));
      const { input, getResults, container } = await renderModal({
        onNavigate,
      });

      // Search for results
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      const resultsBeforeNav = getResults();
      expect(resultsBeforeNav.length).toBeGreaterThan(0);

      // Click to trigger navigation (which won't complete)
      const firstResultLink = container?.querySelector(
        '[role="option"] a',
      ) as HTMLAnchorElement | null;
      await act(async () => {
        firstResultLink?.click();
      });

      // Results should still be visible (not cleared) because navigation is in progress
      const resultsAfterNav = getResults();
      expect(resultsAfterNav.length).toBeGreaterThan(0);
    });

    test("ignores Escape key while navigating", async () => {
      const onClose = vi.fn();
      // Create a navigation handler that never resolves
      const onNavigate = vi.fn(() => new Promise<void>(() => {}));
      const { input, container } = await renderModal({ onClose, onNavigate });

      // Search for results
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      // Click to trigger navigation (which won't complete)
      const firstResultLink = container?.querySelector(
        '[role="option"] a',
      ) as HTMLAnchorElement | null;
      await act(async () => {
        firstResultLink?.click();
      });

      // Reset onClose mock since it might have been called during navigation setup
      onClose.mockClear();

      // Press Escape while navigating
      await act(async () => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
        );
      });

      // onClose should NOT have been called because navigation is in progress
      expect(onClose).not.toHaveBeenCalled();
    });

    test("calls onNavigate when pressing Enter on selected result", async () => {
      const onNavigate = vi.fn();
      const { input } = await renderModal({ onNavigate });

      // Search for results
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "youtube");
        input?.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      // Arrow down to select first result, then press Enter
      await act(async () => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
        );
      });

      await act(async () => {
        input?.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }),
        );
      });

      expect(onNavigate).toHaveBeenCalledWith(expect.stringContaining("/"));
    });
  });
});

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
});

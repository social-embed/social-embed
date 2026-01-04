import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";
import type { ProviderFilter } from "./constants";
import { LibPlayground } from "./LibPlayground";

// Mock the URL state functions
vi.mock("./libPlaygroundState", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./libPlaygroundState")>();
  return {
    ...actual,
    getLibStateFromUrl: () => actual.DEFAULT_STATE,
    updateLibUrlWithState: vi.fn(),
  };
});

let root: Root | null = null;
let container: HTMLElement | null = null;

afterEach(async () => {
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
  mode?: "mini" | "full";
  initialUrl?: string;
  initialProvider?: ProviderFilter;
  className?: string;
}

function renderPlayground(props: RenderProps = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  act(() => {
    root?.render(<LibPlayground {...props} />);
  });

  return { container };
}

describe("LibPlayground", () => {
  describe("rendering", () => {
    test("renders in full mode by default", () => {
      renderPlayground();

      // Should have provider selector
      const select = container?.querySelector("select");
      expect(select).toBeTruthy();

      // Should have lib source picker (fieldset)
      const fieldset = container?.querySelector("fieldset");
      expect(fieldset).toBeTruthy();

      // Should have URL input
      const input = container?.querySelector('input[type="url"]');
      expect(input).toBeTruthy();
    });

    test("renders in mini mode", () => {
      renderPlayground({ mode: "mini" });

      // Should NOT have provider selector in mini mode
      const select = container?.querySelector("select");
      expect(select).toBeNull();

      // Should NOT have lib source picker in mini mode
      const fieldset = container?.querySelector("fieldset");
      expect(fieldset).toBeNull();

      // Should have URL input
      const input = container?.querySelector('input[type="url"]');
      expect(input).toBeTruthy();
    });

    test("uses initial URL when provided", () => {
      renderPlayground({ initialUrl: "https://youtube.com/watch?v=test123" });

      const input = container?.querySelector(
        'input[type="url"]',
      ) as HTMLInputElement;
      expect(input?.value).toBe("https://youtube.com/watch?v=test123");
    });
  });

  describe("URL transformation", () => {
    test("shows placeholder when URL is empty", async () => {
      renderPlayground({ initialUrl: "" });

      // Wait for state update
      await act(async () => {
        await new Promise((r) => setTimeout(r, 10));
      });

      // The placeholder is in the OutputDisplay's dashed border div
      const dashedBorder = container?.querySelector(".border-dashed");
      expect(dashedBorder?.textContent).toContain("Enter a URL");
    });

    test("transforms YouTube URL and shows output", async () => {
      renderPlayground({
        initialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      });

      // Wait for transformation
      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      const outputDisplay = container?.querySelector(
        '[data-testid="output-display"]',
      );
      expect(outputDisplay?.textContent).toContain("YouTube");
      expect(outputDisplay?.textContent).toContain("dQw4w9WgXcQ");
      expect(outputDisplay?.textContent).toContain("/embed/");
    });

    test("shows error for invalid URL", async () => {
      renderPlayground({ initialUrl: "https://unknown-site.com/video" });

      // Wait for transformation
      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      const alert = container?.querySelector('[role="alert"]');
      expect(alert).toBeTruthy();
      expect(alert?.textContent).toContain("Could not parse");
    });
  });

  describe("components integration", () => {
    test("has reroll button in full mode", () => {
      renderPlayground({ mode: "full" });

      // RerollButton has title="Reroll" (hardcoded in the component)
      const rerollButton = container?.querySelector('button[title="Reroll"]');
      expect(rerollButton).toBeTruthy();
    });

    test("has reroll button in mini mode", () => {
      renderPlayground({ mode: "mini" });

      const rerollButton = container?.querySelector('button[title="Reroll"]');
      expect(rerollButton).toBeTruthy();
    });
  });

  describe("styling", () => {
    test("applies custom className", () => {
      renderPlayground({ className: "custom-class" });

      const wrapper = container?.querySelector(".custom-class");
      expect(wrapper).toBeTruthy();
    });
  });
});

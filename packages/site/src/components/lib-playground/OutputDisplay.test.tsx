import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";
import { type LibOutput, OutputDisplay } from "./OutputDisplay";

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
  output?: LibOutput | null;
  className?: string;
  compact?: boolean;
}

function renderDisplay(props: RenderProps = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  act(() => {
    root?.render(<OutputDisplay {...props} />);
  });

  return { container };
}

describe("OutputDisplay", () => {
  describe("empty state", () => {
    test("shows placeholder when output is null", () => {
      renderDisplay({ output: null });
      const placeholder = container?.querySelector("p");
      expect(placeholder?.textContent).toContain("Enter a URL");
    });

    test("shows placeholder with dashed border", () => {
      renderDisplay({ output: null });
      const wrapper = container?.querySelector("div > div");
      expect(wrapper?.className).toContain("border-dashed");
    });
  });

  describe("error state", () => {
    test("shows error when output is invalid", () => {
      const output: LibOutput = {
        embedUrl: null,
        error: "Invalid URL format",
        input: "not-a-url",
        isValid: false,
        provider: null,
        providerId: null,
      };
      renderDisplay({ output });

      const alert = container?.querySelector('[role="alert"]');
      expect(alert).toBeTruthy();
      expect(alert?.textContent).toContain("Could not parse URL");
      expect(alert?.textContent).toContain("Invalid URL format");
    });

    test("shows default error message when no error text provided", () => {
      const output: LibOutput = {
        embedUrl: null,
        input: "https://unknown.com/video",
        isValid: false,
        provider: null,
        providerId: null,
      };
      renderDisplay({ output });

      const alert = container?.querySelector('[role="alert"]');
      expect(alert?.textContent).toContain("No matching provider found");
    });
  });

  describe("success state", () => {
    const validOutput: LibOutput = {
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      input: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      isValid: true,
      provider: "youtube",
      providerId: "dQw4w9WgXcQ",
    };

    test("displays provider icon and name", () => {
      renderDisplay({ output: validOutput });
      const display = container?.querySelector(
        '[data-testid="output-display"]',
      );

      expect(display?.textContent).toContain("▶️");
      expect(display?.textContent).toContain("YouTube");
    });

    test("displays extracted ID", () => {
      renderDisplay({ output: validOutput });
      const display = container?.querySelector(
        '[data-testid="output-display"]',
      );

      expect(display?.textContent).toContain("dQw4w9WgXcQ");
    });

    test("displays embed URL", () => {
      renderDisplay({ output: validOutput });
      const display = container?.querySelector(
        '[data-testid="output-display"]',
      );

      expect(display?.textContent).toContain(
        "https://www.youtube.com/embed/dQw4w9WgXcQ",
      );
    });

    test("displays input URL in non-compact mode", () => {
      renderDisplay({ compact: false, output: validOutput });
      const display = container?.querySelector(
        '[data-testid="output-display"]',
      );

      expect(display?.textContent).toContain(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      );
    });

    test("hides input URL in compact mode", () => {
      renderDisplay({ compact: true, output: validOutput });
      const display = container?.querySelector(
        '[data-testid="output-display"]',
      );

      // Should have embed URL but not the input URL with watch?v=
      expect(display?.textContent).toContain("/embed/");
      // Count occurrences of the base URL
      const text = display?.textContent || "";
      const matches = text.match(/youtube\.com/g) || [];
      // Should only have one occurrence (the embed URL), not the input
      expect(matches.length).toBe(1);
    });
  });

  describe("YouTube Shorts", () => {
    test("shows Shorts badge when isShorts is true", () => {
      const output: LibOutput = {
        embedUrl: "https://www.youtube.com/embed/abc123",
        input: "https://www.youtube.com/shorts/abc123",
        isShorts: true,
        isValid: true,
        provider: "youtube",
        providerId: "abc123",
      };
      renderDisplay({ output });

      const display = container?.querySelector(
        '[data-testid="output-display"]',
      );
      expect(display?.textContent).toContain("Shorts");
    });
  });

  describe("array IDs", () => {
    test("joins array IDs with comma", () => {
      const output: LibOutput = {
        embedUrl: "https://example.com/embed/123",
        input: "https://example.com/playlist/123",
        isValid: true,
        provider: "youtube",
        providerId: ["id1", "id2", "id3"],
      };
      renderDisplay({ output });

      const display = container?.querySelector(
        '[data-testid="output-display"]',
      );
      expect(display?.textContent).toContain("id1, id2, id3");
    });
  });

  describe("styling", () => {
    test("applies custom className", () => {
      renderDisplay({ className: "custom-class", output: null });
      const wrapper = container?.querySelector(".custom-class");
      expect(wrapper).toBeTruthy();
    });
  });
});

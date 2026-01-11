import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";
import { getProviderFilterOptions, type ProviderFilter } from "./constants";
import { ProviderSelector } from "./ProviderSelector";

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
  value?: ProviderFilter;
  onChange?: (value: ProviderFilter) => void;
  className?: string;
  disabled?: boolean;
}

async function renderSelector(props: RenderProps = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  const defaultProps = {
    onChange: vi.fn(),
    value: "all" as const,
    ...props,
  };

  await act(async () => {
    root?.render(<ProviderSelector {...defaultProps} />);
  });

  const wrapper = container.querySelector("div");
  const select = container.querySelector("select");
  if (!wrapper || !select) {
    throw new Error("Expected wrapper div and select element");
  }
  return { select, wrapper };
}

describe("ProviderSelector", () => {
  describe("rendering", () => {
    test("renders with default value", async () => {
      const { select } = await renderSelector({ value: "all" });
      expect(select.value).toBe("all");
    });

    test("renders all provider options", async () => {
      const { select } = await renderSelector();
      const options = getProviderFilterOptions();

      expect(select.options.length).toBe(options.length);

      for (const provider of options) {
        const option = select.querySelector(`option[value="${provider}"]`);
        expect(option).toBeTruthy();
      }
    });

    test("reflects the current value", async () => {
      const { select } = await renderSelector({ value: "spotify-track" });
      expect(select.value).toBe("spotify-track");
    });

    test("shows icon and name in options", async () => {
      const { select } = await renderSelector();
      const youtubeOption = select.querySelector('option[value="youtube"]');
      expect(youtubeOption?.textContent).toContain("▶️");
      expect(youtubeOption?.textContent).toContain("YouTube");
    });
  });

  describe("interaction", () => {
    test("calls onChange when selection changes", async () => {
      const onChange = vi.fn();
      const { select } = await renderSelector({ onChange, value: "all" });

      await act(async () => {
        select.value = "youtube";
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });

      expect(onChange).toHaveBeenCalledWith("youtube");
    });
  });

  describe("disabled state", () => {
    test("can be disabled", async () => {
      const { select } = await renderSelector({ disabled: true });
      expect(select.disabled).toBe(true);
    });

    test("is not disabled by default", async () => {
      const { select } = await renderSelector();
      expect(select.disabled).toBe(false);
    });
  });

  describe("styling", () => {
    test("applies custom className", async () => {
      const { wrapper } = await renderSelector({ className: "custom-class" });
      expect(wrapper.className).toContain("custom-class");
    });

    test("has aria-label for accessibility", async () => {
      const { select } = await renderSelector();
      expect(select.getAttribute("aria-label")).toBe("Select provider filter");
    });
  });
});

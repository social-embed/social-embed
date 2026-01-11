import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";
import { LIB_SOURCE_ORDER, LIB_SOURCES, type LibSourceType } from "./constants";
import { LibSourcePicker } from "./LibSourcePicker";

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
  value?: LibSourceType;
  onChange?: (value: LibSourceType) => void;
  className?: string;
  disabled?: boolean;
}

async function renderPicker(props: RenderProps = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  const defaultProps = {
    onChange: vi.fn(),
    value: "local" as const,
    ...props,
  };

  await act(async () => {
    root?.render(<LibSourcePicker {...defaultProps} />);
  });

  const wrapper = container.querySelector("fieldset");
  const buttons = container.querySelectorAll("button");
  if (!wrapper) {
    throw new Error("Expected wrapper fieldset element");
  }
  return { buttons, onChange: defaultProps.onChange, wrapper };
}

describe("LibSourcePicker", () => {
  describe("rendering", () => {
    test("renders all source buttons", async () => {
      const { buttons } = await renderPicker();
      expect(buttons.length).toBe(LIB_SOURCE_ORDER.length);
    });

    test("renders button labels correctly", async () => {
      const { buttons } = await renderPicker();
      for (let i = 0; i < LIB_SOURCE_ORDER.length; i++) {
        const sourceType = LIB_SOURCE_ORDER[i];
        expect(buttons[i].textContent).toBe(LIB_SOURCES[sourceType].label);
      }
    });

    test("shows local as selected by default", async () => {
      const { buttons } = await renderPicker({ value: "local" });
      const localButton = Array.from(buttons).find(
        (btn) => btn.textContent === "Local",
      );
      expect(localButton?.getAttribute("aria-pressed")).toBe("true");
    });

    test("shows esm-sh as selected when value is esm-sh", async () => {
      const { buttons } = await renderPicker({ value: "esm-sh" });
      // Find button with exact "esm.sh (npm)" label (not GitHub)
      const esmButton = Array.from(buttons).find(
        (btn) => btn.textContent === LIB_SOURCES["esm-sh"].label,
      );
      expect(esmButton?.getAttribute("aria-pressed")).toBe("true");
    });

    test("displays CDN URL when non-local source is selected", async () => {
      await renderPicker({ value: "esm-sh" });
      const urlDisplay = container?.querySelector(".font-mono");
      expect(urlDisplay?.textContent).toContain("esm.sh");
    });

    test("does not display URL when local source is selected", async () => {
      await renderPicker({ value: "local" });
      const urlDisplay = container?.querySelector(".font-mono");
      expect(urlDisplay).toBeNull();
    });
  });

  describe("interaction", () => {
    test("calls onChange when button is clicked", async () => {
      const { buttons, onChange } = await renderPicker({ value: "local" });

      const unpkgButton = Array.from(buttons).find(
        (btn) => btn.textContent === "unpkg",
      );

      await act(async () => {
        unpkgButton?.click();
      });

      expect(onChange).toHaveBeenCalledWith("unpkg");
    });

    test("calls onChange with correct source type", async () => {
      const { buttons, onChange } = await renderPicker({ value: "local" });

      // Click through different sources
      const esmShButton = Array.from(buttons).find((btn) =>
        btn.textContent?.includes("esm.sh (npm)"),
      );

      await act(async () => {
        esmShButton?.click();
      });

      expect(onChange).toHaveBeenCalledWith("esm-sh");
    });
  });

  describe("disabled state", () => {
    test("all buttons are disabled when disabled prop is true", async () => {
      const { buttons } = await renderPicker({ disabled: true });

      for (const button of buttons) {
        expect(button.disabled).toBe(true);
      }
    });

    test("buttons are enabled by default", async () => {
      const { buttons } = await renderPicker();

      for (const button of buttons) {
        expect(button.disabled).toBe(false);
      }
    });
  });

  describe("styling", () => {
    test("applies custom className", async () => {
      const { wrapper } = await renderPicker({ className: "custom-class" });
      expect(wrapper.className).toContain("custom-class");
    });

    test("uses semantic fieldset element", async () => {
      const { wrapper } = await renderPicker();
      expect(wrapper.tagName.toLowerCase()).toBe("fieldset");
    });

    test("has aria-label for accessibility", async () => {
      const { wrapper } = await renderPicker();
      expect(wrapper.getAttribute("aria-label")).toBe("Select library source");
    });

    test("buttons have title tooltips", async () => {
      const { buttons } = await renderPicker();
      for (let i = 0; i < LIB_SOURCE_ORDER.length; i++) {
        const sourceType = LIB_SOURCE_ORDER[i];
        expect(buttons[i].getAttribute("title")).toBe(
          LIB_SOURCES[sourceType].description,
        );
      }
    });
  });
});

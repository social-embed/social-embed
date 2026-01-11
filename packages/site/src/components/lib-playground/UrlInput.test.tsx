import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";
import { UrlInput } from "./UrlInput";

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
  value?: string;
  onChange?: (url: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

async function renderInput(props: RenderProps = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  const defaultProps = {
    onChange: vi.fn(),
    value: "",
    ...props,
  };

  await act(async () => {
    root?.render(<UrlInput {...defaultProps} />);
  });

  const wrapper = container.querySelector("div");
  const input = container.querySelector("input");
  const clearButton = container.querySelector('button[aria-label="Clear URL"]');

  if (!wrapper || !input) {
    throw new Error("Expected wrapper div and input element");
  }

  return { clearButton, input, onChange: defaultProps.onChange, wrapper };
}

describe("UrlInput", () => {
  describe("rendering", () => {
    test("renders with empty value", async () => {
      const { input } = await renderInput();
      expect(input.value).toBe("");
    });

    test("renders with provided value", async () => {
      const { input } = await renderInput({
        value: "https://youtube.com/watch?v=abc",
      });
      expect(input.value).toBe("https://youtube.com/watch?v=abc");
    });

    test("has correct input type", async () => {
      const { input } = await renderInput();
      expect(input.type).toBe("url");
    });

    test("uses custom placeholder", async () => {
      const { input } = await renderInput({
        placeholder: "Custom placeholder",
      });
      expect(input.placeholder).toBe("Custom placeholder");
    });

    test("uses default placeholder", async () => {
      const { input } = await renderInput();
      expect(input.placeholder).toContain("Paste a video URL");
    });
  });

  describe("clear button", () => {
    test("does not show clear button when value is empty", async () => {
      const { clearButton } = await renderInput({ value: "" });
      expect(clearButton).toBeNull();
    });

    test("shows clear button when value is present", async () => {
      await renderInput({ value: "https://example.com" });
      const clearButton = container?.querySelector(
        'button[aria-label="Clear URL"]',
      );
      expect(clearButton).toBeTruthy();
    });

    test("clears value when clear button is clicked", async () => {
      const onChange = vi.fn();
      await renderInput({ onChange, value: "https://example.com" });
      const clearButton = container?.querySelector(
        'button[aria-label="Clear URL"]',
      );

      await act(async () => {
        clearButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(onChange).toHaveBeenCalledWith("");
    });

    test("does not show clear button when disabled", async () => {
      await renderInput({ disabled: true, value: "https://example.com" });
      const clearButton = container?.querySelector(
        'button[aria-label="Clear URL"]',
      );
      expect(clearButton).toBeNull();
    });
  });

  describe("interaction", () => {
    test("calls onChange when input value changes", async () => {
      const onChange = vi.fn();
      const { input } = await renderInput({ onChange });

      // Use native setter to trigger React's onChange
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "https://youtube.com");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });

      expect(onChange).toHaveBeenCalled();
    });

    test("calls onSubmit when Enter is pressed", async () => {
      const onSubmit = vi.fn();
      const { input } = await renderInput({
        onSubmit,
        value: "https://example.com",
      });

      await act(async () => {
        input.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }),
        );
      });

      expect(onSubmit).toHaveBeenCalled();
    });

    test("does not call onSubmit when Shift+Enter is pressed", async () => {
      const onSubmit = vi.fn();
      const { input } = await renderInput({
        onSubmit,
        value: "https://example.com",
      });

      await act(async () => {
        input.dispatchEvent(
          new KeyboardEvent("keydown", {
            bubbles: true,
            key: "Enter",
            shiftKey: true,
          }),
        );
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("disabled state", () => {
    test("can be disabled", async () => {
      const { input } = await renderInput({ disabled: true });
      expect(input.disabled).toBe(true);
    });

    test("is not disabled by default", async () => {
      const { input } = await renderInput();
      expect(input.disabled).toBe(false);
    });
  });

  describe("styling", () => {
    test("applies custom className", async () => {
      const { wrapper } = await renderInput({ className: "custom-class" });
      expect(wrapper.className).toContain("custom-class");
    });

    test("has aria-label for accessibility", async () => {
      const { input } = await renderInput();
      expect(input.getAttribute("aria-label")).toBe("URL input");
    });
  });
});

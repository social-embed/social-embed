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

function renderInput(props: RenderProps = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  const defaultProps = {
    onChange: vi.fn(),
    value: "",
    ...props,
  };

  act(() => {
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
    test("renders with empty value", () => {
      const { input } = renderInput();
      expect(input.value).toBe("");
    });

    test("renders with provided value", () => {
      const { input } = renderInput({
        value: "https://youtube.com/watch?v=abc",
      });
      expect(input.value).toBe("https://youtube.com/watch?v=abc");
    });

    test("has correct input type", () => {
      const { input } = renderInput();
      expect(input.type).toBe("url");
    });

    test("uses custom placeholder", () => {
      const { input } = renderInput({ placeholder: "Custom placeholder" });
      expect(input.placeholder).toBe("Custom placeholder");
    });

    test("uses default placeholder", () => {
      const { input } = renderInput();
      expect(input.placeholder).toContain("Paste a video URL");
    });
  });

  describe("clear button", () => {
    test("does not show clear button when value is empty", () => {
      const { clearButton } = renderInput({ value: "" });
      expect(clearButton).toBeNull();
    });

    test("shows clear button when value is present", () => {
      renderInput({ value: "https://example.com" });
      const clearButton = container?.querySelector(
        'button[aria-label="Clear URL"]',
      );
      expect(clearButton).toBeTruthy();
    });

    test("clears value when clear button is clicked", () => {
      const onChange = vi.fn();
      renderInput({ onChange, value: "https://example.com" });
      const clearButton = container?.querySelector(
        'button[aria-label="Clear URL"]',
      );

      act(() => {
        clearButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(onChange).toHaveBeenCalledWith("");
    });

    test("does not show clear button when disabled", () => {
      renderInput({ disabled: true, value: "https://example.com" });
      const clearButton = container?.querySelector(
        'button[aria-label="Clear URL"]',
      );
      expect(clearButton).toBeNull();
    });
  });

  describe("interaction", () => {
    test("calls onChange when input value changes", () => {
      const onChange = vi.fn();
      const { input } = renderInput({ onChange });

      // Use native setter to trigger React's onChange
      act(() => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(input, "https://youtube.com");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });

      expect(onChange).toHaveBeenCalled();
    });

    test("calls onSubmit when Enter is pressed", () => {
      const onSubmit = vi.fn();
      const { input } = renderInput({ onSubmit, value: "https://example.com" });

      act(() => {
        input.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }),
        );
      });

      expect(onSubmit).toHaveBeenCalled();
    });

    test("does not call onSubmit when Shift+Enter is pressed", () => {
      const onSubmit = vi.fn();
      const { input } = renderInput({ onSubmit, value: "https://example.com" });

      act(() => {
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
    test("can be disabled", () => {
      const { input } = renderInput({ disabled: true });
      expect(input.disabled).toBe(true);
    });

    test("is not disabled by default", () => {
      const { input } = renderInput();
      expect(input.disabled).toBe(false);
    });
  });

  describe("styling", () => {
    test("applies custom className", () => {
      const { wrapper } = renderInput({ className: "custom-class" });
      expect(wrapper.className).toContain("custom-class");
    });

    test("has aria-label for accessibility", () => {
      const { input } = renderInput();
      expect(input.getAttribute("aria-label")).toBe("URL input");
    });
  });
});

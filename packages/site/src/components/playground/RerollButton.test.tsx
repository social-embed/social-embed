import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";
import { RerollButton } from "./RerollButton";

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

function renderButton(props: Parameters<typeof RerollButton>[0] = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  act(() => {
    root?.render(<RerollButton {...props} />);
  });

  const button = container.querySelector("button");
  if (!button) throw new Error("Expected button element");
  return button;
}

describe("RerollButton", () => {
  describe("default variant", () => {
    test("defaults to md variant (32px height via h-8)", () => {
      const button = renderButton();
      expect(button.className).toContain("h-8");
    });

    test("md variant applies h-8 class", () => {
      const button = renderButton({ variant: "md" });
      expect(button.className).toContain("h-8");
    });
  });

  describe("showLabel defaults to false", () => {
    test("does not show label by default", () => {
      const button = renderButton();
      expect(button.textContent).not.toContain("Reroll");
    });

    test("does not show label when showLabel is false", () => {
      const button = renderButton({ showLabel: false });
      expect(button.textContent).not.toContain("Reroll");
    });

    test("shows label when showLabel is true", () => {
      const button = renderButton({ showLabel: true });
      expect(button.textContent).toContain("Reroll");
    });

    test("shows label when showLabel is explicitly true for any variant", () => {
      const variants = [
        "xxs",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "xxl",
        "xxxl",
      ] as const;
      for (const variant of variants) {
        const button = renderButton({ showLabel: true, variant });
        expect(button.textContent).toContain("Reroll");
        // Clean up for next iteration
        root?.unmount();
        container?.remove();
      }
    });

    test("hides label by default for all variants", () => {
      const variants = [
        "xxs",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "xxl",
        "xxxl",
      ] as const;
      for (const variant of variants) {
        const button = renderButton({ variant });
        expect(button.textContent).not.toContain("Reroll");
        // Clean up for next iteration
        root?.unmount();
        container?.remove();
      }
    });
  });

  describe("size variants", () => {
    test("xxs applies h-5 (20px)", () => {
      const button = renderButton({ variant: "xxs" });
      expect(button.className).toContain("h-5");
    });

    test("xs applies h-[22px]", () => {
      const button = renderButton({ variant: "xs" });
      expect(button.className).toContain("h-[22px]");
    });

    test("sm applies h-6 (24px)", () => {
      const button = renderButton({ variant: "sm" });
      expect(button.className).toContain("h-6");
    });

    test("lg applies h-9 (36px)", () => {
      const button = renderButton({ variant: "lg" });
      expect(button.className).toContain("h-9");
    });

    test("xl applies h-10 (40px)", () => {
      const button = renderButton({ variant: "xl" });
      expect(button.className).toContain("h-10");
    });

    test("xxl applies h-11 (44px)", () => {
      const button = renderButton({ variant: "xxl" });
      expect(button.className).toContain("h-11");
    });

    test("xxxl applies h-12 (48px)", () => {
      const button = renderButton({ variant: "xxxl" });
      expect(button.className).toContain("h-12");
    });
  });
});

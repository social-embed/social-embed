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

async function renderButton(props: Parameters<typeof RerollButton>[0] = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  await act(async () => {
    root?.render(<RerollButton {...props} />);
  });

  const button = container.querySelector("button");
  if (!button) throw new Error("Expected button element");
  return button;
}

describe("RerollButton", () => {
  describe("default variant", () => {
    test("defaults to md variant (32px height via h-8)", async () => {
      const button = await renderButton();
      expect(button.className).toContain("h-8");
    });

    test("md variant applies h-8 class", async () => {
      const button = await renderButton({ variant: "md" });
      expect(button.className).toContain("h-8");
    });
  });

  describe("showLabel defaults to false", () => {
    test("does not show label by default", async () => {
      const button = await renderButton();
      expect(button.textContent).not.toContain("Reroll");
    });

    test("does not show label when showLabel is false", async () => {
      const button = await renderButton({ showLabel: false });
      expect(button.textContent).not.toContain("Reroll");
    });

    test("shows label when showLabel is true", async () => {
      const button = await renderButton({ showLabel: true });
      expect(button.textContent).toContain("Reroll");
    });

    test("shows label when showLabel is explicitly true for any variant", async () => {
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
        const button = await renderButton({ showLabel: true, variant });
        expect(button.textContent).toContain("Reroll");
        // Clean up for next iteration
        await act(async () => {
          root?.unmount();
        });
        container?.remove();
      }
    });

    test("hides label by default for all variants", async () => {
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
        const button = await renderButton({ variant });
        expect(button.textContent).not.toContain("Reroll");
        // Clean up for next iteration
        await act(async () => {
          root?.unmount();
        });
        container?.remove();
      }
    });
  });

  describe("size variants", () => {
    test("xxs applies h-5 (20px)", async () => {
      const button = await renderButton({ variant: "xxs" });
      expect(button.className).toContain("h-5");
    });

    test("xs applies h-[22px]", async () => {
      const button = await renderButton({ variant: "xs" });
      expect(button.className).toContain("h-[22px]");
    });

    test("sm applies h-6 (24px)", async () => {
      const button = await renderButton({ variant: "sm" });
      expect(button.className).toContain("h-6");
    });

    test("lg applies h-9 (36px)", async () => {
      const button = await renderButton({ variant: "lg" });
      expect(button.className).toContain("h-9");
    });

    test("xl applies h-10 (40px)", async () => {
      const button = await renderButton({ variant: "xl" });
      expect(button.className).toContain("h-10");
    });

    test("xxl applies h-11 (44px)", async () => {
      const button = await renderButton({ variant: "xxl" });
      expect(button.className).toContain("h-11");
    });

    test("xxxl applies h-12 (48px)", async () => {
      const button = await renderButton({ variant: "xxxl" });
      expect(button.className).toContain("h-12");
    });
  });
});

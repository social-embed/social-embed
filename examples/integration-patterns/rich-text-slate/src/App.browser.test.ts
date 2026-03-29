import { afterEach, describe, expect, it } from "vitest";

describe("Slate example app", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("inserts a sample embed and renders the serialized tag", async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import("./main");
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    const button = document.querySelector(
      '[data-testid="insert-embed"]',
    ) as HTMLButtonElement | null;
    expect(button).not.toBeNull();

    button?.click();
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    const serialized = document.querySelector('[data-testid="serialized-html"]');
    expect(serialized?.textContent).toContain("<o-embed");

    const previewEmbed = document.querySelector(
      '[data-testid="preview"] o-embed',
    );
    expect(previewEmbed).not.toBeNull();
  });
});

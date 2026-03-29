import { afterEach, describe, expect, it } from "vitest";

describe("Markdown example app", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders o-embed only when the sanitizer allow list is enabled", async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import("./main");
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    // allowEmbed defaults to true — o-embed should be visible on first load
    expect(
      document.querySelector('[data-testid="preview"] o-embed'),
    ).not.toBeNull();

    const checkbox = document.querySelector(
      '[data-testid="allow-embed"]',
    ) as HTMLInputElement | null;
    expect(checkbox).not.toBeNull();
    if (!checkbox) {
      throw new Error("Missing allow-embed checkbox");
    }

    // Uncheck — embed should be stripped
    checkbox.click();
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    expect(
      document.querySelector('[data-testid="preview"] o-embed'),
    ).toBeNull();
  });
});

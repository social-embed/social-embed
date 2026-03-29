import { afterEach, describe, expect, it } from "vitest";

describe("Server validation example app", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("rejects invalid URLs and accepts valid ones", async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import("./main");
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    expect(document.querySelector('[data-testid="status"]')?.textContent).toContain(
      "Rejected",
    );

    const sampleButton = document.querySelector(
      '[data-testid="sample-valid"]',
    ) as HTMLButtonElement | null;
    expect(sampleButton).not.toBeNull();

    sampleButton?.click();
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    expect(document.querySelector('[data-testid="status"]')?.textContent).toContain(
      "Accepted provider",
    );
    expect(
      document.querySelector('[data-testid="preview"] o-embed'),
    ).not.toBeNull();
  });
});

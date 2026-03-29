import { afterEach, describe, expect, it } from "vitest";

describe("vanilla-ts-with-validation example app", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("validates URLs through all three gates", async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import("./main");
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    // Initial input is INVALID_URL — status shows rejected, no embed
    expect(document.querySelector('[data-testid="preview"] o-embed')).toBeNull();
    const status = document.querySelector(
      '[data-testid="status"]',
    ) as HTMLParagraphElement | null;
    expect(status?.textContent).toMatch(/Rejected/);

    // Click sample-valid — embed should appear
    const sampleValidButton = document.querySelector(
      '[data-testid="sample-valid"]',
    ) as HTMLButtonElement | null;
    expect(sampleValidButton).not.toBeNull();
    sampleValidButton?.click();
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    expect(
      document.querySelector('[data-testid="preview"] o-embed'),
    ).not.toBeNull();
    expect(status?.textContent).toMatch(/Accepted/);

    // Click sample-malformed — embed removed, format error shown
    const malformedButton = document.querySelector(
      '[data-testid="sample-malformed"]',
    ) as HTMLButtonElement | null;
    expect(malformedButton).not.toBeNull();
    malformedButton?.click();
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    expect(document.querySelector('[data-testid="preview"] o-embed')).toBeNull();
    expect(status?.textContent).toMatch(/Must be a valid URL/);
  });
});

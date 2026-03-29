import { afterEach, describe, expect, it } from "vitest";

describe("CMS content example app", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders both stored HTML and structured URL previews", async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import("./main");
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    expect(
      document.querySelector('[data-testid="stored-body-preview"] o-embed'),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-testid="structured-preview"] o-embed'),
    ).not.toBeNull();
  });
});

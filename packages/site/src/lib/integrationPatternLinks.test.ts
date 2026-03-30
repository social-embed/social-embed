import { describe, expect, it, vi } from "vitest";

vi.stubGlobal("__GIT_BRANCH__", "examples-branch");

describe("integrationPatternLinks", () => {
  it("builds detail page paths without duplicate slashes", async () => {
    const { buildIntegrationPatternDetailPath } = await import(
      "./integrationPatternLinks"
    );

    expect(
      buildIntegrationPatternDetailPath(
        "/wc/integration-patterns/",
        "cms-content",
      ),
    ).toBe("/wc/integration-patterns/cms-content/");
  });

  it("builds StackBlitz URLs with embed options", async () => {
    const { buildStackBlitzUrl } = await import("./integrationPatternLinks");

    const url = buildStackBlitzUrl(
      {
        githubPath: "examples/integration-patterns/rich-text-tiptap",
        stackblitzOpenFile: "src/embedExtension.ts",
      },
      { ctl: 1, embed: 1, hideExplorer: 1, terminalHeight: 45, view: "editor" },
    );

    expect(url).toContain(
      "https://stackblitz.com/github/social-embed/social-embed/tree/examples-branch/examples/integration-patterns/rich-text-tiptap",
    );
    expect(url).toContain("file=src%2FembedExtension.ts");
    expect(url).toContain("embed=1");
    expect(url).toContain("view=editor");
  });
});

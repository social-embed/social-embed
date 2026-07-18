import { describe, expect, it } from "vitest";
import { DEFAULT_MARKDOWN, sanitizeMarkdownSource } from "./markdownHelpers";

describe("sanitizeMarkdownSource", () => {
  it("strips o-embed when the allow list is disabled", () => {
    const sanitized = sanitizeMarkdownSource(DEFAULT_MARKDOWN, false);
    expect(sanitized).not.toContain("<o-embed");
  });

  it("keeps o-embed when the allow list is enabled", () => {
    const sanitized = sanitizeMarkdownSource(DEFAULT_MARKDOWN, true);
    expect(sanitized).toContain("<o-embed");
    expect(sanitized).toContain('url="https://youtu.be/Bd8_vO5zrjo"');
  });
});

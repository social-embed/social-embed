import { describe, expect, it } from "vitest";
import {
  getCmsPreviewHtml,
  renderStructuredEmbed,
  STORED_EMBED_URL,
} from "./cmsHelpers";

describe("cmsHelpers", () => {
  it("renders the structured URL as a stable o-embed tag", () => {
    expect(renderStructuredEmbed(STORED_EMBED_URL)).toBe(
      '<o-embed url="https://youtu.be/Bd8_vO5zrjo"></o-embed>',
    );
  });

  it("returns stored HTML and structured output for previews", () => {
    const previews = getCmsPreviewHtml();
    expect(previews.htmlBody).toContain("<o-embed");
    expect(previews.structuredBody).toContain("<o-embed");
  });
});

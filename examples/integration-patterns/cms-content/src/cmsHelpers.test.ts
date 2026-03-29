import { describe, expect, it } from "vitest";
import {
  CMS_RECORDS,
  getCmsPreviewHtml,
  renderStoredEmbed,
  type StoredEmbed,
} from "./cmsHelpers";

describe("cmsHelpers", () => {
  it("renders a url-field record as a stable o-embed tag", () => {
    const record: StoredEmbed = {
      kind: "url-field",
      url: "https://youtu.be/Bd8_vO5zrjo",
    };
    expect(renderStoredEmbed(record)).toBe(
      '<o-embed url="https://youtu.be/Bd8_vO5zrjo"></o-embed>',
    );
  });

  it("renders an html-body record directly", () => {
    const record: StoredEmbed = {
      html: '<p>Hello</p><o-embed url="https://youtu.be/x"></o-embed>',
      kind: "html-body",
    };
    expect(renderStoredEmbed(record)).toContain("<o-embed");
    expect(renderStoredEmbed(record)).toContain("<p>Hello</p>");
  });

  it("renders a legacy-plain-text record by wrapping the URL", () => {
    const record: StoredEmbed = {
      kind: "legacy-plain-text",
      text: "https://youtu.be/Bd8_vO5zrjo",
    };
    expect(renderStoredEmbed(record)).toBe(
      '<o-embed url="https://youtu.be/Bd8_vO5zrjo"></o-embed>',
    );
  });

  it("CMS_RECORDS covers all three StoredEmbed kinds", () => {
    const kinds = CMS_RECORDS.map((r) => r.kind);
    expect(kinds).toContain("html-body");
    expect(kinds).toContain("url-field");
    expect(kinds).toContain("legacy-plain-text");
  });

  it("getCmsPreviewHtml returns both stored HTML and structured output", () => {
    const previews = getCmsPreviewHtml();
    expect(previews.htmlBody).toContain("<o-embed");
    expect(previews.structuredBody).toContain("<o-embed");
  });
});

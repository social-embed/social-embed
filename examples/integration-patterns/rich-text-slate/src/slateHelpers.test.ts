import { describe, expect, it } from "vitest";
import {
  createEmbedElement,
  isOEmbedElement,
  SAMPLE_URL,
  serializeSlateDocument,
} from "./slateHelpers";

describe("slateHelpers", () => {
  it("creates a stable embed element shape", () => {
    expect(createEmbedElement(SAMPLE_URL)).toEqual({
      children: [{ text: "" }],
      type: "oEmbed",
      url: SAMPLE_URL,
    });
  });

  it("serializes a document with an embed node", () => {
    const html = serializeSlateDocument([
      {
        children: [{ text: "Before" }],
        type: "paragraph",
      },
      createEmbedElement(SAMPLE_URL),
    ]);

    expect(html).toContain("<p>Before</p>");
    expect(html).toContain(
      '<o-embed url="https://youtu.be/Bd8_vO5zrjo"></o-embed>',
    );
  });

  it("throws on unknown node types", () => {
    expect(() =>
      serializeSlateDocument([
        { children: [], type: "custom-unknown" } as unknown as Parameters<
          typeof serializeSlateDocument
        >[0][number],
      ]),
    ).toThrow("serializeSlateDocument: unknown node");
  });

  it("isOEmbedElement narrows correctly", () => {
    expect(isOEmbedElement(createEmbedElement(SAMPLE_URL))).toBe(true);
    expect(isOEmbedElement({ children: [], type: "paragraph" })).toBe(false);
    expect(isOEmbedElement(null)).toBe(false);
    expect(isOEmbedElement("string")).toBe(false);
  });
});

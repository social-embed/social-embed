import { describe, expect, it } from "vitest";
import {
  createOEmbedNode,
  SAMPLE_URL,
  serializeEmbedTag,
} from "./embedExtension";

describe("embedExtension", () => {
  it("creates a stable node payload", () => {
    expect(createOEmbedNode(SAMPLE_URL)).toEqual({
      attrs: { url: SAMPLE_URL },
      type: "oEmbed",
    });
  });

  it("serializes to the expected o-embed tag", () => {
    expect(serializeEmbedTag(SAMPLE_URL)).toBe(
      '<o-embed url="https://youtu.be/Bd8_vO5zrjo"></o-embed>',
    );
  });
});

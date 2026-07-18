import { describe, expect, it } from "vitest";
import {
  createOEmbedNode,
  OEmbedExtension,
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

  it("extension exposes addPasteRules", () => {
    expect(typeof OEmbedExtension.options).toBe("object");
    // Cast through unknown — NodeConfig does not overlap with Record<string, unknown>
    const config = OEmbedExtension.config as unknown as Record<string, unknown>;
    expect(typeof config.addPasteRules).toBe("function");
  });

  it("extension exposes insertOEmbed command", () => {
    const config = OEmbedExtension.config as unknown as Record<string, unknown>;
    expect(typeof config.addCommands).toBe("function");
    // Calling addCommands() (unbound) returns the command map shape
    const addCommands = config.addCommands as () => Record<string, unknown>;
    const commands = addCommands.call({ name: "oEmbed", type: {} });
    expect(typeof commands.insertOEmbed).toBe("function");
  });
});

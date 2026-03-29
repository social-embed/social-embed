import { mergeAttributes, Node } from "@tiptap/core";

export const SAMPLE_URL = "https://youtu.be/Bd8_vO5zrjo";

export type OEmbedNodeContent = {
  attrs: { url: string };
  type: "oEmbed";
};

export function createOEmbedNode(url: string): OEmbedNodeContent {
  return {
    attrs: { url },
    type: "oEmbed",
  };
}

export function serializeEmbedTag(url: string): string {
  return `<o-embed url="${url}"></o-embed>`;
}

export const OEmbedExtension = Node.create({
  addAttributes() {
    return {
      url: {
        default: null,
      },
    };
  },
  atom: true,
  group: "block",
  name: "oEmbed",
  parseHTML() {
    return [{ tag: "o-embed" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["o-embed", mergeAttributes(HTMLAttributes)];
  },
});

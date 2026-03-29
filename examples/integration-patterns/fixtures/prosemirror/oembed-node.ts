import { Node } from "@tiptap/core";

export const OEmbedNode = Node.create({
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
    return ["o-embed", HTMLAttributes];
  },
});

import { Node } from "@tiptap/core";

export const OEmbedNode = Node.create({
  name: "oEmbed",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      url: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [{ tag: "o-embed" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["o-embed", HTMLAttributes];
  },
});

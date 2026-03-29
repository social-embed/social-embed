import {
  type CommandProps,
  mergeAttributes,
  Node,
  nodePasteRule,
} from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    oEmbed: {
      insertOEmbed: (url: string) => ReturnType;
    };
  }
}

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
  addCommands() {
    return {
      insertOEmbed:
        (url: string) =>
        ({ commands }: CommandProps) =>
          commands.insertContent({ attrs: { url }, type: this.name }),
    };
  },
  addPasteRules() {
    return [
      nodePasteRule({
        find: /https?:\/\/\S+/g,
        getAttributes: (match) => ({ url: match[0] }),
        type: this.type,
      }),
    ];
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

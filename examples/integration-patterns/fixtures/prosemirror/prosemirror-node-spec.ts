import type { NodeSpec } from "prosemirror-model";

export const oEmbedNodeSpec: NodeSpec = {
  atom: true,
  attrs: {
    url: { default: "" },
  },
  draggable: true,
  group: "block",
  parseDOM: [
    {
      getAttrs(dom) {
        if (!(dom instanceof HTMLElement)) {
          return false;
        }

        const url = dom.getAttribute("url");

        return typeof url === "string" && url.length > 0 ? { url } : false;
      },
      tag: "o-embed[url]",
    },
  ],
  selectable: true,
  toDOM(node) {
    return ["o-embed", { url: node.attrs.url }];
  },
};

import type { Descendant } from "slate";

export const SAMPLE_URL = "https://youtu.be/Bd8_vO5zrjo";

export type OEmbedElementNode = {
  children: [{ text: "" }];
  type: "oEmbed";
  url: string;
};

export function createEmbedElement(url: string): OEmbedElementNode {
  return {
    children: [{ text: "" }],
    type: "oEmbed",
    url,
  };
}

export function serializeSlateDocument(nodes: Descendant[]): string {
  return nodes
    .map((node) => {
      if ("type" in node && node.type === "oEmbed") {
        const url = "url" in node ? String(node.url) : "";
        return `<o-embed url="${url}"></o-embed>`;
      }

      if ("children" in node) {
        const text = node.children
          .map((child) => ("text" in child ? child.text : ""))
          .join("");
        return `<p>${text}</p>`;
      }

      return "";
    })
    .join("");
}

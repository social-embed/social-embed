import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";

type CustomText = { text: string };

type ParagraphElement = {
  children: CustomText[];
  type: "paragraph";
};

type OEmbedElement = {
  children: CustomText[];
  type: "oEmbed";
  url: string;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: OEmbedElement | ParagraphElement;
    Text: CustomText;
  }
}

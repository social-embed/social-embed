import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

/**
 * Dark theme for CodeMirror using the site palette + UI vars.
 * { dark: true } tells CodeMirror to apply "&dark" base defaults.
 */
const darkTheme = EditorView.theme(
  {
    ".cm-activeLine": {
      backgroundColor:
        "color-mix(in oklch, var(--color-panel-bg), var(--color-mv-blue) 12%)",
    },
    ".cm-activeLineGutter": {
      backgroundColor:
        "color-mix(in oklch, var(--color-panel-header), var(--color-mv-blue) 16%)",
    },
    ".cm-content": {
      caretColor: "var(--color-fg)",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "var(--color-fg)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-panel-header)",
      color: "var(--color-muted)",
    },
    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor:
        "color-mix(in oklch, var(--color-panel-bg), var(--color-mv-blue) 28%)",
    },
    "&": {
      backgroundColor: "var(--color-panel-bg)",
      color: "var(--color-fg)",
    },
  },
  { dark: true },
);

/**
 * Syntax highlighting using the site color swatches tuned for dark mode.
 */
const darkHighlightStyle = HighlightStyle.define([
  { color: "var(--color-mv-purple-300)", tag: t.keyword },
  { color: "var(--color-mv-yellow-300)", tag: t.string },
  { color: "var(--color-mv-blue-300)", tag: t.number },
  { color: "var(--color-mv-orange-300)", tag: t.bool },
  { color: "var(--color-mv-muted)", tag: t.null },
  { color: "var(--color-mv-fg)", tag: t.propertyName },
  { color: "var(--color-mv-muted)", fontStyle: "italic", tag: t.comment },
  { color: "var(--color-mv-red-300)", tag: t.tagName },
  { color: "var(--color-mv-purple-400)", tag: t.attributeName },
  { color: "var(--color-mv-yellow-300)", tag: t.attributeValue },
]);

export const seDark: Extension = [
  darkTheme,
  syntaxHighlighting(darkHighlightStyle),
];

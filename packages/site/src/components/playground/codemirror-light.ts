import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

/**
 * Light theme for CodeMirror using the site palette + UI vars.
 * { dark: false } tells CodeMirror to apply "&light" base defaults.
 */
const lightTheme = EditorView.theme(
  {
    ".cm-activeLine": {
      backgroundColor: "var(--color-mv-blue-50)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--color-mv-blue-100)",
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
      backgroundColor: "var(--color-mv-blue-200)",
    },
    "&": {
      backgroundColor: "var(--color-panel-bg)",
      color: "var(--color-fg)",
    },
  },
  { dark: false },
);

/**
 * Syntax highlighting using the site color swatches.
 */
const lightHighlightStyle = HighlightStyle.define([
  { color: "var(--color-mv-purple-700)", tag: t.keyword },
  { color: "var(--color-mv-yellow-700)", tag: t.string },
  { color: "var(--color-mv-blue-700)", tag: t.number },
  { color: "var(--color-mv-orange-700)", tag: t.bool },
  { color: "var(--color-mv-muted)", tag: t.null },
  { color: "var(--color-mv-fg)", tag: t.propertyName },
  { color: "var(--color-mv-muted)", fontStyle: "italic", tag: t.comment },
  { color: "var(--color-mv-red-600)", tag: t.tagName },
  { color: "var(--color-mv-purple-600)", tag: t.attributeName },
  { color: "var(--color-mv-yellow-700)", tag: t.attributeValue },
]);

export const seLight: Extension = [
  lightTheme,
  syntaxHighlighting(lightHighlightStyle),
];

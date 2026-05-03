import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { seDark } from "./codemirror-dark";
import { seLight } from "./codemirror-light";

interface ReadonlyCodeProps {
  code: string;
  language?: "html" | "javascript";
  className?: string;
}

/** Base theme shared by both light and dark modes. */
const baseTheme = EditorView.theme({
  ".cm-activeLine": {
    backgroundColor: "transparent",
  },
  ".cm-content": {
    fontFamily: "var(--font-ibm-plex-mono), monospace",
    lineHeight: "1.625",
    padding: "1rem",
  },
  ".cm-gutters": {
    display: "none",
  },
  ".cm-line": {
    padding: "0",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-ibm-plex-mono), monospace",
    overflow: "auto",
  },
  "&": {
    fontSize: "0.75rem",
    height: "auto",
  },
});

/**
 * Lightweight readonly CodeMirror editor for displaying code snippets
 * with syntax highlighting. Uses the same seDark/seLight themes as
 * the playground CodeEditor.
 */
export function ReadonlyCode({
  code,
  language = "html",
  className = "",
}: ReadonlyCodeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  });

  // Watch for theme changes on <html data-theme="...">
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const update = () => {
      setResolvedTheme(
        root.getAttribute("data-theme") === "light" ? "light" : "dark",
      );
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, {
      attributeFilter: ["data-theme"],
      attributes: true,
    });
    return () => observer.disconnect();
  }, []);

  // Create editor on mount / recreate on theme change
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: code,
      extensions: [
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        language === "html" ? html() : javascript(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        baseTheme,
        resolvedTheme === "dark" ? seDark : seLight,
      ],
    });

    const view = new EditorView({
      parent: containerRef.current,
      state,
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [code, language, resolvedTheme]);

  return (
    <div
      className={`overflow-hidden rounded-lg ${className}`}
      ref={containerRef}
    />
  );
}

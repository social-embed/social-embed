import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import {
  bracketMatching,
  defaultHighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { useEffect, useLayoutEffect, useRef } from "react";

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "html" | "javascript";
  theme?: "light" | "dark";
  className?: string;
  readOnly?: boolean;
}

/**
 * CodeMirror 6 editor wrapper for React.
 * Manages EditorView lifecycle manually since no native React wrapper exists.
 */
export function CodeEditor({
  value,
  onChange,
  language = "html",
  theme = "dark",
  className = "",
  readOnly = false,
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const isInternalChange = useRef(false);
  const isExternalSync = useRef(false);

  // Keep onChange ref updated
  onChangeRef.current = onChange;

  // Create editor on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: value is intentionally excluded to avoid destroying editor on every keystroke
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const extensions = [
      EditorState.readOnly.of(readOnly),
      lineNumbers(),
      EditorView.editable.of(!readOnly),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      history(),
      bracketMatching(),
      closeBrackets(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
      language === "html" ? html() : javascript(),
      EditorView.updateListener.of((update) => {
        // Only fire onChange for user edits, not external syncs
        if (update.docChanged && !isExternalSync.current) {
          isInternalChange.current = true;
          onChangeRef.current(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        ".cm-content": {
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          padding: "8px 0",
        },
        ".cm-gutters": {
          borderRight: "none",
        },
        ".cm-scroller": {
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          overflow: "auto",
        },
        "&": {
          fontSize: "13px",
          height: "100%",
        },
      }),
    ];

    if (theme === "dark") {
      extensions.push(oneDark);
    }

    const state = EditorState.create({
      doc: value,
      extensions,
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
  }, [language, theme, readOnly]);

  // Sync value from props (external changes)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    // Skip if this is an internal change (from typing)
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      // Mark as external sync so updateListener doesn't fire onChange
      isExternalSync.current = true;
      view.dispatch({
        changes: { from: 0, insert: value, to: currentDoc.length },
      });
      isExternalSync.current = false;
    }
  }, [value]);

  return (
    <div className={`h-full overflow-hidden ${className}`} ref={containerRef} />
  );
}

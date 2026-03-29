import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createOEmbedNode,
  OEmbedExtension,
  SAMPLE_URL,
  serializeEmbedTag,
} from "./embedExtension";

export function App() {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [serializedHtml, setSerializedHtml] = useState(
    "<p>Paste a URL or insert a sample embed.</p>",
  );
  const sampleMarkup = useMemo(() => serializeEmbedTag(SAMPLE_URL), []);
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = serializedHtml;
    }
  }, [serializedHtml]);
  const editor = useEditor({
    content: "<p>TipTap rich-text content</p>",
    extensions: [StarterKit, OEmbedExtension],
    immediatelyRender: false,
    onCreate({ editor: currentEditor }) {
      setSerializedHtml(currentEditor.getHTML());
    },
    onUpdate({ editor: currentEditor }) {
      setSerializedHtml(currentEditor.getHTML());
    },
  });

  function insertSampleEmbed() {
    if (!editor) {
      return;
    }

    editor.chain().focus().insertContent(createOEmbedNode(SAMPLE_URL)).run();
    setSerializedHtml(editor.getHTML());
  }

  return (
    <main
      data-testid="app-root"
      style={{
        fontFamily: "sans-serif",
        margin: "0 auto",
        maxWidth: 960,
        padding: 24,
      }}
    >
      <h1>TipTap Rich Text Embed Example</h1>
      <p>
        This example keeps one editor node shape and one serialized output
        shape: <code>{sampleMarkup}</code>
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button
          data-testid="insert-embed"
          onClick={insertSampleEmbed}
          type="button"
        >
          Insert Sample Embed
        </button>
      </div>

      <section
        style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}
      >
        <div>
          <h2>Editor</h2>
          <div
            style={{ border: "1px solid #ccc", minHeight: 200, padding: 12 }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>

        <div>
          <h2>Serialized HTML</h2>
          <pre
            data-testid="serialized-html"
            style={{
              background: "#f6f6f6",
              minHeight: 200,
              overflowX: "auto",
              padding: 12,
              whiteSpace: "pre-wrap",
            }}
          >
            {serializedHtml}
          </pre>
        </div>
      </section>

      <section>
        <h2>Rendered Preview</h2>
        <div
          data-testid="preview"
          ref={previewRef}
          style={{
            border: "1px solid #ccc",
            marginTop: 8,
            minHeight: 120,
            padding: 12,
          }}
        />
      </section>
    </main>
  );
}

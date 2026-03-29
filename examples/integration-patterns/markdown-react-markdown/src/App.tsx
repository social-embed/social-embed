import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { DEFAULT_MARKDOWN, sanitizeMarkdownSource } from "./markdownHelpers";

export function App() {
  const [source, setSource] = useState(DEFAULT_MARKDOWN);
  const [allowEmbed, setAllowEmbed] = useState(false);
  const sanitizedSource = useMemo(
    () => sanitizeMarkdownSource(source, allowEmbed),
    [allowEmbed, source],
  );

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
      <h1>Markdown and Sanitizer Example</h1>
      <p>
        This example toggles whether the sanitizer keeps <code>o-embed</code> in
        markdown source.
      </p>

      <label style={{ display: "block", marginBottom: 16 }}>
        <input
          checked={allowEmbed}
          data-testid="allow-embed"
          onChange={(event) => {
            setAllowEmbed(event.currentTarget.checked);
          }}
          type="checkbox"
        />{" "}
        Allow <code>o-embed</code> in DOMPurify
      </label>

      <section
        style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}
      >
        <div>
          <h2>Markdown Source</h2>
          <textarea
            data-testid="markdown-input"
            onChange={(event) => {
              setSource(event.currentTarget.value);
            }}
            style={{ minHeight: 220, width: "100%" }}
            value={source}
          />
        </div>

        <div>
          <h2>Sanitized Source</h2>
          <pre
            data-testid="sanitized-source"
            style={{
              background: "#f6f6f6",
              minHeight: 220,
              overflowX: "auto",
              padding: 12,
              whiteSpace: "pre-wrap",
            }}
          >
            {sanitizedSource}
          </pre>
        </div>
      </section>

      <section>
        <h2>Rendered Preview</h2>
        <div
          data-testid="preview"
          style={{
            border: "1px solid #ccc",
            marginTop: 8,
            minHeight: 120,
            padding: 12,
          }}
        >
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {sanitizedSource}
          </ReactMarkdown>
        </div>
      </section>
    </main>
  );
}

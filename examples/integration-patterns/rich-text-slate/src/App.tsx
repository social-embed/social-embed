import React, { useMemo, useState } from "react";
import { createEditor, Transforms, type Descendant } from "slate";
import {
  Editable,
  type RenderElementProps,
  Slate,
  withReact,
} from "slate-react";
import {
  createEmbedElement,
  type OEmbedElementNode,
  SAMPLE_URL,
  serializeSlateDocument,
} from "./slateHelpers";

const initialValue: Descendant[] = [
  {
    children: [{ text: "Slate rich-text content" }],
    type: "paragraph",
  } as Descendant,
];

function EmbedElement(
  props: RenderElementProps & { element: OEmbedElementNode },
) {
  const { attributes, children, element } = props;
  return (
    <div
      {...attributes}
      contentEditable={false}
      style={{ background: "#f6f6f6", border: "1px solid #ccc", padding: 8 }}
    >
      Embed node: {element.url}
      {children}
    </div>
  );
}

export function App() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const serializedHtml = useMemo(() => serializeSlateDocument(value), [value]);

  function insertEmbed() {
    Transforms.insertNodes(editor, createEmbedElement(SAMPLE_URL));
    const nextValue = editor.children as Descendant[];
    setValue([...nextValue]);
  }

  return (
    <main data-testid="app-root" style={{ fontFamily: "sans-serif", margin: "0 auto", maxWidth: 960, padding: 24 }}>
      <h1>Slate Rich Text Embed Example</h1>
      <p>
        This example uses one custom element node and one serialized tag shape.
      </p>

      <button data-testid="insert-embed" onClick={insertEmbed} type="button">
        Insert Sample Embed
      </button>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
        <div>
          <h2>Editor</h2>
          <div style={{ border: "1px solid #ccc", minHeight: 200, padding: 12 }}>
            <Slate
              editor={editor}
              initialValue={initialValue}
              onChange={(nextValue) => {
                setValue(nextValue);
              }}
            >
              <Editable
                renderElement={(props) => {
                  if (props.element.type === "oEmbed") {
                    return (
                      <EmbedElement
                        {...(props as RenderElementProps & {
                          element: OEmbedElementNode;
                        })}
                      />
                    );
                  }

                  return <p {...props.attributes}>{props.children}</p>;
                }}
              />
            </Slate>
          </div>
        </div>

        <div>
          <h2>Serialized HTML</h2>
          <pre data-testid="serialized-html" style={{ background: "#f6f6f6", minHeight: 200, overflowX: "auto", padding: 12, whiteSpace: "pre-wrap" }}>
            {serializedHtml}
          </pre>
        </div>
      </div>

      <section>
        <h2>Rendered Preview</h2>
        <div
          data-testid="preview"
          style={{ border: "1px solid #ccc", marginTop: 8, minHeight: 120, padding: 12 }}
          dangerouslySetInnerHTML={{ __html: serializedHtml }}
        />
      </section>
    </main>
  );
}

import createDOMPurify from "dompurify";

export const DEFAULT_MARKDOWN = `Watch the demo:

<o-embed url="https://youtu.be/Bd8_vO5zrjo"></o-embed>

Continue reading...`;

export function sanitizeMarkdownSource(
  source: string,
  allowEmbed: boolean,
  windowObject: Window = window,
): string {
  const purify = createDOMPurify(
    windowObject as unknown as Parameters<typeof createDOMPurify>[0],
  );

  if (!allowEmbed) {
    return purify.sanitize(source);
  }

  return purify.sanitize(source, {
    ADD_ATTR: ["url"],
    ADD_TAGS: ["o-embed"],
  });
}

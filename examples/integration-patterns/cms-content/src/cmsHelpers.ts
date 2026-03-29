export const STORED_HTML_BODY =
  '<p>Check this out:</p><o-embed url="https://youtu.be/Bd8_vO5zrjo"></o-embed>';

export const STORED_EMBED_URL = "https://youtu.be/Bd8_vO5zrjo";

export function renderStructuredEmbed(url: string): string {
  return `<o-embed url="${url}"></o-embed>`;
}

export function getCmsPreviewHtml() {
  return {
    htmlBody: STORED_HTML_BODY,
    structuredBody: renderStructuredEmbed(STORED_EMBED_URL),
  };
}

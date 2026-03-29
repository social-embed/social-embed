/**
 * In production, stored content should be validated or sanitized before
 * injection into the DOM to prevent XSS.
 */
export type StoredEmbed =
  | { kind: "html-body"; html: string }
  | { kind: "url-field"; url: string }
  /** Legacy records that predate structured storage — handle explicitly. */
  | { kind: "legacy-plain-text"; text: string };

export const CMS_RECORDS: StoredEmbed[] = [
  {
    html: '<p>Check this out:</p><o-embed url="https://youtu.be/Bd8_vO5zrjo"></o-embed>',
    kind: "html-body",
  },
  {
    kind: "url-field",
    url: "https://youtu.be/Bd8_vO5zrjo",
  },
  {
    kind: "legacy-plain-text",
    text: "https://youtu.be/Bd8_vO5zrjo",
  },
];

export function renderStoredEmbed(record: StoredEmbed): string {
  switch (record.kind) {
    case "html-body":
      return record.html;
    case "url-field":
      return `<o-embed url="${record.url}"></o-embed>`;
    case "legacy-plain-text":
      // Legacy records contain a raw URL — wrap in o-embed for rendering.
      return `<o-embed url="${record.text}"></o-embed>`;
  }
}

/** @deprecated Use CMS_RECORDS and renderStoredEmbed instead. */
export function getCmsPreviewHtml() {
  const htmlRecord = CMS_RECORDS.find((r) => r.kind === "html-body") as Extract<
    StoredEmbed,
    { kind: "html-body" }
  >;
  const urlRecord = CMS_RECORDS.find((r) => r.kind === "url-field") as Extract<
    StoredEmbed,
    { kind: "url-field" }
  >;
  return {
    htmlBody: htmlRecord.html,
    structuredBody: renderStoredEmbed(urlRecord),
  };
}

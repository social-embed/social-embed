/**
 * HTML/Attribute escaping utilities.
 *
 * @remarks
 * These functions escape special characters to prevent XSS attacks
 * when embedding user-provided data into HTML attributes.
 *
 * For our use case (iframe src URLs and attributes), we need to
 * escape the standard HTML entities to ensure safe rendering.
 */

/**
 * Characters that must be escaped in HTML content.
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  "'": "&#39;",
  '"': "&quot;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
};

/**
 * Regex matching characters that need HTML escaping.
 */
const HTML_ESCAPE_REGEX = /[&<>"']/g;

/**
 * Escape a string for safe inclusion in HTML content.
 *
 * @param str - The string to escape
 * @returns The escaped string
 *
 * @remarks
 * Escapes: & < > " '
 *
 * @example
 * ```typescript
 * escapeHtml('<script>alert("xss")</script>')
 * // => '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(
    HTML_ESCAPE_REGEX,
    (char) => HTML_ESCAPE_MAP[char] ?? char,
  );
}

/**
 * Escape a string for safe inclusion in an HTML attribute value.
 *
 * @param str - The string to escape
 * @returns The escaped string
 *
 * @remarks
 * This is an alias for escapeHtml() as the same characters need
 * escaping in both contexts. The distinction is semantic - use
 * escapeAttr() when escaping attribute values for clarity.
 *
 * @example
 * ```typescript
 * const url = 'https://example.com?foo=1&bar=2';
 * `<iframe src="${escapeAttr(url)}"></iframe>`
 * // => '<iframe src="https://example.com?foo=1&amp;bar=2"></iframe>'
 * ```
 */
export function escapeAttr(str: string): string {
  return escapeHtml(str);
}

/**
 * Render an object of attributes to an HTML attribute string.
 *
 * @param attrs - Object of attribute name-value pairs
 * @returns HTML attribute string (with leading space if non-empty)
 *
 * @remarks
 * - Empty string values render as boolean attributes (e.g., `allowfullscreen`)
 * - All values are escaped for safety
 * - Returns empty string if no attributes
 *
 * @example
 * ```typescript
 * renderAttributes({
 *   src: 'https://youtube.com/embed/abc',
 *   width: '560',
 *   height: '315',
 *   allowfullscreen: '',
 * })
 * // => ' src="https://youtube.com/embed/abc" width="560" height="315" allowfullscreen'
 * ```
 */
export function renderAttributes(attrs: Record<string, string>): string {
  const entries = Object.entries(attrs);
  if (entries.length === 0) return "";

  const parts = entries.map(([name, value]) => {
    // Boolean attribute (empty string value)
    if (value === "") {
      return name;
    }
    return `${name}="${escapeAttr(value)}"`;
  });

  return ` ${parts.join(" ")}`;
}

/**
 * Render an iframe element to an HTML string.
 *
 * @param src - The iframe src URL
 * @param attrs - Additional attributes for the iframe
 * @returns Complete iframe HTML element
 *
 * @example
 * ```typescript
 * renderIframe('https://youtube.com/embed/abc', {
 *   width: '560',
 *   height: '315',
 *   allowfullscreen: '',
 *   frameborder: '0',
 * })
 * // => '<iframe src="..." width="560" height="315" allowfullscreen frameborder="0"></iframe>'
 * ```
 */
export function renderIframe(
  src: string,
  attrs: Record<string, string> = {},
): string {
  const allAttrs = { src, ...attrs };
  return `<iframe${renderAttributes(allAttrs)}></iframe>`;
}

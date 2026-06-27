import { satteriCollectHastText } from "@astrojs/markdown-satteri";
import GithubSlugger from "github-slugger";
import { defineHastPlugin } from "satteri";

/**
 * Sätteri hast plugin: set each heading's `id` and append a hover anchor link,
 * mirroring the rehypeHeadingIds + rehype-autolink-headings chain the unified
 * pipeline runs on the default branch.
 *
 * It runs before Sätteri's built-in heading-ids plugin, which reuses the `id`
 * we set here (so slugs stay github-slugger-identical and existing deep links
 * keep working) and still collects the heading into the table of contents.
 *
 * The anchor's `#` glyph is supplied by CSS (`.anchor-icon::before`) rather
 * than a text node, so the built-in plugin's `textContent()` pass keeps the
 * ToC labels clean instead of picking up a trailing `#`.
 *
 * Factory form: a fresh GithubSlugger per compile so per-document slug
 * de-duplication resets between pages.
 */
export function satteriHeadingAnchors() {
  const slugger = new GithubSlugger();
  return defineHastPlugin({
    element: {
      filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
      visit(node, ctx) {
        const existing = node.properties?.id;
        const rawText = ctx.textContent(node);
        const text = rawText.includes("frontmatter")
          ? satteriCollectHastText(node, ctx.data.astro?.frontmatter)
          : rawText;
        const slug =
          typeof existing === "string" ? existing : slugger.slug(text);
        if (typeof existing !== "string") {
          ctx.setProperty(node, "id", slug);
        }
        ctx.appendChild(node, {
          children: [
            {
              children: [],
              properties: { ariaHidden: "true", className: ["anchor-icon"] },
              tagName: "span",
              type: "element",
            },
          ],
          properties: { className: ["anchor-link"], href: `#${slug}` },
          tagName: "a",
          type: "element",
        });
      },
    },
    name: "heading-anchors",
  });
}

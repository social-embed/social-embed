import { defineHastPlugin } from "satteri";

interface AstroData {
  frontmatter?: { skipMarkdownTitle?: boolean };
}

/**
 * Sätteri hast plugin: drop the first `<h1>` when frontmatter sets
 * `skipMarkdownTitle: true`. Used when importing a README whose own title
 * duplicates the layout's `frontmatter.title` heading.
 *
 * Runs before {@link satteriHeadingAnchors} (and the built-in heading-ids), so
 * the removed title never receives an id/anchor or a table-of-contents entry.
 *
 * Factory form: the `removed` flag resets per document.
 */
export function satteriSkipFirstHeading() {
  let removed = false;
  return defineHastPlugin({
    element: {
      filter: ["h1"],
      visit(node, ctx) {
        if (removed) return;
        const astro = ctx.data.astro as AstroData | undefined;
        if (!astro?.frontmatter?.skipMarkdownTitle) return;
        removed = true;
        ctx.removeNode(node);
      },
    },
    name: "skip-first-heading",
  });
}

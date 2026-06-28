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
        const parent = ctx.parent(node);
        if (parent?.type !== "root") return;
        const astro = ctx.data.astro as AstroData | undefined;
        if (!astro?.frontmatter?.skipMarkdownTitle) return;
        removed = true;
        // Capture the blank line the dropped title leaves behind, then remove
        // both — matching the deleted rehype plugin's whitespace cleanup.
        const index = ctx.indexOf(node);
        const blank =
          index === undefined ? undefined : parent.children[index + 1];
        ctx.removeNode(node);
        if (blank?.type === "text" && /^\s*$/.test(blank.value)) {
          ctx.removeNode(blank);
        }
      },
    },
    name: "skip-first-heading",
  });
}

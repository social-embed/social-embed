import type { Element, Root } from "hast";
import type { VFile } from "vfile";

interface AstroVFileData {
  astro?: {
    frontmatter?: {
      skipMarkdownTitle?: boolean;
    };
  };
}

/**
 * Rehype plugin to remove the first h1 heading from content.
 * Controlled by `skipMarkdownTitle: true` in frontmatter.
 *
 * Use case: When importing a README.md that has its own h1 title,
 * but the layout already renders an h1 from frontmatter.title,
 * this plugin prevents duplicate h1 headings.
 */
export function rehypeSkipFirstHeading() {
  return (tree: Root, file: VFile) => {
    const data = file.data as AstroVFileData;
    if (!data.astro?.frontmatter?.skipMarkdownTitle) return;

    // Find and remove first h1 at root level
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === "element" && (node as Element).tagName === "h1") {
        tree.children.splice(i, 1);

        // Also remove any immediately following whitespace-only text node
        // This prevents leftover newlines from appearing in output
        while (
          i < tree.children.length &&
          tree.children[i].type === "text" &&
          /^\s*$/.test((tree.children[i] as { value: string }).value)
        ) {
          tree.children.splice(i, 1);
        }

        break;
      }
    }
  };
}

/**
 * Generates a nested table of contents from flat heading array.
 * Converts Astro's flat MarkdownHeading[] to a hierarchical tree.
 */

export interface ToCItem {
  depth: number;
  slug: string;
  text: string;
  children: ToCItem[];
}

export interface ToCOptions {
  /** Minimum heading level to include (default: 2 = h2) */
  minLevel?: number;
  /** Maximum heading level to include (default: 3 = h3) */
  maxLevel?: number;
}

interface MarkdownHeading {
  depth: number;
  slug: string;
  text: string;
}

/**
 * Convert a flat list of headings into a nested tree structure.
 *
 * @example
 * // Input: [h2, h3, h3, h2, h3]
 * // Output: [
 * //   { h2, children: [h3, h3] },
 * //   { h2, children: [h3] }
 * // ]
 */
export function generateToC(
  headings: MarkdownHeading[],
  options: ToCOptions = {},
): ToCItem[] {
  const { minLevel = 2, maxLevel = 3 } = options;

  // Filter headings to only include those within the level range
  const filtered = headings.filter(
    (h) => h.depth >= minLevel && h.depth <= maxLevel,
  );

  const result: ToCItem[] = [];
  const stack: ToCItem[] = [];

  for (const heading of filtered) {
    const item: ToCItem = {
      children: [],
      depth: heading.depth,
      slug: heading.slug,
      text: heading.text,
    };

    // Pop items from stack until we find a parent with smaller depth
    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      // No parent - this is a top-level item
      result.push(item);
    } else {
      // Add as child of the last item on the stack
      stack[stack.length - 1].children.push(item);
    }

    stack.push(item);
  }

  return result;
}

/**
 * Flatten nested ToC back into a flat array (useful for iteration).
 */
export function flattenToC(items: ToCItem[]): ToCItem[] {
  const result: ToCItem[] = [];

  function traverse(tocItems: ToCItem[]) {
    for (const item of tocItems) {
      result.push(item);
      if (item.children.length > 0) {
        traverse(item.children);
      }
    }
  }

  traverse(items);
  return result;
}

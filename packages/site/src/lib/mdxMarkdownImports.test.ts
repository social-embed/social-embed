// @vitest-environment node

import { readFile } from "node:fs/promises";
import { glob } from "glob";
import { describe, expect, it } from "vitest";

describe("MDX files importing markdown", () => {
  it("do not require manual getHeadings re-export (plugin handles it)", async () => {
    const mdxFiles = await glob("src/content/docs/**/*.mdx", {
      absolute: true,
      cwd: process.cwd(),
    });

    const filesWithMarkdownImports: string[] = [];

    for (const filePath of mdxFiles) {
      const content = await readFile(filePath, "utf-8");

      // Check if file imports from a .md file
      const markdownImportMatch = content.match(
        /import\s+(\w+).*from\s+['"]([^'"]+\.md)['"]/,
      );

      if (markdownImportMatch) {
        const relativePath = filePath.replace(`${process.cwd()}/`, "");
        filesWithMarkdownImports.push(relativePath);

        // Verify NO manual re-export (plugin handles this automatically)
        const hasManualExport = /export\s*\{\s*getHeadings\s*\}/.test(content);
        expect(
          hasManualExport,
          `${relativePath} has manual getHeadings re-export which is no longer needed.\n` +
            "  The vite-plugin-mdx-merge-headings plugin handles this automatically.\n" +
            "  Remove: export { getHeadings };",
        ).toBe(false);
      }
    }

    // Note: overview pages were rewritten with dedicated content (no README imports).
    // This test now validates that any remaining .md imports don't have manual re-exports.
    // It's valid for filesWithMarkdownImports to be empty if no MDX files import .md files.
  });
});

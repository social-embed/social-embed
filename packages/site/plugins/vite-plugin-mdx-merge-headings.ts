/**
 * Vite plugin that automatically merges headings from imported .md files
 * into the parent MDX file's getHeadings() export.
 *
 * Problem: When MDX files import and render markdown components like
 * `<README />`, Astro's rehype-collect-headings only sees the MDX AST,
 * not the imported markdown's headings. This means ToC doesn't work.
 *
 * Solution: This plugin post-processes compiled MDX to inject imports for
 * getHeadings from each .md file and rewrites getHeadings() to merge them.
 *
 * Before:
 *   import README from "../README.md";
 *   export function getHeadings() { return [] }
 *
 * After:
 *   import README from "../README.md";
 *   import { getHeadings as __mdHeadings0__ } from "../README.md";
 *   export function getHeadings() { return [...[], ...__mdHeadings0__()] }
 */
import { init, parse as parseEsm } from "es-module-lexer";
import MagicString from "magic-string";
import type { Plugin } from "vite";

/**
 * Find the full extent of a JSON array starting at position,
 * handling nested brackets and strings properly.
 *
 * The naive regex `[\s\S]*?]` fails because lazy matching stops at the
 * first `]`, but JSON arrays can contain `]` inside strings or nested arrays.
 */
function findArrayEnd(code: string, start: number): number {
  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let i = start; i < code.length; i++) {
    const char = code[i];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (char === "\\" && inString) {
      isEscaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "[") depth++;
    if (char === "]") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }

  return -1;
}

export function viteMdxMergeHeadings(): Plugin {
  return {
    enforce: "post",
    name: "vite-plugin-mdx-merge-headings",

    async transform(code: string, id: string) {
      // Only process MDX files
      if (!id.endsWith(".mdx")) return;

      // Skip if already has manual re-export (backward compatibility)
      if (/export\s*\{\s*getHeadings\s*\}/.test(code)) return;

      await init;
      const [imports] = parseEsm(code);

      // Find .md imports
      const mdImports = imports.filter((imp) => imp.n?.endsWith(".md"));
      if (mdImports.length === 0) return;

      // Find existing getHeadings export using proper bracket matching
      const fnMatch = code.match(
        /export function getHeadings\(\)\s*\{\s*return\s*/,
      );
      if (!fnMatch || fnMatch.index === undefined) return;

      const fnMatchIndex = fnMatch.index;
      const arrayStart = fnMatchIndex + fnMatch[0].length;
      const arrayEnd = findArrayEnd(code, arrayStart);
      if (arrayEnd === -1) return;

      // Find the closing brace of the function
      const fnEnd = code.indexOf("}", arrayEnd);
      if (fnEnd === -1) return;

      const originalArray = code.slice(arrayStart, arrayEnd);
      const fullMatch = code.slice(fnMatchIndex, fnEnd + 1);

      const s = new MagicString(code);

      // Build imports for getHeadings from each .md file
      const aliasImports: string[] = [];
      const headingCalls: string[] = [];

      mdImports.forEach((imp, i) => {
        const alias = `__mdHeadings${i}__`;
        aliasImports.push(
          `import { getHeadings as ${alias} } from ${JSON.stringify(imp.n)};`,
        );
        headingCalls.push(`...${alias}()`);
      });

      // Insert imports after last existing import
      const lastImportEnd = Math.max(...imports.map((i) => i.se));
      s.appendLeft(lastImportEnd, `\n${aliasImports.join("\n")}`);

      // Replace getHeadings to merge imported headings
      const newGetHeadings = `export function getHeadings() { return [...${originalArray}, ${headingCalls.join(", ")}] }`;
      s.overwrite(
        fnMatchIndex,
        fnMatchIndex + fullMatch.length,
        newGetHeadings,
      );

      return { code: s.toString(), map: s.generateMap({ hires: true }) };
    },
  };
}

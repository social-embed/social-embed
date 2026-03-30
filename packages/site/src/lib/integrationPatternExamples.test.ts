// @vitest-environment node

import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  integrationPatternExamples,
  integrationPatternSectionTitles,
} from "@examples/integration-patterns/manifest";
import { describe, expect, it } from "vitest";

const repoRoot = join(import.meta.dirname, "../../../..");
const integrationPatternsDocPath = join(
  repoRoot,
  "packages/site/src/content/docs/02-integration-patterns.mdx",
);

describe("integration pattern examples manifest", () => {
  it("covers every top-level section in the docs page", async () => {
    const source = await readFile(integrationPatternsDocPath, "utf8");
    const headings = Array.from(source.matchAll(/^##\s+(.+)$/gm))
      .map((match) => match[1].trim())
      .sort();

    expect(headings).toEqual(
      Object.values(integrationPatternSectionTitles).sort(),
    );
  });

  it("includes at least one example per docs section", () => {
    const sectionsWithExamples = new Set(
      integrationPatternExamples.map(
        (example: (typeof integrationPatternExamples)[number]) =>
          example.section,
      ),
    );

    for (const sectionId of Object.keys(integrationPatternSectionTitles)) {
      expect(
        sectionsWithExamples.has(
          sectionId as keyof typeof integrationPatternSectionTitles,
        ),
      ).toBe(true);
    }
  });

  it("points only at files that exist in the repo", async () => {
    for (const example of integrationPatternExamples) {
      for (const filePath of example.files) {
        await expect(access(join(repoRoot, filePath))).resolves.toBeUndefined();
      }
    }
  });
});

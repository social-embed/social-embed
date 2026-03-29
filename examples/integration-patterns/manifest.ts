export type ExampleKind = "fixture" | "runnable";

export type IntegrationPatternExample = {
  description: string;
  files: string[];
  githubPath: string;
  id: string;
  kind: ExampleKind;
  section:
    | "database-cms-content"
    | "markdown-and-mdx"
    | "rich-text-editors"
    | "server-side-validation";
  title: string;
};

export const integrationPatternExamples: IntegrationPatternExample[] = [
  {
    description:
      "TipTap + ProseMirror rich-text editor example that serializes embeds to one stable tag.",
    files: ["examples/integration-patterns/rich-text-tiptap"],
    githubPath: "examples/integration-patterns/rich-text-tiptap",
    id: "rich-text-tiptap",
    kind: "runnable",
    section: "rich-text-editors",
    title: "TipTap Rich Text",
  },
  {
    description:
      "Slate rich-text editor example that renders a custom embed element and serialized HTML output.",
    files: ["examples/integration-patterns/rich-text-slate"],
    githubPath: "examples/integration-patterns/rich-text-slate",
    id: "rich-text-slate",
    kind: "runnable",
    section: "rich-text-editors",
    title: "Slate Rich Text",
  },
  {
    description:
      "Reference ProseMirror node spec matching the rich-text docs section.",
    files: [
      "examples/integration-patterns/fixtures/prosemirror/oembed-node.ts",
    ],
    githubPath:
      "examples/integration-patterns/fixtures/prosemirror/oembed-node.ts",
    id: "prosemirror-node-spec",
    kind: "fixture",
    section: "rich-text-editors",
    title: "ProseMirror Node Spec",
  },
  {
    description:
      "React Markdown and DOMPurify example showing raw HTML pass-through and sanitizer allowlists.",
    files: ["examples/integration-patterns/markdown-react-markdown"],
    githubPath: "examples/integration-patterns/markdown-react-markdown",
    id: "markdown-react-markdown",
    kind: "runnable",
    section: "markdown-and-mdx",
    title: "Markdown + Sanitizer",
  },
  {
    description:
      "Astro/MDX reference fixture matching the docs-site markdown integration pattern.",
    files: ["examples/integration-patterns/fixtures/markdown/astro-post.mdx"],
    githubPath:
      "examples/integration-patterns/fixtures/markdown/astro-post.mdx",
    id: "astro-mdx-fixture",
    kind: "fixture",
    section: "markdown-and-mdx",
    title: "Astro / MDX Fixture",
  },
  {
    description:
      "Hugo markdown fixture showing the same inline o-embed content pattern.",
    files: ["examples/integration-patterns/fixtures/markdown/hugo-post.md"],
    githubPath: "examples/integration-patterns/fixtures/markdown/hugo-post.md",
    id: "hugo-fixture",
    kind: "fixture",
    section: "markdown-and-mdx",
    title: "Hugo Fixture",
  },
  {
    description:
      "Jekyll markdown fixture showing the same inline o-embed content pattern.",
    files: ["examples/integration-patterns/fixtures/markdown/jekyll-post.md"],
    githubPath:
      "examples/integration-patterns/fixtures/markdown/jekyll-post.md",
    id: "jekyll-fixture",
    kind: "fixture",
    section: "markdown-and-mdx",
    title: "Jekyll Fixture",
  },
  {
    description:
      "Structured content and stored HTML example for database and CMS rendering flows.",
    files: ["examples/integration-patterns/cms-content"],
    githubPath: "examples/integration-patterns/cms-content",
    id: "cms-content",
    kind: "runnable",
    section: "database-cms-content",
    title: "CMS Content",
  },
  {
    description:
      "Provider allowlist example using @social-embed/lib for server-side validation decisions.",
    files: ["examples/integration-patterns/server-validation"],
    githubPath: "examples/integration-patterns/server-validation",
    id: "server-validation",
    kind: "runnable",
    section: "server-side-validation",
    title: "Server-side Validation",
  },
];

export const integrationPatternSectionTitles = {
  "database-cms-content": "Database / CMS content",
  "markdown-and-mdx": "Markdown and MDX",
  "rich-text-editors": "Rich text editors",
  "server-side-validation": "Server-side validation",
} as const;

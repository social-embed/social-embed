export type ExampleKind = "runnable" | "fixture";
export type ExampleTier = "core" | "community";

export const integrationPatternSectionTitles = {
  "database-cms-content": "Database / CMS content",
  "framework-agnostic": "Vanilla TS",
  "markdown-and-mdx": "Markdown / MDX",
  "raw-html": "Raw HTML / No Framework",
  "rich-text-editors": "Rich text editors",
  "server-side-validation": "Server-side validation",
  "spa-frameworks-ssr": "SPA Frameworks / SSR",
} as const;

export type SectionId = keyof typeof integrationPatternSectionTitles;

type ExampleBase = {
  id: string;
  title: string;
  description: string;
  /** One-line answer to "what does this solve?" Shown on browse cards. */
  problemSolved: string;
  section: SectionId;
  githubPath: string;
  /** 'core' = actively maintained, blocks CI. 'community' = best-effort. */
  tier: ExampleTier;
};

export type RunnableExample = ExampleBase & {
  kind: "runnable";
  /** Root directory path — used by StackBlitz link builder and smoke runner. */
  files: [string];
  /** Required: consumed by smoke runner. */
  devPort: number;
  /** Optional: StackBlitz ?file= param for better initial view. */
  stackblitzOpenFile?: string;
};

export type FixtureExample = ExampleBase & {
  kind: "fixture";
  /** Individual files users should copy — not directories. */
  files: string[];
};

export type IntegrationPatternExample = RunnableExample | FixtureExample;

export function isRunnable(e: IntegrationPatternExample): e is RunnableExample {
  return e.kind === "runnable";
}

export function isFixture(e: IntegrationPatternExample): e is FixtureExample {
  return e.kind === "fixture";
}

export const integrationPatternExamples: IntegrationPatternExample[] = [
  {
    description:
      "TipTap + ProseMirror rich-text editor example that serializes embeds to one stable tag.",
    devPort: 4311,
    files: ["examples/integration-patterns/rich-text-tiptap"],
    githubPath: "examples/integration-patterns/rich-text-tiptap",
    id: "rich-text-tiptap",
    kind: "runnable",
    problemSolved:
      "Store one embed node in a TipTap editor and serialize it to a stable <o-embed> tag.",
    section: "rich-text-editors",
    stackblitzOpenFile: "src/embedExtension.ts",
    tier: "core",
    title: "TipTap Rich Text",
  },
  {
    description:
      "Slate rich-text editor example that renders a custom embed element and serialized HTML output.",
    devPort: 4312,
    files: ["examples/integration-patterns/rich-text-slate"],
    githubPath: "examples/integration-patterns/rich-text-slate",
    id: "rich-text-slate",
    kind: "runnable",
    problemSolved:
      "Define a custom Slate element for embeds and serialize editor content to <o-embed> HTML.",
    section: "rich-text-editors",
    stackblitzOpenFile: "src/slateHelpers.ts",
    tier: "core",
    title: "Slate Rich Text",
  },
  {
    description:
      "Reference TipTap node spec matching the rich-text docs section.",
    files: [
      "examples/integration-patterns/fixtures/tiptap/tiptap-node-spec.ts",
    ],
    githubPath:
      "examples/integration-patterns/fixtures/tiptap/tiptap-node-spec.ts",
    id: "tiptap-node-spec",
    kind: "fixture",
    problemSolved:
      "Copy-paste TipTap Node.create() definition for an oEmbed block node.",
    section: "rich-text-editors",
    tier: "community",
    title: "TipTap Node Spec",
  },
  {
    description:
      "Native ProseMirror node spec showing the smallest useful o-embed block definition.",
    files: [
      "examples/integration-patterns/fixtures/prosemirror/prosemirror-node-spec.ts",
    ],
    githubPath:
      "examples/integration-patterns/fixtures/prosemirror/prosemirror-node-spec.ts",
    id: "prosemirror-node-spec",
    kind: "fixture",
    problemSolved:
      "Copy-paste a native ProseMirror NodeSpec that parses and serializes one stable <o-embed> block node.",
    section: "rich-text-editors",
    tier: "community",
    title: "ProseMirror Node Spec",
  },
  {
    description:
      "React Markdown and DOMPurify example showing raw HTML pass-through and sanitizer allowlists.",
    devPort: 4313,
    files: ["examples/integration-patterns/markdown-react-markdown"],
    githubPath: "examples/integration-patterns/markdown-react-markdown",
    id: "markdown-react-markdown",
    kind: "runnable",
    problemSolved:
      "Render <o-embed> tags in a react-markdown pipeline by allowing them through DOMPurify.",
    section: "spa-frameworks-ssr",
    stackblitzOpenFile: "src/markdownHelpers.ts",
    tier: "core",
    title: "React Markdown + Sanitizer",
  },
  {
    description:
      "SvelteKit example showing how to use the web component with SSR.",
    devPort: 4318,
    files: ["examples/integration-patterns/svelte-with-ssr"],
    githubPath: "examples/integration-patterns/svelte-with-ssr",
    id: "svelte-with-ssr",
    kind: "runnable",
    problemSolved:
      "Use <o-embed> in a SvelteKit app with server-side rendering.",
    section: "spa-frameworks-ssr",
    stackblitzOpenFile: "src/routes/+page.svelte",
    tier: "core",
    title: "SvelteKit + SSR",
  },
  {
    description:
      "Astro/MDX reference fixture matching the docs-site markdown integration pattern.",
    files: ["examples/integration-patterns/fixtures/markdown/astro-post.mdx"],
    githubPath:
      "examples/integration-patterns/fixtures/markdown/astro-post.mdx",
    id: "astro-mdx-fixture",
    kind: "fixture",
    problemSolved: "Show inline <o-embed> usage inside an Astro MDX post.",
    section: "markdown-and-mdx",
    tier: "community",
    title: "Astro / MDX Fixture",
  },
  {
    description:
      "Hugo markdown fixture showing the same inline o-embed content pattern.",
    files: ["examples/integration-patterns/fixtures/markdown/hugo-post.md"],
    githubPath: "examples/integration-patterns/fixtures/markdown/hugo-post.md",
    id: "hugo-fixture",
    kind: "fixture",
    problemSolved: "Show inline <o-embed> usage inside a Hugo post.",
    section: "markdown-and-mdx",
    tier: "community",
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
    problemSolved: "Show inline <o-embed> usage inside a Jekyll post.",
    section: "markdown-and-mdx",
    tier: "community",
    title: "Jekyll Fixture",
  },
  {
    description:
      "Structured content and stored HTML example for database and CMS rendering flows.",
    devPort: 4314,
    files: ["examples/integration-patterns/cms-content"],
    githubPath: "examples/integration-patterns/cms-content",
    id: "cms-content",
    kind: "runnable",
    problemSolved:
      "Store embeds as HTML body or structured URL fields and render them with <o-embed>.",
    section: "database-cms-content",
    stackblitzOpenFile: "src/cmsHelpers.ts",
    tier: "core",
    title: "CMS Content",
  },
  {
    description:
      "Provider allowlist example using @social-embed/lib for server-side validation decisions.",
    devPort: 4315,
    files: ["examples/integration-patterns/server-validation"],
    githubPath: "examples/integration-patterns/server-validation",
    id: "server-validation",
    kind: "runnable",
    problemSolved:
      "Validate user-submitted URLs against a provider allowlist before storing or rendering.",
    section: "server-side-validation",
    stackblitzOpenFile: "src/validationHelpers.ts",
    tier: "core",
    title: "Server-side Validation",
  },
  {
    description:
      "Vanilla TypeScript example combining Zod schema validation, provider recognition, and an explicit allow list.",
    devPort: 4316,
    files: ["examples/integration-patterns/vanilla-ts-with-validation"],
    githubPath: "examples/integration-patterns/vanilla-ts-with-validation",
    id: "vanilla-ts-with-validation",
    kind: "runnable",
    problemSolved:
      "Validate embed URLs through three gates (format, provider, allow list) with no framework dependency.",
    section: "framework-agnostic",
    stackblitzOpenFile: "src/validationHelpers.ts",
    tier: "core",
    title: "Vanilla TS + Zod Validation",
  },
  {
    description:
      "Demonstrates the simplest possible integration of <o-embed>: a plain HTML page loading the web component from a CDN.",
    devPort: 4317,
    files: ["examples/integration-patterns/raw-html"],
    githubPath: "examples/integration-patterns/raw-html",
    id: "raw-html",
    kind: "runnable",
    problemSolved:
      "Use <o-embed> without any build tools, frameworks, or bundlers.",
    section: "raw-html",
    stackblitzOpenFile: "index.html",
    tier: "core",
    title: "Raw HTML",
  },
].sort((a, b) => a.title.localeCompare(b.title));

# Rich Text — Slate

Repo path: `examples/integration-patterns/rich-text-slate`

Expected StackBlitz GitHub-subdir URL pattern: `https://stackblitz.com/fork/github/social-embed/social-embed/tree/<branch-or-tag>/examples/integration-patterns/rich-text-slate?file=src%2FslateHelpers.ts`

Use this when:
- You are adding embed support to a Slate-based rich text editor
- You need a custom void element type for embeds with typed narrowing
- You serialize Slate content to HTML and expect `<o-embed url="..."></o-embed>` in the output

Steal these files:
- `src/slateHelpers.ts` — `OEmbedElementNode` type, `isOEmbedElement()` guard, `serializeSlateDocument()` for HTML output

Production notes:
- Slate does not do paste-rule magic — hook `onPaste` (or an `insertData` plugin) to detect pasted URLs and call `Transforms.insertNodes` with an oEmbed element
- `isOEmbedElement()` is the narrowing gate; use it before accessing `.url` to keep TypeScript happy and avoid runtime crashes
- `serializeSlateDocument()` throws on unknown node types — add a branch for each custom element you introduce

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Run unit tests:

```bash
pnpm test:unit
```

Run browser tests:

```bash
pnpm test:browser
```

Run all tests:

```bash
pnpm test
```

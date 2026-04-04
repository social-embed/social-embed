# Rich Text — TipTap

Repo path: `examples/integration-patterns/rich-text-tiptap`

Expected StackBlitz GitHub-subdir URL pattern: `https://stackblitz.com/fork/github/social-embed/social-embed/tree/<branch-or-tag>/examples/integration-patterns/rich-text-tiptap?file=src%2FembedExtension.ts`

Use this when:
- You are adding embed support to a TipTap-based rich text editor
- You need paste-to-embed (URLs pasted into the editor become `<o-embed>` nodes automatically)
- You serialize editor content to HTML and expect `<o-embed url="..."></o-embed>` in the output

Steal these files:
- `src/embedExtension.ts` — TipTap `Node` extension: block node definition, paste rule, `insertOEmbed` command, HTML parse/render

Production notes:
- The paste rule uses `\S+` to catch any URL; scope it to known provider patterns to avoid auto-embedding every link
- `atom: true` prevents the cursor from entering the embed node — remove it only if you need inline editing inside the node
- Serialized HTML is safe to store; `<o-embed>` renders only when `@social-embed/wc` is loaded on the reading side

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

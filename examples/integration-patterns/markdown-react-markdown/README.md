# Markdown — react-markdown

Use this when:
- You render Markdown to React and want `<o-embed>` custom elements to survive the sanitizer
- You need a toggle showing the difference between stripped and allowed embed output

Steal these files:
- `src/App.tsx` — `allowedElements` / `unwrapDisallowed` config that keeps `<o-embed>` while stripping unsafe HTML

Production notes:
- `rehype-sanitize` (used internally by react-markdown when `allowElement` is not set) strips unknown elements by default — you must explicitly allow `o-embed`
- Pass `allowedAttributes: { "o-embed": ["url"] }` to limit which attributes survive sanitization
- The `allowEmbed` toggle in this example defaults to `true`; adjust to match your content trust model

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

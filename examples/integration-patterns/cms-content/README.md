# CMS Content

Use this when:
- Your CMS stores embeds in different shapes (raw HTML body, structured URL field, or legacy plain text) and you need a single render path
- You want a typed discriminated union to replace stringly-typed content records

Steal these files:
- `src/cmsHelpers.ts` — `StoredEmbed` discriminated union (`html-body | url-field | legacy-plain-text`), `renderStoredEmbed()` switch

Production notes:
- Add a `legacy-plain-text` branch in your union for content rows that pre-date structured storage; the `renderStoredEmbed()` switch exhaustively handles all cases
- `renderStoredEmbed()` produces raw HTML strings — use `innerHTML` only in contexts you control (server-side or trusted CMS); sanitize before injecting into user-visible pages
- Migrate `legacy-plain-text` rows at write-time when you can; the branch is a transitional shim, not a permanent pattern

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

# Vanilla TS + Zod Validation

Use this when:
- You need a framework-agnostic starting point that validates embed URLs before rendering
- You want three explicit validation gates: URL format (Zod), provider recognition, and an allow list
- You want a discriminated union result type so TypeScript narrows the success and failure branches without casting

Steal these files:
- `src/validationHelpers.ts` — `EmbedValidationResult` discriminated union, Zod schema, `validateAndBuildEmbed()` combining format, provider, and allow-list checks

Production notes:
- Replace `ALLOWED_PROVIDERS` with your own list; restricting to specific providers is a security decision, not a library default
- Zod validates URL format before hitting the provider registry — this means format errors surface as user-friendly messages before any URL parsing happens
- `convertUrlToEmbedUrl()` canonicalizes short-form URLs (e.g. `youtu.be`) into embeddable form; always use the returned `embedUrl` in your `<o-embed>` tag, not the raw input

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

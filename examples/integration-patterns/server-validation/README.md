# Server-side Validation

Repo path: `examples/integration-patterns/server-validation`

Expected StackBlitz GitHub-subdir URL pattern: `https://stackblitz.com/fork/github/social-embed/social-embed/tree/<branch-or-tag>/examples/integration-patterns/server-validation?file=src%2FvalidationHelpers.ts`

Use this when:
- You need to accept embed URLs from users and must reject unknown providers before storing or rendering
- You want a discriminated-union result type so TypeScript narrows `providerName` and `reason` without casting

Steal these files:
- `src/validationHelpers.ts` — `EmbedValidationResult` discriminated union, `validateEmbedUrl()` using `@social-embed/lib`

Production notes:
- `getProviderFromUrl()` matches against the social-embed provider registry — it does not make network requests, so it is safe to call on every keystroke or at request-handler time
- `convertUrlToEmbedUrl()` canonicalizes short-form URLs (e.g. `youtu.be`) into embeddable `youtube.com/embed/` form; always use the returned `embedUrl`, not the raw input, when building the `<o-embed>` tag
- The `isValid: false` branch carries `providerName: null` — model this explicitly so callers cannot accidentally read `providerName` without checking `isValid` first

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

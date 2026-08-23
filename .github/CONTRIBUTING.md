# Contributing

Thanks for looking. `@social-embed/lib` and `@social-embed/wc` are published
and used; `packages/site` is not. Bug reports with a reproduction URL, and
notes on where an attribute or a provider behaves differently than documented,
are the most useful things to open right now.

How this project writes prose — README, changelog, commit messages, TSDoc, and
source comments — is set out separately in [WRITING.md](WRITING.md). Read that
before changing any of it. The constraints every change is held to, and the
map of what is where, are in [AGENTS.md](../AGENTS.md).

## Getting set up

This is a pnpm workspace. Node 26 is what this repository develops against
(`.nvmrc`); `engines` requires `>=22`, and CI additionally verifies 22.x and
24.x on every push.

```console
$ pnpm install
```

`packages/wc` tests run in a real Chromium via Playwright. Install the browser
once before running them:

```console
$ pnpm --filter @social-embed/wc exec playwright install chromium
```

## The gates

CI (`.github/workflows/node-ci.yaml`) is the order of record, and it runs
exactly these, across the Node matrix above:

```console
$ pnpm biome format .
```

```console
$ pnpm biome lint .
```

```console
$ pnpm biome check .
```

```console
$ pnpm build
```

```console
$ pnpm test
```

`biome check` runs Biome's own combined format-and-lint pass; it is unrelated
to the root `check` script below despite the shared name.

The following exist and are useful locally, but CI does not run them today —
a red result here does not block a push, though it should still get fixed:

Recursive `tsc --noEmit` per package, plus `astro check` for the site:

```console
$ pnpm run check
```

`packages/site`'s `check` script currently fails: `astro check` needs a
TypeScript programmatic API that the TypeScript 7 native compiler does not
ship yet (tracked upstream at
[withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321)).
`packages/site/package.json`'s `type-check` script works around this with a
plain `tsc` project (`tsconfig.typecheck.json`) that covers every `.ts`/`.tsx`
file but not `.astro` templates — see the comment at the top of
`packages/site/tsconfig.typecheck.json` for the exact gap. Restore `astro
check` directly with `pnpm --filter @social-embed/site type-check:astro` once
TypeScript 7.1 ships the API.

Type-aware lint via oxlint (lib and wc) plus the TS7 workaround above (site):

```console
$ pnpm run type-check
```

Unused exports, files, and dependencies:

```console
$ pnpm run knip
```

`packages/wc` also lints its Lit templates, which `biome lint` does not parse:

```console
$ pnpm --filter @social-embed/wc run lint:lit-analyzer
```

Before claiming a test or a gate works, show it failing. A gate that has never
been red is an assumption.

## Tests

Each package runs Vitest directly (`vitest run`), not a wrapper:

- `packages/lib`: Node environment. `test/*.test-d.ts` are type-only
  assertions, run through Vitest's `typecheck` option (`checker: "tsc"`), not
  executed as JavaScript.
- `packages/wc`: browser environment via `@vitest/browser-playwright`
  (Chromium, headless). `test/browser-setup.ts` registers `<o-embed>` once
  before the suite; `test/utils.ts` exports a `fixture()` helper that mounts
  an HTML template into the document and waits a tick for custom-element
  upgrade — reach for it instead of `document.createElement` plus manual
  wiring. `pretest` builds `@social-embed/lib` first, since `wc` imports it.
- `packages/site`: `happy-dom` environment, for React-island and Astro
  content-collection tests.

Run one package's suite with `--filter`:

```console
$ pnpm --filter @social-embed/lib test
```

Run a single file — the most-needed, least-documented command — by passing
its path through the same way:

```console
$ pnpm --filter @social-embed/lib test src/utils.test.ts
```

The root `pnpm test` recurses into all three packages
(`pnpm run --recursive test`); use the per-package form above when debugging
one package instead of waiting on the others.

## Documentation

`packages/site` is an Astro + Starlight site. The root `docs`, `docs:serve`,
and `docs:gen:watch` scripts recurse into a script name no package defines and
fail (`[ERR_PNPM_RECURSIVE_RUN_NO_SCRIPT]`) — use the site's own scripts
instead:

```console
$ pnpm --filter @social-embed/site dev
```

```console
$ pnpm --filter @social-embed/site build
```

```console
$ pnpm --filter @social-embed/site preview
```

Do not hand-edit `packages/site/src/content/docs/news.md`,
`packages/site/src/content/docs/lib/release-notes.md`, or
`packages/site/src/content/docs/wc/release-notes.md` — each is a symlink to a
`CHANGES.md` (see [WRITING.md](WRITING.md#the-changelog)); edit the
`CHANGES.md` and the site page follows.

## Releasing

Never create tags. Never push tags. The owner handles tagging and tag pushes.

No workflow in `.github/workflows/` publishes to npm — `cdn-preview.yml` and
`deploy-site.yml` build and deploy static assets to S3/CloudFront, and
`node-ci.yaml` never runs `npm publish` or `pnpm publish`. Publishing
`@social-embed/lib` and `@social-embed/wc` is a manual step the owner runs
locally; `prepublishOnly` builds each package first. Release tags are
per-package: `@social-embed/lib@0.1.0-next.11`,
`@social-embed/wc@0.1.0-next.13`. See
[Release commits](WRITING.md#release-commits).

## Pull requests

One subject per pull request. Unrelated cleanup found along the way belongs in
its own commit, and usually in its own pull request.

Discuss a substantial change via an issue before making it.

Commit format is in [WRITING.md](WRITING.md#commits).

## Decorum

- Participants will be tolerant of opposing views.
- Participants must ensure that their language and actions are free of
  personal attacks and disparaging personal remarks.
- When interpreting the words and actions of others, participants should
  always assume good intentions.
- Behaviour which can be reasonably considered harassment will not be
  tolerated.

Based on
[Ruby's Community Conduct Guideline](https://www.ruby-lang.org/en/conduct/).

## Security

Please do not open a public issue for a vulnerability. This repository has
private vulnerability reporting enabled — use the "Report a vulnerability"
button under the repository's Security tab.

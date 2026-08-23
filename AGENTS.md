# AGENTS.md

social-embed converts a pasted media URL (YouTube, Vimeo, Spotify, and more)
into a stable `<o-embed url="...">` tag and renders the right `<iframe>` at
display time.

Follow the conventions already in the tree, and keep a change scoped to what
was asked for.

## What is here

| Path                 | What it is                                                    |
| --------------------- | -------------------------------------------------------------- |
| `packages/lib`        | `@social-embed/lib` — URL detection and embed-URL generation, published, zero deps |
| `packages/wc`         | `@social-embed/wc` — the `<o-embed>` Lit custom element, published, depends on `lib` |
| `packages/site`       | `@social-embed/site` — social-embed.org, Astro + Starlight, private, not published |
| `packages/site/AGENTS.md` | Site-scoped agent guidance (layouts, theme system, components) |
| `CHANGES.md`, `packages/{lib,wc}/CHANGES.md` | Per-package changelogs, symlinked into the site as release notes |

## Which policy applies

- Documentation, user-facing text, the changelog, commit messages, TSDoc,
  source comments, and `<o-embed>` attribute/slot conventions:
  [.github/WRITING.md](.github/WRITING.md)
- Environment, the gates, tests, documentation builds, releases, and pull
  requests: [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md)

Each of those is the single home for its subject. Where a rule seems to be
stated twice, the file listed above is the one that governs.

## Change discipline

- Make the smallest coherent change that solves the verified problem; keep
  unrelated cleanup out of it.
- Reuse an existing file, helper, API, or test before adding a new one.
- Add a file only for a durable boundary — a distinct responsibility,
  independent reuse, or splitting an oversized module — not for a single-use
  helper or a one-line re-export.
- Add a test for every user-visible behaviour change, and a changelog entry
  for every change to a published package's API, CLI, configuration, or
  output.
- A passing gate is evidence only once it has been shown capable of failing.
  Pair a new test with a deliberate break that proves it bites.

`packages/site`'s `check` gate (`astro check`) is red under the TypeScript 7
native compiler until TypeScript 7.1 ships the programmatic API `astro check`
needs; `pnpm run type-check` is the working substitute. See
[CONTRIBUTING.md#the-gates](.github/CONTRIBUTING.md#the-gates). `lib` and `wc`
publish to npm; nothing in `.github/workflows/` does it — publishing is a
manual step the repository owner runs locally.

## References

- Docs and live examples: <https://social-embed.org/>
- `@social-embed/lib` on npm: <https://www.npmjs.com/package/@social-embed/lib>
- `@social-embed/wc` on npm: <https://www.npmjs.com/package/@social-embed/wc>

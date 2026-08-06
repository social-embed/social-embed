# Biome → oxc migration

Record of the toolchain cutover on branch `oxc`. Every number below came from a
command run in this worktree; the command is given alongside so it can be
re-run rather than trusted.

## Toolchain after the migration

| Job | Tool | Config |
|---|---|---|
| Lint `.ts` `.tsx` `.astro` | oxlint | `.oxlintrc.json` |
| Format everything except `.astro` | oxfmt | `.oxfmtrc.json` |
| Format `.astro` frontmatter only | biome, retained and scoped | `biome.jsonc` |
| Type-check authority | `tsc --noEmit` | unchanged |
| Type-aware lint (opt-in) | oxlint + `oxlint-tsgolint` | `.oxlintrc.typeaware.json` |

Pinned versions (root `devDependencies`):

```
oxlint            ^1.76.0     caret is safe inside 1.x
oxfmt             0.61.0      EXACT — 0.x, weekly cadence, any output change is a repo-wide diff
oxlint-tsgolint   7.0.2001    EXACT — type-aware linting is outside oxlint's semver guarantee
@biomejs/biome    2.5.6       EXACT — biome.jsonc's $schema URL embeds the version
```

All four are in `.ncurc`'s `reject` list except `oxlint`, so `ncu -u` cannot
silently undo the pins. That file is bare JSON with no comments: npm-check-updates
parses an extensionless `.ncurc` as YAML, and a `//` line kills every `ncu`
invocation in the repo.

## Scope, measured

```
pnpm exec oxlint --debug files | wc -l     → 143   (40 .astro + 68 .ts + 35 .tsx)
pnpm exec oxfmt --check                    → 117 files
pnpm exec biome format .                   → 41 files
git ls-files '*.astro' | wc -l             → 40
```

Biome's 41 = the 40 `.astro` files plus `biome.jsonc` itself, which biome always
formats regardless of `files.includes`. That is exactly why `.oxfmtrc.json` has to
ignore it — see "Deadlock probe" below.

## Configuration

### `.oxlintrc.json`

`categories.correctness` is `"error"`. This is load-bearing, not cosmetic:
oxlint's out-of-the-box default is correctness at *warn* with exit code 0, so a
bare `oxlint` in CI would pass unconditionally. Proven below.

Rule selection is a port of the previous `biome.jsonc`: the recommended preset
plus the ten explicit `style` rules, mapped one by one. Family A settings
(printWidth 80, double quotes, semicolons) match biome's own defaults, which is
what the old config relied on, so `typescript/no-explicit-any`,
`typescript/no-non-null-assertion` and `react/no-array-index-key` are all
`"error"` here.

Three rules needed non-default options or an outright `"off"` to hold parity.
Each is commented in the file:

- `eslint/no-unused-vars` — oxlint does not honour a `_` prefix by default.
- `eslint/prefer-arrow-callback` — `{"allowNamedFunctions": true}`. Without it,
  `oxlint --fix` rewrites `memo(function Foo(…))` into an anonymous arrow and the
  component loses its inferred name in React DevTools and error stacks. Biome's
  `useArrowFunction` skips named function expressions; oxlint's default does not.
- `typescript/consistent-type-imports` — `{"disallowTypeAnnotations": false}`.
  The default bans inline `typeof import("…")`, which is the vitest
  `importOriginal<typeof import("./mod")>()` idiom (1 hit in
  `packages/site/src/components/lib-playground/LibPlayground.test.tsx`). Biome
  never touched that form.

Two correctness-category rules are `"off"` because they are materially stricter
than the biome rule they correspond to:

- `eslint/no-use-before-define` — biome's `noInvalidUseBeforeDeclaration` is
  TDZ-only; oxlint ships the full eslint rule.
- `jsx-a11y/prefer-tag-over-role` — 4 hits, all deliberate ARIA on custom
  widgets (`role="img"` on an emoji `<span>`, `role="listbox"`/`role="option"` on
  the Pagefind combobox). Biome's `a11y/useSemanticElements` is recommended and
  reports zero on the same files, verified with
  `pnpm exec biome lint packages/site/src/components/lib-playground/OutputDisplay.tsx packages/site/src/components/search/SearchResults.tsx`.

`react/exhaustive-deps` ships as `"warn"`, not `"error"` — it is stricter than
biome's `useExhaustiveDependencies`.

The `**/SearchResultItem.tsx` biome override (Pagefind excerpts are our own
indexed content, not user input) is ported as an oxlint override setting
`react/no-danger: "off"` on the same glob. The `**/*.css` biome override
(`noUnknownAtRules` off) has no oxlint counterpart and is dropped — oxlint cannot
lint CSS at all.

There is exactly one `.oxlintrc.json`, at the root. Nested configs **replace**
the root config rather than merging with it, which is the opposite of biome's
`extends: "//"`. This repo had none to remove.

### `.oxfmtrc.json`

Seeded with `pnpm exec oxfmt --migrate biome` against the pre-migration
`biome.jsonc`, then hand-edited. The migrator prints
`- "overrides" cannot be migrated automatically yet`; all three biome overrides
here are linter-only or assist-only, so nothing formatter-related was lost.

Hand-edits, each commented in the file:

1. `endOfLine: "lf"` — the migrator never writes it, and oxfmt reads
   `.editorconfig` unconditionally for any unset option where biome did not.
   This repo has no `.editorconfig`; pinning it means adding one later cannot
   silently change formatting.
2. `sortPackageJson: false` — defaults to *true*. Moot today (`**/package.json`
   is ignored, carried over from biome's `files.includes`) but pinned so removing
   that ignore later cannot silently reorder the four manifests.
3. `sortImports: false` — replaces biome's assist `organizeImports`, deferred to
   its own commit. The default inserts blank lines between import groups, which
   biome never did.
4. A `**/*.{css,scss,less,yaml,yml,md,mdx}` override forcing `singleQuote: false`.
   `singleQuote` is global in oxfmt and leaks into CSS and YAML; biome had a
   separate `css.formatter.quoteStyle` and never formatted YAML at all. A no-op
   in Family A, kept so flipping the global later cannot rewrite
   `@import "tailwindcss"` in `packages/site/src/tailwind.css`.
5. `**/biome.jsonc` + `**/biome.json` in `ignorePatterns`. Mandatory — see below.
6. `**/*.md`, `**/*.mdx`, `**/*.yaml`, `**/*.yml`, `**/*.html` ignored. oxfmt
   formats these; biome never did. That is new coverage, not a style change, and
   without the ignores it would dominate the diff (17 `.md` + 24 `.mdx` here, the
   `.mdx` being content-collection pages whose YAML frontmatter oxfmt rewrites).

### `biome.jsonc`

Reduced from 96 lines to 35, 23 of which are the header comment
(`wc -l biome.jsonc`). Linter disabled,
assist disabled, `files.includes` scoped to `["**/*.astro"]`, formatter options
identical to `.oxfmtrc.json` so `.astro` frontmatter cannot drift from the `.ts`
files beside it.

Biome 2.5 formats only the `---` frontmatter of an `.astro` file. The template,
`<script>` and `<style>` blocks are left byte-identical. `.astro` templates are
therefore unformatted by any tool in this repo, exactly as they effectively were
before the migration. oxfmt refuses `.astro` in every mode.

## Invariant probes

### Enforcement (`categories.correctness`)

```
pnpm exec oxlint -f default                        → exit 0, "Found 0 warnings and 0 errors."
printf '\ndebugger;\n' >> packages/lib/src/index.ts
pnpm exec oxlint -f default                        → exit 1, eslint(no-debugger)
git checkout -- packages/lib/src/index.ts
pnpm exec oxlint -f default                        → exit 0
```

`-f default` is required for any oxlint command whose output you read: oxlint
auto-selects the `agent` formatter under `AI_AGENT`/`CLAUDECODE`, where
`--print-config` produces no output at all.

### Formatter deadlock (`**/biome.jsonc` in oxfmt's ignores)

With the two `biome.jsonc` lines temporarily removed from `.oxfmtrc.json`:

```
pnpm exec oxfmt --list-different                   → biome.jsonc
```

oxfmt writes trailing commas into `.jsonc`; biome strips them from its own config
regardless of `files.includes`. Without the exclusion the two formatters fight
forever. With it restored:

```
pnpm exec oxfmt --list-different                   → (nothing), exit 0
pnpm exec oxfmt && pnpm exec oxfmt
pnpm exec biome format --write . && pnpm exec biome format --write .
git status --porcelain                             → unchanged
```

### Biome scope

```
printf 'export const   __probe    =     {a:1,   b:2}\n' > packages/lib/src/__probe.ts
pnpm exec biome format .                           → Checked 41 files (probe NOT among them)
pnpm exec oxfmt --check                            → flags the probe
```

Biome no longer claims `.ts`.

## Formatter cutover

`pnpm exec oxfmt` changed 4 files. Three divergence classes, all of them oxfmt
matching Prettier 3.9.6 and biome being the outlier:

- `packages/lib/src/index.ts` — a multi-line `export { a, b } from "./m"`
  collapses to one line when it fits.
- `packages/lib/test/utils.test-d.ts` — parentheses added around a function type
  inside a conditional type (`T extends ((val: unknown) => val is string) ? …`).
- `packages/wc/test/o-embed.test.ts` — trailing whitespace removed inside a
  lit-html tagged template. Whitespace between HTML attributes is insignificant;
  the `wc` suite still passes 51/51.
- `knip.jsonc` — trailing commas added. knip parses it fine (`pnpm run knip`
  produces byte-identical findings to the primary worktree).

`pnpm exec biome format --write .` then changed 1 file,
`packages/site/src/components/docs/Sidebar.astro`, because of the scope change
described under "Coverage changes".

## Suppression rewrite

`biome-ignore` comments are completely inert under oxlint — the string appears
nowhere in oxc's source, so the suppressed diagnostic silently reappears. All 9
live suppressions were rewritten or deleted:

| File | biome rule | outcome |
|---|---|---|
| `packages/wc/test/utils.ts:23` | `suspicious/noExplicitAny` | → `typescript/no-explicit-any` |
| `packages/wc/test/utils.ts:46` | `style/noNonNullAssertion` | deleted, rationale kept as prose |
| `packages/wc/test/utils.ts:75` | `style/noNonNullAssertion` | deleted, rationale kept as prose |
| `packages/site/vitest.config.ts:16` | `suspicious/noExplicitAny` | → `typescript/no-explicit-any` |
| `packages/site/src/components/playground/CodeEditor.tsx` | `correctness/useExhaustiveDependencies` | → `react/exhaustive-deps`, **moved** |
| `packages/site/src/components/playground/CdnSourcePicker.tsx` | `correctness/useExhaustiveDependencies` | → `react/exhaustive-deps`, **moved** |
| `packages/site/src/components/search/SearchResultItem.tsx:100` | (prose only) | reworded |
| `packages/site/src/components/search/SearchResultItem.tsx:101` | `a11y/noStaticElementInteractions` | → `jsx-a11y/no-static-element-interactions` |
| `packages/site/src/components/lib-playground/OutputDisplay.tsx` | `suspicious/noArrayIndexKey` | → `react/no-array-index-key` |

Two findings worth carrying to the next repo:

- **`exhaustive-deps` suppressions do not transfer positionally.** Biome anchors
  `useExhaustiveDependencies` at the hook call; oxlint anchors
  `react/exhaustive-deps` at the dependency array. A directive left where the
  `biome-ignore` was becomes an unused-directive warning while the real
  diagnostic still fires. Both were moved to sit immediately above `}, [deps]);`.
- **The two `noNonNullAssertion` suppressions became dead**, because the standard
  test override turns `typescript/no-non-null-assertion` off under `**/test/**`.
  Left in place they produced "Unused oxlint-disable directive" warnings, so the
  directive was dropped and the reason kept as an ordinary comment.

`options.reportUnusedDisableDirectives` is `"warn"`, which is how all four of
those were caught. It also surfaced a genuinely stale
`// eslint-disable-next-line @typescript-eslint/no-namespace` in
`packages/wc/src/OEmbedElement.ts` — a leftover from an ESLint setup that no
longer exists here. Removed, along with the dead root `.eslintrc.json` (a full
`@typescript-eslint` config with no `eslint` dependency anywhere in the repo).

## New diagnostics fixed or suppressed

oxlint lints `.astro` as a strict superset of what biome did: biome saw only the
`---` frontmatter, oxlint sees the frontmatter **and** every non-`src`
`<script>` block. That produced 7 diagnostics in code no linter had ever read:

- `packages/site/src/components/core/PureSearchButton.astro` — 4×
  `typescript/no-non-null-assertion` on `querySelector(…)!` in a custom-element
  constructor. Suppressed inline; the markup is rendered by the same component.
- `packages/site/src/components/core/PureSearchButton.astro` — 1×
  `eslint/no-unused-expressions` on `dialog.open ? closeModal() : openModal();`.
  **Fixed** as an `if`/`else`.
- `packages/site/src/components/mdx/Tabs.astro` — 1×
  `typescript/no-extraneous-class` and 1× `typescript/no-non-null-assertion`.
  Both suppressed inline; refactoring the static tab controller is out of scope.

`oxlint-disable-next-line` works inside `.astro` `<script>` blocks — verified by
the diagnostics disappearing.

One further diagnostic came from oxlint being stricter than biome outside
`.astro`: `eslint/no-script-url` fires on the bare string literal in
`expect(isValidUrl("javascript:alert(1)")).toBe(false)` in
`packages/lib/src/utils.test.ts`. Biome's `security/noScriptUrl` is recommended
and reports nothing there. Suppressed inline — the rule stays on, since the
hostile string is the point of that test.

## Coverage changes

**Gained: 7 `.astro` files that nothing linted or formatted before.** The old
`biome.jsonc` excluded `!**/docs`, aimed at the generated typedoc output
(`docs/` is gitignored in `packages/lib` and `packages/wc`). The glob also
swallowed `packages/site/src/components/docs/`, so its 7 `.astro` components were
invisible to biome. Confirmed against the old config:

```
pnpm exec biome format packages/site/src/components/docs/
  → "These paths were provided but ignored"
```

Rescoping `biome.jsonc` to `["**/*.astro"]` — required, or biome and oxfmt fight
— brings them back into biome's formatter, which is why `Sidebar.astro` shows a
formatting diff. `**/docs/**` was correspondingly left out of oxlint's
`ignorePatterns` so the linter matches. Both oxc tools honour `.gitignore`
automatically, so the generated typedoc output is still skipped.

## Scripts

Root:

| script | before | after |
|---|---|---|
| `lint` | `biome lint .` | `oxlint` |
| `lint:fix` | — | `oxlint --fix` |
| `lint:type-aware` | — | `oxlint -c .oxlintrc.typeaware.json --type-aware` |
| `format` | `pnpm run --recursive format` | `oxfmt && biome format --write .` |
| `format:check` | `biome format .` | `oxfmt --check && biome format .` |

`check` is **not** remapped to `lint && format:check` the way the fleet
convention suggests. In this repo `check` already means
`pnpm run --recursive check` (per-package `tsc --noEmit` / `astro check`) and has
nothing to do with biome. Left alone.

Per package: every `lint` / `biome` / biome-based `format` script deleted, and
`@biomejs/biome` removed from all three `devDependencies` blocks.

`packages/wc` is the exception the fleet playbook calls out: its `lint` was
`npm run lint:lit-analyzer && npm run lint:biome`. `lit-analyzer` is a real,
separate linter, so `lint` was reduced to the `lit-analyzer` invocation and only
`lint:biome` was deleted. (Note: nothing at the root or in CI invokes
`packages/wc`'s `lint` — that was already true before this migration.)

`--tsconfig tsconfig.json` was dropped from both `type-check` scripts.
Type-aware linting ignores it by design; oxlint's own help text says *"Type aware
linting does not respect this option, and will always discover the appropriate
tsconfig.json for each file automatically."*

## CI

`.github/workflows/node-ci.yaml` had three biome steps (`format`, `lint`,
`check`). They are replaced by: `Astro sync` → `Format check (oxfmt)` →
`Format check (.astro, biome)` → `Lint (oxlint)`.

Two type-check steps were **added**, because the workflow had none:
`pnpm run --recursive type-check` (oxlint `--type-check`) and
`pnpm run --recursive type-check:tsc` (the authority). Neither carries
`continue-on-error`.

`deploy-site.yml` and `cdn-preview.yml` were checked and contain no biome
invocations; they are unchanged.

## Layer 2 — type-aware linting

`.oxlintrc.typeaware.json`, run via `pnpm run lint:type-aware`. Opt-in and **not**
in CI. `typeCheck` stays `false`; `tsc --noEmit` remains the authority.

`typescript/prefer-readonly-parameter-types` and
`typescript/no-unsafe-type-assertion` are pinned `"off"` — across the pilots they
were 61–73% of all type-aware volume with minimal bug-finding value.

Preconditions checked:

```
pnpm --filter @social-embed/site exec astro sync
OXC_LOG=debug pnpm exec oxlint -c .oxlintrc.typeaware.json --type-aware 2>&1 \
  | rg 'Unmatched|tsconfig-error'
  → "Total programs: 4. Unmatched files: 0", no tsconfig-error
```

Reaching zero `tsconfig-error` required one fix. The root `tsconfig.json` set
`"moduleResolution": "node"`, which TypeScript 7 removed; tsgolint reports it as
`tsconfig-error`. It was already broken before this migration — at HEAD,
`pnpm exec tsc --noEmit -p tsconfig.json` reports
`TS5108: Option 'moduleResolution=node10' has been removed`. Nothing in the repo
runs tsc against the root project (every package has its own tsconfig and none
extends the root), which is why it went unnoticed. Changed to `"bundler"`, which
is what `packages/lib` and `packages/wc` already use.

Measured volume, after `astro sync`:

```
pnpm exec oxlint -c .oxlintrc.typeaware.json --type-aware -f default
  → Found 35 warnings and 118 errors.   (143 files, 256 rules)
```

| rule | count |
|---|---|
| `typescript/require-await` | 73 |
| `typescript/no-deprecated` (warn) | 35 |
| `typescript/unbound-method` | 30 |
| `typescript/no-misused-promises` | 5 |
| `typescript/promise-function-async` | 4 |
| `typescript/no-floating-promises` | 4 |
| `typescript/switch-exhaustiveness-check` | 1 |
| `typescript/prefer-optional-chain` | 1 |

`unbound-method` and `no-floating-promises` are not named in the config; they
arrive via `categories.correctness` once `typeAware` is on.

The volume is concentrated in test files —
`packages/site/src/components/search/SearchModal.test.tsx` alone accounts for 52
`require-await` and 19 `unbound-method`. None of this was fixed; the layer exists
to be triaged deliberately, one rule at a time.

## Verification

Every command below was run in this worktree after the final edit.

| gate | command | result |
|---|---|---|
| config | `pnpm exec oxlint --print-config -f default` | exit 0 |
| lint | `pnpm run lint` | exit 0, 0 warnings 0 errors, 143 files |
| format | `pnpm run format:check` | exit 0, oxfmt 117 files + biome 41 files |
| type-check | `pnpm run type-check` | exit 0 |
| type-check:tsc | `pnpm run type-check:tsc` | exit 0 |
| test | `pnpm test` | 349 passed (lib 83, wc 51, site 215), 0 failed |
| build | `pnpm run build` | exit 0 |
| install | `pnpm install --frozen-lockfile` | exit 0, "Already up to date" |
| ncu | `pnpm run ncu-local` | exit 0, reject list honoured |

Two commands are red, both **pre-existing**, both reproduced at the same commit
in the unmodified primary worktree:

- `pnpm run check` — `packages/site`'s `astro check` fails with *"The TypeScript
  module loaded (found 7.0.2) does not expose the programmatic API that
  `astro check` relies on."* This is the TS7 gap the repo already documents in
  `packages/site/tsconfig.typecheck.json` and in `type-check`'s own echo. Nothing
  in this migration touches that script, the astro version, or the TS pin.
- `pnpm run knip` — reports `@types/hast` as an unused devDependency plus one
  configuration hint about `pagefind`. Byte-identical findings before and after.
  Notably knip does **not** flag `oxlint`, `oxfmt` or `oxlint-tsgolint`: its
  first-class plugins found `.oxlintrc.json` and `.oxfmtrc.json`, which is why
  the lint config filename must stay `.oxlintrc.json` and not `.oxlintrc.jsonc`.

## What was lost

### All CSS linting

oxlint cannot lint CSS — `.css` is not a lintable extension and files are
silently skipped with no message. Biome's linter is off. This repo has 1 `.css`
file (`packages/site/src/tailwind.css`) and had zero CSS suppressions, so the
practical loss here is small, but the biome `**/*.css` override for
`noUnknownAtRules` is now dead config that was dropped.

CSS *formatting* is retained via oxfmt, and is strictly better: oxfmt parses
Tailwind v4 `theme()` syntax that biome aborts on.

Recovering CSS linting would cost one narrowly-scoped
`pnpm exec biome lint '**/*.css'` CI step and zero new dependencies. It is not in
this migration because it contradicts "biome is the `.astro` formatter only".

### Biome's four assist sorters

`organizeImports`, `useSortedKeys`, `useSortedAttributes` and
`useSortedProperties` were all `"on"`. The `biome check .` CI step that enforced
them is gone and nothing replaces it.

- `organizeImports` → oxfmt `sortImports`, deferred to its own commit.
- `useSortedKeys` on `package.json` → oxfmt `sortPackageJson`, also deferred.
- `useSortedAttributes` (JSX attributes) and `useSortedProperties` (CSS
  declarations) → **no oxc equivalent at any price.**

Non-destructive: oxc never *unsorts* existing code, so day-one churn is zero.
Only future enforcement is gone. Biome's `organizeImports` also sorted named
specifiers inside the braces; oxfmt's `sortImports` sorts statements, not
specifiers.

### Individual rules with no oxlint equivalent

- `style/useSingleVarDeclarator` — `eslint/one-var` is not implemented.
- `style/noUnusedTemplateLiteral` — needs `eslint/quotes`, not implemented.

Both were explicitly `"error"` in the old `biome.jsonc`.

### `.astro` type-aware linting

tsgolint gates on `SourceType::from_path`, which rejects `.astro`. 40 of the 143
files oxlint lints get zero type-aware coverage.

This repo is worse off than the rest of the fleet: `packages/site`'s `type-check`
deliberately does not run `astro check` (TS7 incompatibility, documented in the
script), so `.astro` frontmatter here is type-checked by nothing at all. That is
pre-existing and unrelated to this migration, but the migration removes the last
tool that would have noticed.

### SVG and HTML linting

Biome 2.5 lints standalone `.svg` and `.html`; oxlint lints neither. Moot — the
old `biome.jsonc` already excluded `!**/*.svg`.

## Deviations from the fleet playbook

1. **Root `check` was not remapped.** The playbook maps `check` to
   `pnpm run lint && pnpm run format:check`. Here `check` already means the
   recursive per-package type check and never invoked biome, so it was left
   alone. CI runs lint and format:check as separate steps.
2. **`**/docs/**` is deliberately absent from oxlint's `ignorePatterns`,** unlike
   the straight translation of biome's `files.includes`. See "Coverage changes".
3. **`jsx-a11y/prefer-tag-over-role` is pinned `"off"`.** Not in the canonical
   config because the pilots never hit it.
4. **`tsconfig.json`'s `moduleResolution` was changed** from `node` to `bundler`.
   Strictly a Layer 2 precondition fix, and the old value was already rejected by
   the repo's own TypeScript 7.
5. **CI gained two type-check steps** the workflow never had. Without them the
   `type-check` / `type-check:tsc` split is unenforced.
6. **`.ncurc` does not reject `typescript`.** The repo never held it, and the
   playbook says not to add a hold that did not exist.

## Remaining TODOs

- Triage the 153 Layer 2 diagnostics, starting with the 5
  `no-misused-promises` and 4 `no-floating-promises` hits, which are the only
  ones outside test files in any number.
- Land `sortImports` as `{"partitionByNewline": true, "newlinesBetween": false}`
  in its own commit, replacing biome's `organizeImports`.
- Opt markdown / MDX / YAML formatting in, one language per commit. oxfmt
  re-wraps fenced code blocks and rewrites YAML frontmatter, which can change
  rendered output for the 24 content-collection `.mdx` pages.
- Promote `react/exhaustive-deps` to `"error"` and
  `options.reportUnusedDisableDirectives` to `"error"`, then add
  `options.denyWarnings`.
- Decide whether to restore CSS linting via a scoped `biome lint '**/*.css'` step.
- Wire `packages/wc`'s `lint` (lit-analyzer) into CI. It has never run there.
- coc.nvim users: `:CocUninstall coc-biome` is *not* wanted — biome is still the
  `.astro` formatter — but `.vim/coc-settings.json` now also registers
  `oxlint --lsp` as a language server for js/ts/astro. Nothing formats `.ts` on
  save any more; run `pnpm format`.
- Revisit `astro check` when TypeScript 7.1 restores the programmatic API
  (withastro/roadmap#1321). That unblocks both `pnpm run check` and `.astro`
  frontmatter type-checking.

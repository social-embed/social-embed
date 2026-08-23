# Writing

How this project writes prose, for humans and agents alike. It governs
`README.md`, `CHANGES.md`, commit messages, TSDoc comments, source comments,
and the `@social-embed/wc` custom-element surface — every surface a reader
reaches.

For environment setup, the gates, and pull request workflow, see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Voice

Three surfaces, one voice. A TSDoc comment says what a caller may rely on; a
changelog entry says what changed; prose says what happens. All three are
present tense, lead with the thing being described, and stop. Why it was built
that way belongs in the commit message, which is timestamped and attached to
the diff.

The most useful editing operation is deleting the introductory sentence.

Lead with verbs and name concrete things. Put identifiers in backticks. Prefer
short declarative sentences, one operational fact each. Do not explain
TypeScript to TypeScript developers; do explain this project's semantics.

Types describe shape. Documentation describes meaning. A sentence that restates
a signature has said nothing.

Use MUST, SHOULD, and MAY only where the normative sense is meant. Say what
actually happens rather than that something is "supported".

Every sentence is load-bearing, every command runs as pasted, every claim is
checkable. A claim an agent can verify is a claim a staff engineer will trust.

| Instead of                       | Prefer                            |
| --------------------------------- | ---------------------------------- |
| "We added…"                      | "`convertUrlToEmbedUrl` now…"     |
| "New and improved"               | "`OEmbedElement.render` now…"     |
| "powerful", "seamless"           | state the capability              |
| "easily", "simply", "just"       | omit                              |
| "simple", "obvious", "intuitive" | omit                              |
| "robust"                         | name the failure that is handled  |
| "comprehensive"                  | name what is covered              |
| "production-ready"               | state the guarantee               |
| "optimized", "blazingly fast"    | give the magnitude                |
| "various fixes"                  | name the components               |
| "under the hood"                 | omit unless observable            |
| "please note that", "note that"  | state the fact                    |
| "leverage", "utilize"            | "use"                             |
| "delve into"                     | "read", or omit                   |
| "best practices"                 | name the practice                 |
| "in order to"                    | "to"                               |

"Blazingly fast" is now read as irony. If speed is the point, give the number.

## Who you are writing for

The default reader is fluent in TypeScript and new to this project. They can
read a signature; they cannot guess this project's semantics. Serve them first.

A second, smaller reader works *on* the project or against its lower layers —
adding a provider, touching the custom element's render path. Serve them too,
but mark their material opt-in — "for the rarer cases", "advanced" — so the
default reader knows they can stop.

A third reader is an agent executing the document. It does not skim, and it
cannot tell a placeholder from a command. Anything written as a command will be
run verbatim.

Rules that follow:

- **Second person, present tense, active.** "You register the element", not "An
  element is registered". Address the reader who is doing the thing.
- **Concept before API surface.** Open by saying what the export *is* and what
  it does for the reader. The signature is the last detail they need, not the
  first.
- **Say when they can stop.** Lead with the default and the reassurance. Let a
  skimmer leave after one paragraph.
- **Grant permission, do not demand attention.** "Reach for this when…" tells
  readers they are in the right place without implying they must read on.
- **Progressive disclosure.** Order by how many readers need it: the common
  call, then the one option a few will tune, then the lower-level primitive.
- **Name the trade-off.** If a call costs something — a bundle-size increase, a
  render pass, a network round trip — say so, and say what it buys. State it;
  do not sell it.

## README

A README is the shortest path from "what is this?" to competent use, not the
project's autobiography. It is the trailhead; depth lives on
[social-embed.org](https://social-embed.org/).

**The first screen is the whole pitch:** the name, one line stating the user
outcome, a before/after comparison, one install command, one usage line.
Everything a reader can skip goes after it.

The one-liner describes what the reader gets, not the architecture. A sentence
containing "monorepo", "framework", or "powered by" is describing the wrong
thing.

Usage before features. Show it working, then enumerate. A feature list before a
working example reads as vaporware.

Badges: zero to four, load-bearing. This repository's three —
`@social-embed/lib` version, `@social-embed/wc` version, license — each link
somewhere a reader would otherwise have to search for.

State the minimum Node version in prose, sourced from `engines` in the root
`package.json`, not from `.nvmrc` — `.nvmrc` pins the version this repository
develops against; `engines` states what a consumer needs.

Name the package, the import specifier, and the CDN script tag separately,
because `@social-embed/wc` ships all three and they are not interchangeable.

Document the semantic model: the URL-to-tag-to-iframe pipeline, dimension
resolution order, what happens when a URL matches no provider. `--help`-style
flag enumeration does not apply here — there is no CLI — but the same
principle does: state what is not obvious from the attribute name.

State defaults explicitly — defaults are API. State negative guarantees where
they exist: no backend, no API keys, no oEmbed server, zero runtime
dependencies for `@social-embed/lib`.

One paragraph of "why", maximum. Motivation, not manifesto.

Headings stay conventional and stable, because people deep-link them. Keep the
project's own H1.

No "please star". No roadmap promises.

## Documented examples that run

Examples are tests, or they are fiction. An example that rots is worse than
none.

No mechanism in this repository executes README or CHANGES.md examples today.
Vitest's `include` globs in `packages/lib/vitest.config.ts`,
`packages/wc/vitest.config.ts`, and `packages/site/vitest.config.ts` all scope
to `src/`, `test/`, and `plugins/`; none reads `README.md` or `CHANGES.md`.
`.test-d.ts` files type-check exported symbols via Vitest's `typecheck`
option (`checker: "tsc"`) — that is real, but it type-checks hand-written
assertions, not fenced examples. No `.github/workflows/*.yml` job extracts or
runs a code block. Treat every fenced example as unverified by tooling and
correct by inspection instead.

This is not a theoretical concern here: `packages/site` symlinks each
`CHANGES.md` directly into its content tree (see
[Changelog](#the-changelog)), so a broken example there does not just mislead
a reader of this repository — it ships to social-embed.org unexecuted. No
`README.md` is currently imported into the site — the Astro/MDX plugin
infrastructure supports importing a `.md` file with heading merging (see
`packages/site/plugins/vite-plugin-mdx-merge-headings.ts`), but
`mdxMarkdownImports.test.ts` confirms no page uses it today; the overview
pages that once imported the root `README.md` were rewritten with dedicated
content instead.

Whatever the mechanism, these hold:

- **Examples are executable, not illustrative.** Never `your-command
  <some-options>`, never a placeholder path the reader must decode.
- **Every command runs exactly as pasted**, with exact package names.
- **An example that cannot run is deleted, not commented out.**
- Imports in an example are the real public specifiers a consumer would write
  (`import { convertUrlToEmbedUrl } from "@social-embed/lib"`), not deep
  relative paths that only resolve inside the repository.

## Docstrings

TSDoc, and the prime directive: **never restate the type.** The signature is
the source of truth; the comment documents the contract — invariants, units,
edge behaviour, purity, ordering, error conditions. `@param file - The file` is
negative-value noise and should be deleted on sight.

Every exported symbol gets a doc comment, because it is API surface — both
package entry points (`packages/lib/src/index.ts`,
`packages/wc/src/OEmbedElement.ts`) are barrel files, so an undocumented export
there is undocumented public API. Internal code mostly gets none; a comment
that narrates is deleted under [Source comments](#source-comments).

- **The first sentence stands alone.** Tooling truncates at the first period.
- **`@throws` names the error class and the condition that triggers it** —
  `getWistiaIdFromUrl` throwing on a URL over 1000 characters is the pattern to
  follow.
- **`@deprecated` names the replacement and the version that removes it.**
- **`{@link Other}` instead of a URL**, so a rename tracks.
- **Options objects are documented on the interface, property by property**,
  not in the function's comment. That is what hover, completion, and agents
  surface.
- **`@example` blocks are subject to
  [Documented examples that run](#documented-examples-that-run).**

Error messages are documentation. State the problem, then the fix. An error
that names what to try next is worth more than a paragraph in the README.

One doc dialect per repository, enforced by the linter rather than relitigated
in review.

## Source comments

A comment ships only if it passes all three gates. Fail any: delete or
rewrite. Borderline: delete — borderline means the information is
reconstructible, which is what makes deletion cheap.

**Loss.** Three years from now, would losing this cost a maintainer real time
rediscovering intent, an invariant, a constraint, or a failure mode the code
and tests do not already make obvious?

**Elite.** Would SQLite, Redis, the Go standard library, or CPython write this
comment, at this length? Those projects state the constraint and stop. They do
not argue with an imagined objector.

**Upkeep.** Will it stay true without maintenance? A comment that hand-syncs a
value the code owns — a count, an offset, a line reference, a duplicated
constant — is false the first time that value moves.

### Ceiling

One or two lines. A comment reaching four is either carrying several facts, in
which case split it, or arguing, in which case cut it to the fact.

Rationale, alternatives weighed, and the story of how the code got here belong
in the commit message: timestamped, attached to the exact diff, and free to
maintain.

A comment often holds both a constraint and the deliberation that found it.
Keep the constraint, cut the deliberation. "Runs at most once per second"
survives; "this is the right trade for now" does not.

### Keep

- Why over how: upstream quirks, protocol and compatibility constraints,
  performance trade-offs still part of the contract — `knip.jsonc`'s
  `ignoreDependencies` comments (CSS side-effect imports, Pagefind's runtime
  load) are the model to follow.
- Invariants, preconditions, ordering, lifetime, and concurrency requirements
  that types and tests cannot express.
- Code that looks wrong but is not, so a later cleanup does not reintroduce the
  bug.
- A high-level sketch of an algorithm whose local operations do not reveal the
  whole.
- Why a `@ts-expect-error`, a cast, or a `biome-ignore` is there — the
  suppression without the reason is the worst of both. `biome-ignore
  lint/suspicious/noExplicitAny: Astro/Vite Plugin type version mismatch` names
  the constraint; a bare `biome-ignore` does not.

### Delete

- Narration of the next lines; code translated into English.
- Restated names, types, defaults, or control flow.
- Values duplicated from the code and hand-synced.
- Justification, hedging, or apology for a choice.
- Speculation about future requirements.
- History version control already holds, including commented-out code.
- Ticket and issue numbers. They say nothing to a reader without tracker
  access, and they rot when the tracker moves. Unfinished work goes in the
  tracker, not the source.
- Transient observations — "currently", "for now", "the latest release" — that
  go stale with no nearby edit.

### The upkeep gate in practice

It reaches values that track our own code. It does not reach frozen external
facts.

Bad (Delete):

```typescript
// There are 321 tests to complete for servers.
```

Good (Keep):

```typescript
// Node < 18 has no global fetch, so the polyfill stays.
```

### Documentation exception

Minimal usage examples, and `@param`, `@returns`, and `@throws` entries on
public API are exempt from the loss gate — they serve the caller, not the
maintainer. They are exempt from nothing else. Ceiling: a good man page entry.

### Durable source links

Link to a pinned revision, never to trunk. A pinned permalink is not a brittle
reference; an unlinked SHA dropped into prose is. `blob/master/…` links rot
silently — the file moves, lines shift, and the anchor lands on unrelated code
while still resolving.

- Prefer a release tag (`blob/@social-embed/lib@0.1.0-next.11/…`). Most
  durable, and it tells the reader which released version the claim held for.
- Otherwise use a 7-char commit ref (`blob/9a29b1a/…`) reachable from trunk.
  Use when there is no tag or the claim is about unreleased code. Never a
  PR-head SHA — it can be rebased or garbage-collected.
- Reserve `blob/master/…` for living documents meant to always show the latest
  state, such as this file.
- Line anchors (`#L120-L145`) are only safe on a pinned ref.

### The Published-Release Test

Long-running branches accumulate tactical decisions — renames, refactors,
attempts-then-reverts. When deciding what counts as branch-internal, use
`master` as the baseline, not intermediate states inside the current branch.
Ask:

> Did users of the most recently published release ever experience this old
> name, old behavior, or bug?

If the answer is no, it is branch-internal narrative. Move it to the commit
message and describe only the final state in the artifact.

Keep in shipped artifacts: migration notes for symbols that actually shipped
(the removed-`Provider`-enum entry in `packages/lib/CHANGES.md` is the model);
`### Fixes` entries for bugs that affected users of a published release;
comments explaining why the current code looks this way that make sense to a
reader who never saw the previous version.

### Preservation and context

Subjective cleanup must never remove load-bearing rationale. Adjudicate
comments with the policy above; borderline cases are deleted, not kept.

- **Preserve the "why".** Never delete a comment documenting an invariant, a
  protocol constraint, a platform quirk, or an upstream workaround.
- **Evidence is immune.** Preserve exact counts, dates, and SHAs when they
  serve as evidence in benchmark results, release notes, or lockfiles.
- **Behaviour over inventory.** A useful description explains what changed for
  the system or user; it does not provide an inventory of files or functions
  the diff already shows.

### Cleanup in hindsight

When applying these rules retroactively from inside a feature branch, first
establish scope by diffing against `master` to identify which commits the
branch actually introduced. Then:

- **In-branch commits:** offer `fixup!` commits with `git rebase --autosquash`
  to address each causal commit at its source, or a single cleanup commit at
  branch tip.
- **Trunk commits:** leave them alone by default. Act only on explicit
  instruction, and fold into one cleanup commit at branch tip — never rewrite
  shared history.
- **Scope guard:** if cleaning prior slop would touch someone else's work or
  expand the branch beyond its stated goal, leave it alone.

## Custom elements

`@social-embed/wc` exposes exactly one custom element, `<o-embed>`, defined in
`packages/wc/src/OEmbedElement.ts`. These conventions are what makes it one
element rather than a drifting family:

- **Registration is a side effect of importing the module.**
  `customElements.define("o-embed", OEmbedElement)` runs at module load, not
  lazily and not behind a helper. Anything that needs to register more than
  once (a test suite reloading the module) guards it: `if
  (!customElements.get("o-embed")) { customElements.define(...) }`.
- **Reactive properties are a `static properties` object literal, not
  `@property()` decorators.** The source comment states why: CDN
  compatibility. `<script type="module" src=".../wc?module">` in a plain HTML
  page has no build step to apply decorator metadata; a static field survives
  unbundled.
- **Every attribute is string-typed** (`{ type: String }`), including
  `allowfullscreen`, which is semantically boolean. A new attribute follows
  this: read it as a string, and decide truthiness explicitly (see
  `shouldAllowFullscreen()`) rather than relying on Lit's boolean coercion.
- **The attribute is the public contract; the property is the fallback.**
  Dimension resolution reads in this order: an explicit HTML attribute
  (`this.getAttribute("width")`), then a provider-specific default (a static
  `<Provider>DefaultDimensions` object, e.g. `vimeoDefaultDimensions`), then
  the instance property. A new provider with non-default dimensions adds a
  `static <name>DefaultDimensions` following that naming pattern, not a
  special case in `render()`.
- **CSS custom properties control the inner iframe independently of the HTML
  attributes.** `--social-embed-iframe-width` / `--social-embed-iframe-height`
  size the `<iframe>`; `width`/`height` attributes size the outer container.
  Document both when either changes.
- **One default, unnamed `<slot>`**, rendered after the `<iframe>` in every
  provider branch. Document it on the class with `@slot - <description>`, per
  the existing `@slot - Optional slot for passing child content (rendered
  after the iframe).`
- **TS consumers get two augmentations**, both required together:
  `HTMLElementTagNameMap` for `document.createElement("o-embed")` and
  DOM-query call sites, and the `JSX` `IntrinsicElements` namespace for
  JSX/TSX consumers. Add both when adding an element; one without the other
  half-documents the type.
- **Template bindings are linted separately from script.** `lint:lit-analyzer`
  catches invalid attribute bindings and unknown attributes inside `html`
  templates that `biome lint` cannot see, because it understands Lit's
  template syntax. See [The gates](CONTRIBUTING.md#the-gates).

## Terminology and capitalization

Pick the domain noun and keep it. This project calls a supported service a
"provider" — `EmbedProvider`, `EmbedProviderRegistry`, `getProviderFromUrl` —
never a "backend", "source", or "integration" in the same breath. If the
export is `mount`, write "mount" everywhere rather than alternating with
"attach", "render", and "initialise".

Stable vocabulary is what makes search, deep links, and an agent's retrieval
work at all.

TypeScript, npm, pnpm, Lit, Astro, and package names keep their own
capitalisation. Scoped package names are written as they are published:
`@social-embed/lib`, `@social-embed/wc`.

Do not write counts into prose — how many providers exist, how many tests
there are. They go stale silently and no reader needs them. Counts that pin a
fixture or guard an invariant are different, and belong in code.

## Markdown

Prose wraps at 80 columns. Table rows, badge lines, and long links are exempt,
because breaking them harms rendering. A pull request or issue body does not
wrap at all: GitHub renders a single newline as a space in a file and as a
line break in a comment, so a wrapped comment body arrives as ragged stubs.

GitHub alert blocks — `> [!NOTE]`, `> [!WARNING]` — render as literal text
outside GitHub, so reserve them for at most one load-bearing warning per
document. Write the sentence so it carries the fact on its own, and a renderer
that drops the marker loses nothing.

Do not use a local absolute path or an email address in anything published.

## Code blocks

Code blocks are paste-and-run units: pasting one block runs exactly one
intended action. Executed examples are exempt — the test suite runs them,
nobody pastes them.

- **One command per block.** Multiple steps may share a block only when
  explicitly chained with `&&`, `;`, or `\` continuations — the chain is then
  one logical command.
- **Explanations go in prose above the block**, never as `#` comments inside
  it.
- **Command menus are per-command blocks with prose lead-ins**, not tables.
- **Shell commands use the `console` tag with a `$ ` prefix.** This separates
  interactive commands from scripts and enables prompt-aware copy.
- **Split long commands with `\`** — one flag or flag+value pair per indented
  continuation line, positional arguments last.
- **TypeScript and HTML examples may use inline output annotations** — `//
  "https://www.youtube.com/embed/…"` after a call — because they document a
  return value, not a second command to run. This is the one exception to "no
  comments inside a block", and it stays idiomatic here.

Good — install the package and its peer dependency:

```console
$ pnpm add \
    @scope/package \
    @scope/peer
```

Bad:

```console
# Install the package and its peer dependency
$ pnpm add @scope/package @scope/peer
```

## The changelog

The changelog is written for the upgrader, not the author. Every entry answers
two questions: do I care, and what do I do about it. A generated commit dump
answers neither.

Three files carry it: root `CHANGES.md` for project-wide changes, plus
`packages/lib/CHANGES.md` and `packages/wc/CHANGES.md` per published package.
Each opens with an `## Upcoming release` heading holding an `<!-- _Enter the
most recent changes here_ -->` placeholder — add the next entry there. All
three are symlinked into `packages/site/src/content/docs/` (`news.md`,
`lib/release-notes.md`, `wc/release-notes.md`), so an edit to a `CHANGES.md`
is the only edit needed — the site picks it up automatically once built.

Keep a Changelog anatomy is the substrate — dated version headings, grouped
sections (`Enhancements`, `Breaking changes`, `Development`, `Documentation`,
and similar), strict semver. Predictable anatomy is not cosmetic: update bots
excerpt these sections into downstream pull requests, and agents slice them by
version to plan an upgrade.

Write observable differences. "`isYouTubeShortsUrl()` now detects
`/shorts/<id>` URLs" is an entry; "improved URL handling" is not.

**Every breaking change ships its migration inline** — the removed-`Provider`-
enum entry in `packages/lib/CHANGES.md`, which states the old shape, the new
shape, and the direct replacement call, is the model. Never "see docs".

Credit contributors and link the pull request on every entry where one exists.

Never rewrite a published entry except to correct a fact, marked as an edit.

## Release notes

This repository has no separate GitHub Release: `gh release list` returns
none. The `CHANGES.md` entry for a version is the release note — there is no
second narrative to keep in sync with it, so write the `CHANGES.md` entry as
if it were the only place a reader will see this version's changes.

Numbers over adjectives, always. "Bundle ~2 kB gzipped" is a sentence; "small
bundle" is a smell.

A breaking release ships a migration section inline in the changelog entry
(see [The changelog](#the-changelog)), not a separate document.

## Commits

```
type(scope[detail]) Concise description

why: Explanation of necessity or impact.

what:
- Specific technical changes made
- Focused on a single topic
```

**No colon after the closing parenthesis of a `type(scope[detail])` subject.**
Measured across the most recent 500 commits on `master`, 465 have no colon
and 3 do; the exceptions are one `ci(deps): bump actions/setup-node from 6
to 7` and its `checkout` sibling — Dependabot's own commit shape, not this
project's — plus a single one-off `fix(...):`. Across the full history the
colon appears far more on this form, almost entirely from an earlier era of
`build(deps):` / `js(deps):` bumps; recent history is the standard to
follow. A colon after `)` reads as machine-generated here. (A bare filename
subject with no parentheses is a different, legitimate shape — see
[Config-file commits](#config-file-commits) below.)

Keep the subject scannable in `git log --oneline`: aim for 50 characters and
treat 72 as the practical limit, excluding any trailing `(#NN)` pull request
reference. Wrap body lines at 72. Separate the `why:` and
`what:` blocks with a blank line.

`type` is always lowercase; `scope` is usually lowercase, with proper
capitalisation reserved for a proper name (a class like `OEmbedElement`).

Where a change is scoped to one workspace package and does not reduce cleanly
to a `type`, the package name may lead instead: `site(index) Widen examples
panel`, `wc(chore[config]) Add type checking support to Vitest configuration`.
Both orders are real in this repository's history; prefer `type(scope[detail])`
when the change fits a type.

The body carries why, never what; the diff already shows what. Name the
constraint that forced this shape, and name the alternative you rejected —
`fix(site[type-check])` on this repository's own history, which names three
rejected alternatives before landing on the native `tsc` project, is the bar.

A routine maintenance commit needs no body at all, just a capitalised
description after the parenthesis:

```
js(deps[dev]) Bump dev packages
ai(rules[AGENTS]) Judge comments by three gates
```

### Config-file commits

A change confined to one configuration file takes that file's name as the
subject, followed by a colon — the one place a colon is correct. This is
well established here: 69 commits on `master` take this shape (55 for files
with a `.json[c]`/`.yaml`/`.toml` extension, 14 more for an extensionless
dotfile), the large majority of them bumping `biome.jsonc`'s pinned schema
version:

```
biome.jsonc: Update to 2.5.9
.ncurc: Unignore `rimraf` (node 18 dropped)
```

A version bump to a pinned tool file has also used a dedicated
`<file>(<what>) old -> new` form, no colon, because the old and new values
are the point:

```
.nvmrc(nodejs) 24.11.0 -> 25.2.1
```

Eight of `.nvmrc`'s bumps use this shape, plus one each for `.tool-versions`
and `.ncurc`. The most recent `.nvmrc` bump used the standard
`type(scope[detail])` form instead (`chore(config[nvmrc]) Bump .nvmrc
25.2.1 → 26`) — both are real; either is fine for a new commit, but a bare
colon after the filename is reserved for a config edit with no old/new
value to state.

Common types:

- **feat**: New features or enhancements
- **fix**: Bug fixes
- **refactor**: Code restructuring without functional change
- **docs**: Documentation updates
- **chore**: Maintenance (dependencies, tooling, config)
- **test**: Test-related updates
- **style**: Code style and formatting
- **ci**: Workflow and pipeline changes
- **js(deps)**: Dependencies
- **js(deps[dev])**: Dev dependencies
- **ai(rules[AGENTS])**: AI rule updates
- **ai(claude[rules])**: Claude Code rules (`CLAUDE.md`)
- **ai(claude[command])**: Claude Code command changes

Example:

```
feat(lib[youtube]) Support YouTube Shorts URLs

why: Users often paste Shorts links; embeds should just work.

what:
- Detect `/shorts/<id>` URL pattern
- Convert Shorts URLs to `youtube.com/embed/<id>`
- Add tests for common Shorts URL variants
```

For a multi-line message, use a heredoc so the formatting survives:

```console
$ git commit -m "$(cat <<'EOF'
feat(scope[detail]) Concise description

why: Explanation of the change.

what:
- First change
- Second change
EOF
)"
```

Every commit builds and passes the gates. The measure is that `git bisect`
works on the history. Nothing named "wip" reaches trunk.

Never merge a message you would not sign as your own analysis, whoever or
whatever drafted it. Commit trailers naming a tool ("Made-with: …") do not
belong in the message — the repository's own AI-signature rule under
[Slop prevention](#slop-prevention) covers this.

### Release commits

Never create tags. Never push tags. The owner handles tagging and tag pushes,
because a tag triggers the manual publish (see
[Releasing](CONTRIBUTING.md#releasing)).

A release commit subject is plain and short, matching the package-scoped tag
it precedes: `Tag @social-embed/lib@0.1.0-next.11` or `Tag
@social-embed/wc@0.1.0-next.13`. For a repo-wide version with no single owning
package, `Tag v<version>`. Do not use the `type(scope[detail])` format for a
release — it buries the lede, and this repository's release commits carry no
body at all.

## Slop prevention

Treat AI slop as review-hostile noise, not as proof that text or code is
wrong. The goal is to maximise information density.

- **AI signatures.** No "Generated by", no conversational filler, no
  unexplained emoji, no tool metadata, no commit trailer naming the tool that
  drafted the change.
- **Brittle references.** No hard-coded line numbers, fragile file counts,
  dated "as of" claims, bare SHAs, or local absolute paths — unless they are
  strict evidentiary artefacts such as a benchmark log.
- **Diff narration.** Do not restate what moved, was renamed, or was removed
  in anything the reader holds alongside the diff: code, TSDoc, README, or a
  pull request description. The diff and the commit message already carry it.
- **Branch-internal narrative.** Do not mention intermediate states, abandoned
  approaches, or "no longer" behaviour unless users of a published release
  actually experienced the old state — see
  [The Published-Release Test](#the-published-release-test).
- **Low-value scaffolding.** No ownerless TODOs, unused future-proofing, debug
  artefacts, or defensive wrappers around failure modes nothing can reach.
- **Prose inflation.** The diction table under [Voice](#voice) governs;
  replace an inflated word with a concrete description of behaviour,
  constraints, or trade-offs.
- **Coded labels.** Write rules and findings as plain imperatives. No `[R1]`,
  `Option B`, or any index a reader has to decode.

Preserve the "why". Never delete a comment documenting an invariant, a
protocol constraint, a platform quirk, or an upstream workaround — those are
the facts [Source comments](#source-comments) keeps, and every other comment
is judged by it.

### Keep instructions lean

Treat `AGENTS.md`, this file, and `CONTRIBUTING.md` like code and prune them.

- Delete a line whose removal would not cause a mistake.
- Move multi-step procedures into scripts, path-specific rules into nested
  `AGENTS.md` files (`packages/site/AGENTS.md` is the existing example), and
  hard limits into CI.
- Keep only non-obvious, broadly applicable defaults. Anything a reader can
  infer from the code, a manifest, or a linter does not belong.

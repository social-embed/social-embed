# AGENTS.md - Examples Workspace

AI agent guidance specific to `examples/`.

These rules extend the repo root `AGENTS.md`. If there is a conflict, follow the more specific rule in this file for anything under `examples/`.

## Purpose

Examples in this repo are first-class demo apps, not loose snippets.

Each runnable example should be:
- Bootable from its own directory with `pnpm install` and `pnpm dev`
- Suitable for GitHub-subdir sandbox booting
- Small enough to understand quickly
- Covered by Vitest and headless Playwright checks

## Directory Contract

Runnable examples live in:

- `examples/integration-patterns/<slug>/`

Each runnable example must contain its own:

- `package.json`
- `README.md`
- `index.html`
- `tsconfig.json`
- `vite.config.ts` or `vite.config.js`
- `src/main.ts` or `src/main.tsx`

Reference-only fixtures that are not standalone apps should live alongside the runnable examples in clearly named files or folders.

## Dependency Rules

Normal example apps must declare `@social-embed/*` with semver ranges, not `workspace:*`.

Why:
- Semver package manifests are portable to StackBlitz/CodeSandbox
- The repo root can still link local workspace packages during local development

Rules:
- Do not add relative imports from an example app into `packages/*`
- Do not import repo internals from examples except through published package names
- If you add `@social-embed/*` from inside an example app, do not let pnpm save `workspace:*`
- Prefer editing the dependency range manually, or use:

```bash
pnpm add \
  --save-workspace-protocol=false \
  @social-embed/wc
```

## README Requirements

Every runnable example README should include:

- What the example demonstrates
- One-command install instructions
- One-command dev instructions
- One-command test instructions
- The repo path to the example
- The expected StackBlitz GitHub-subdir URL pattern

Follow the repo rule of one shell command per code block.

## Testing Rules

Every runnable example must provide stable selectors for browser tests.

Use `data-testid` for:
- The main app root
- The rendered `<o-embed>` host
- Any important status or validation output

Each runnable example must be testable with:
- Vitest for unit or behavior checks
- Headless Playwright-backed browser checks for rendered behavior

Do not weaken tests just to make examples easier to author.

## Docs and Demo Rules

The example app is the source of truth.

Docs pages may link to the example, summarize it, or embed it, but they should not duplicate the app logic in a second implementation.

When adding or changing an example:
- Update the docs entry that references it
- Keep source links and demo links accurate
- Keep the example focused on a single integration pattern

## Change Discipline

Keep commits narrow:
- First commit scoped rules or bootstrap changes
- Then build examples one integration family at a time

When changing multiple examples, keep shared infrastructure changes separate from example-specific behavior changes where practical.

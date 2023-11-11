---
id: contributing
title: Contributing
slug: contribute
description: Contribute to the @social-embed web component.
---

# Contributing to @social-embed/wc

## Clone the repo

Repo: https://github.com/social-embed/social-embed

```bash
git clone https://github.com/social-embed/social-embed
```

## Build

This sample uses the TypeScript compiler to produce JavaScript that runs in modern browsers.

To build the JavaScript version of your component:

```bash
yarn build
```

To watch files and rebuild when the files are modified, run the following command in a separate shell:

```bash
yarn build --watch
```

## Testing

This sample uses web-test-runner and the open-wc test helpers for testing. See the [open-wc testing documentation](https://open-wc.org/testing/testing.html) for more information.

Tests can be run with the `test` script:

```bash
yarn test
```

Note: On Ubuntu, you may need to download libraries:

```bash
sudo apt install libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1
libxdamage1
```

## Dev Server

via `vite preview`:

```bash
yarn serve
```

There is a development HTML file located at `/index.html` that you can view at http://localhost:4173/index.html.

## Editing

If you use VS Code, we highly recommend the [lit-plugin extension](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin), which enables some extremely useful features for lit-html templates:

- Syntax highlighting
- Type-checking
- Code completion
- Hover-over docs
- Jump to definition
- Linting
- Quick Fixes

The project is setup to recommend lit-plugin to VS Code users if they don't already have it installed.

## Linting

Linting of TypeScript files is provided by [ESLint](eslint.org) and [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint). In addition, [lit-analyzer](https://www.npmjs.com/package/lit-analyzer) is used to type-check and lint lit-html templates with the same engine and rules as lit-plugin.

The rules are mostly the recommended rules from each project, but some have been turned off to make LitElement usage easier. The recommended rules are pretty strict, so you may want to relax them by editing `.eslintrc.json` and `tsconfig.json`.

To lint the project run:

```bash
yarn lint
```

## Formatting

[Prettier](https://prettier.io/) is used for code formatting. It has been pre-configured according to the Polymer Project's style. You can change this in `.prettierrc.json`.

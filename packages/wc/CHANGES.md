---
title: Release notes
description: Latest updates for the @social-embed web component.
sidebar:
  order: 90
---

## Upcoming release

<!-- _Enter the most recent changes here_ -->

_Details on the next release will go here._

## 0.1.0-next.11 (2025-01-01)

_Maintenance release only, no bug fixes or new features._

### Development

- Package manager: [yarn classic] -> [pnpm] (#29)
- @social-embed/lib: From v0.1.0-next.8 to v0.1.0-next.9

[yarn classic]: https://classic.yarnpkg.com/
[pnpm]: https://pnpm.io/

## 0.1.0-next.10 (2024-12-31)

Re-release of 0.1.0-next.9 with `dist/` artifacts included.

## 0.1.0-next.9 (2024-12-31)

**Yanked: Missing build artifacts.**

_Maintenance release only, no bug fixes or new features._

### Development

- @social-embed/lib: From v0.1.0-next.7 to v0.1.0-next.8

## 0.1.0-next.8 (2023-11-25)

### Improvements

- Spotify: Set default height to `352px` (for default player size, #23)

  - Docs: Add example of compat player using `152px` height.

- lit: 3.0.2 -> 3.1.0 (#20)

  See also:

  - https://github.com/lit/lit/blob/lit%403.1.0/packages/lit/CHANGELOG.md
  - https://github.com/lit/lit/blob/lit%403.1.0/packages/lit-html/CHANGELOG.md

- @social-embed/lib: From v0.1.0-next.5 to v0.1.0-next.7

  - Regex improvements

### Development

- vite: 4.5.0 -> 5.0.0 (#21)

  See also:

  - https://vitejs.dev/blog/announcing-vite5
  - https://vitejs.dev/guide/migration
  - https://github.com/vitejs/vite/blob/v5.0.0/packages/vite/CHANGELOG.md
  - https://github.com/vitejs/vite/blob/531d3cb/packages/vite/CHANGELOG.md

- Move from `prettier` to `biome` (#27)
- Move from `eslint` to ~`oxlint` (#26)~ `biome` (#27)

  Faster linting, as it is rust-based.

## 0.1.0-next.7 (2023-11-11)

### Improvements

- lit: 3.0.1 -> 3.0.2 (#16)

  See also:

  - https://github.com/lit/lit/blob/lit%403.0.2/packages/lit/CHANGELOG.md
  - https://github.com/lit/lit/blob/lit-element%403.0.2/packages/lit-element/CHANGELOG.md
  - https://github.com/lit/lit/blob/lit-html%403.0.2/packages/lit-html/CHANGELOG.md

### Development

- Update @web/dev-server-esbuild `0.4.4` -> `1.0.0` ([release notes](https://github.com/modernweb-dev/web/blob/%40web/dev-server-esbuild%401.0.0/packages/dev-server-esbuild/CHANGELOG.md)) (#14)
- Update @web/test-runner + @web/test-runner-puppeteer (#15)

  - @web/test-runner `<0.17.0` -> `^0.18.0` ([release
    notes](https://github.com/modernweb-dev/web/blob/%40web/test-runner%400.18.0/packages/test-runner/CHANGELOG.md))
  - @web/test-runner-puppeteer `<0.14.0` -> `^0.15.0` ([release
    notes](https://github.com/modernweb-dev/web/blob/%40web/test-runner-puppeteer%400.15.0/packages/test-runner-puppeteer/CHANGELOG.md))

## 0.1.0-next.6 (2023-11-01)

- Docs (README): Further README updates in relation to vite

## 0.1.0-next.5 (2023-11-01)

- Docs (README): Fix links and example code

## 0.1.0-next.4 (2023-08-26)

### Breaking changes

- Minimum Node.js version to v18+ (#12)
- Lit 3.0 (#13)

  - https://lit.dev/blog/2023-10-10-lit-3.0/
  - https://lit.dev/blog/2023-10-10-lit-3.0/#lit-3.0

### Development

- Bump lib to v0.1.0-next.5

  Dev package updates

## 0.1.0-next.3 (2023-08-26)

- Prettier: Add css and JS import ordering (#9)
- Bump lib to v0.1.0-next.4

  Lib has improved prettier linting, including css rule and import ordering.

## 0.1.0-next.2 (2023-06-12)

- Include typings

  - Add [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts)
  - package.json Add back `"typings": "..."`

- Bump lib dependency to v0.1.0-next.3 (Fix typing inclusion in package.json)

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/wc@0.1.0-next.1...@social-embed/wc@0.1.0-next.2)

## 0.1.0-next.1 (2023-06-12)

- Bump lib dependency to v0.1.0-next.2 (adds typings)

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/wc@0.1.0-next.0...@social-embed/wc@0.1.0-next.1)

## 0.1.0-next.0 (2023-06-12)

- Move to `vite` (#8)
- Bump lib dependency to v0.1.0-next.1

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/wc@0.0.5-next.1...@social-embed/wc@0.1.0-next.0)

## 0.0.5-next.1 (2022-11-10)

- Bump `@social-embed/lib` from 0.1.0-next.12 -> 0.0.2-next.1

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/wc@0.0.5-next.0...@social-embed/wc@0.0.5-next.1)

## 0.0.5-next.0 (2022-11-06)

- Move from `tsc` to `rollup` (#43)

  This handles legacy builds and UMD build (for documentation)

  Before hand, `site/` had its own rollup configuration just for handling a UMD
  build.

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/wc@0.0.4-next.0...@social-embed/wc@0.0.5-next.0)

## 0.0.4-next.0 (2021-09-25)

Update lit-element to lit

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/wc@0.0.3-next.5...@social-embed/wc@0.0.4-next.0)

## 0.0.3-next.5 (2021-06-03)

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/wc@0.0.3-next.4...@social-embed/wc@0.0.3-next.5)

- DailyMotion: Fix dimension customization

## 0.0.3-next.4 (2021-06-03)

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/wc@0.0.3-next.3...@social-embed/wc@0.0.3-next.4)

- Update lib to @social-embed/lib to ^0.1.0-next.12 to assure
  generic regexes provided.
- Rollup: 2.50.5 -> 2.50.6

## 0.0.3-next.3 (2021-06-02)

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/wc@0.0.3-next.2...@social-embed/wc@0.0.3-next.3)

- Accept css variables in generic iframe embeds

## 0.0.3-next.2 (2021-06-02)

- Update TypeScript 4.2 -> 4.3
- Fallback to iframes for valid URLs not supported in providers

## 0.0.3-next.1 (2021-05-19)

- `<o-embed>` is now a block-level element
- More dimension support, add examples to docs

## 0.0.3-next.0 (2021-05-19)

- Support passing `--social-embed-iframe-width` and
  `--social-embed-iframe-height`

## 0.0.2 (2021-05-16)

- lit-element 2.4.0 -> 2.5.1
  ([changelog](https://github.com/lit/lit-element/blob/2b39872/CHANGELOG.md))

## current

- Added normal documentation:
  https://social-embed.git-pull.com/wc/
- [#29](https://github.com/social-embed/social-embed/pull/29) - Simplify test
  runner with esbuild. No need to wait for builds to `dist`/
- Disable specRunner (runs before diff outputs on errors, making errosr harder
  to see. Also the `logger.log()` doesn't work from the earlier example.
- [#30](https://github.com/social-embed/social-embed/pull/30): Add loom, wistia
  and edpuzzle

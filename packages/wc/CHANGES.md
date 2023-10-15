---
title: Release notes
---

## Upcoming release

<!-- _Enter the most recent changes here_ -->

### Breaking changes

- Minimum Node.js version to v18+ (#12)
- Lit 3.0 (#13)

  - https://lit.dev/blog/2023-10-10-lit-3.0/
  - https://lit.dev/blog/2023-10-10-lit-3.0/#lit-3.0

### Development

- Bump lib to v0.0.1-next.5

  Dev package updates

## 0.0.1-next.3 (2023-08-26)

- Prettier: Add css and JS import ordering (#9)
- Bump lib to v0.0.1-next.4

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

- Bump `@social-embed/lib` from 0.0.1-next.12 -> 0.0.2-next.1

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

- Update lib to @social-embed/lib to ^0.0.1-next.12 to assure
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

- Added API Documentation:
  https://social-embed.git-pull.com/api/modules/wc.html
- Added normal documentation:
  https://social-embed.git-pull.com/docs/wc/
- [#29](https://github.com/social-embed/social-embed/pull/29) - Simplify test
  runner with esbuild. No need to wait for builds to `dist`/
- Disable specRunner (runs before diff outputs on errors, making errosr harder
  to see. Also the `logger.log()` doesn't work from the earlier example.
- [#30](https://github.com/social-embed/social-embed/pull/30): Add loom, wistia
  and edpuzzle

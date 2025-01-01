---
title: Release notes
description: Latest updates for the @social-embed URL parsing library.
sidebar:
  order: 90
---

## Upcoming release

<!-- _Enter the most recent changes here_ -->

## 0.1.0-next.9 (2025-01-01)

_Maintenance release only, no bug fixes or new features._

### Development

- Package manager: [yarn classic] -> [pnpm] (#29)

[yarn classic]: https://classic.yarnpkg.com/
[pnpm]: https://pnpm.io/

## 0.1.0-next.8 (2024-12-31)

### Breaking changes

- Security: Fixes to mitigate polynomial regex expressions (#24)

  - Limit URL lengths for Loom, EdPuzzle, and Wistia

### Development

- Move from `prettier` to `biome` (#27)
- Move from `eslint` to ~`oxc` (#26)~ `biome` (#27)

  Faster linting, as it is rust-based.

## 0.1.0-next.7 (2023-11-25)

### Breaking changes

- Security: Fixes to mitigate polynomial regex expressions (#17)

  - Add plugins: [eslint-plugin-redos-detector] ([redos-detector])

    [eslint-plugin-redos-detector]: https://github.com/tjenkinson/eslint-plugin-redos-detector
    [redos-detector]: https://github.com/tjenkinson/redos-detector

  - lib(matcher): Cap length to prevent some ReDoS vectors
  - Simplify regexes for EdPuzzle, Loom, Spotify, Wistia, YouTube
  - Remove generic URL regex: This regex is difficult to constrain

    - `isValidUrl()`: in favor of using [`URL()`] constructor directly to
      test URL validity.

      [`URL()`]: https://developer.mozilla.org/en-US/docs/Web/API/URL/URL

### Deprecation notice

- Regex patterns will be set to be removed in future releases in favor of
  a typed, URL matching object (interface is to be determined).

## 0.1.0-next.6 (2023-11-25)

_Skipped directly to v0.1.0-next.7_ due to publishing error.

## 0.1.0-next.5 (2023-10-15)

### Breaking changes

- Minimum Node.js version to v18+ (#12)
- Move from [jest] to [vitest]

  [vitest]: https://vitest.dev/guide/
  [jest]: https://jestjs.io/docs/cli

## 0.1.0-next.4 (2023-08-26)

- Prettier: Add css and JS import ordering

## 0.1.0-next.3 (2023-06-12)

- package.json: Add `typings: 'dist/index.d.ts'`

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/lib@0.1.0-next.2...@social-embed/lib@0.1.0-next.3)

## 0.1.0-next.2 (2023-06-12)

- Include typings

  - Add [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts)

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/lib@0.1.0-next.1...@social-embed/lib@0.1.0-next.2)

## 0.1.0-next.1 (2023-06-12)

- Fix for package.json

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/lib@0.1.0-next.0...@social-embed/lib@0.1.0-next.1)

## 0.1.0-next.0 (2023-06-12)

- Move to `vite` (#8)

See [commits](https://github.com/social-embed/social-embed/compare/@social-embed/lib@0.0.2-next.1...@social-embed/lib@0.1.0-next.0)

## 0.0.2-next.1 (2022-11-10)

- Move `jest` to `devDependencies`

## 0.0.2-next.0 (2022-11-06)

- Move from `tsdx` to `rollup` (#43)

## 0.0.1-next.12 (2021-06-02)

- Add `matcher` helper to generate regex matchers
- Generic URL regular expression

## 0.0.1: next.0 - next.11

- Added API Documentation:
  https://social-embed.git-pull.com/api/modules/lib.html
- Added normal documentation:
  https://social-embed.git-pull.com/lib/
- YouTube: Move back to single file
- [#30](https://github.com/social-embed/social-embed/pull/30): Add loom, wistia
  and edpuzzle

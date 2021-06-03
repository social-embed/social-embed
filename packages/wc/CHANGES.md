---
title: Release notes
---

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

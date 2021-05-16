---
title: Release notes
---

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

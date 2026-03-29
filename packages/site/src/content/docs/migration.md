---
title: Migration notes
slug: migration
sidebar:
  order: 45
---

## 0.1.0 (2024-01-05)

- **For library consumers**:
  - Remove references to `Provider.*`; rely on `getProviderFromUrl(url)?.name` or use `convertUrlToEmbedUrl(url)` for an auto-detected embed link.
- **For `<o-embed>` usage** in `@social-embed/wc`:
  - No user code changes typically required, unless you were depending on the `Provider` enum externally.
  - Now it’s enough to set `url` on `<o-embed>`. Unknown providers fallback to `<iframe>` or produce an error message for invalid URLs.

---

For detailed changelogs, see the [Library release notes](/lib/release-notes) and [Web Component release notes](/wc/release-notes).

---
title: Migration notes
slug: migration
order: 5
---

## 0.2.0 - Complete API Redesign

Version 2.0 introduces a completely redesigned API with type-safe generics and privacy-by-default.

**For detailed migration instructions, see the [Library Migration Guide](/lib/migration/).**

### Breaking Changes Summary

- `EmbedProvider` → `UrlMatcher<TName, TData, TOptions>`
- `EmbedProviderRegistry` → `MatcherRegistry`
- `getProviderFromUrl()` → `registry.match()`
- `convertUrlToEmbedUrl()` → `registry.toEmbedUrl()`
- Provider-specific functions removed (use registry pattern instead)
- Returns `Result<T>` instead of nullable values
- Privacy-enhanced mode enabled by default

### Web Component Changes

- **HTML interface unchanged** - `<o-embed url="...">` still works
- **New attribute**: `privacy` - Enable/disable privacy-enhanced mode (default: `true`)
- **Internal refactor**: Now uses `MatcherRegistry` from lib

---

## 0.1.0 (2024-01-05)

- **For library consumers**:
  - Remove references to `Provider.*`; rely on `getProviderFromUrl(url)?.name` or use `convertUrlToEmbedUrl(url)` for an auto-detected embed link.
- **For `<o-embed>` usage** in `@social-embed/wc`:
  - No user code changes typically required, unless you were depending on the `Provider` enum externally.
  - Now it's enough to set `url` on `<o-embed>`. Unknown providers fallback to `<iframe>` or produce an error message for invalid URLs.

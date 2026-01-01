---
title: Migration notes
slug: migration
order: 5
---

## 0.2.0 - Complete API Redesign

Version 0.2 introduces a completely redesigned API with type-safe generics and privacy-by-default.

**For detailed migration instructions, see the [Library Migration Guide](/lib/migration/).**

### Breaking Changes Summary

- `EmbedProvider` → `UrlMatcher<TName, TData, TOptions>`
- `EmbedProviderRegistry` → `MatcherRegistry` (immutable)
- _(new)_ `RegistryStore` for mutable operations with reactivity
- `getProviderFromUrl()` → `registry.match()` or browser's `match()`
- `convertUrlToEmbedUrl()` → `toEmbedUrl()` from browser module
- Provider-specific functions removed (use registry pattern instead)
- Returns `Result<T>` instead of nullable values
- Privacy-enhanced mode enabled by default
- _(new)_ `Embed` class with `.toHtml()`, `.toUrl()`, `.toNodes()` methods

### Architecture Split

| Layer | Purpose | API |
|-------|---------|-----|
| **Core** | SSR-safe, immutable | `MatcherRegistry`, `defineMatcher()` |
| **Browser** | Mutable, reactive | `register()`, `toEmbedUrl()`, `defaultStore` |
| **WC** | HTML authors | `<o-embed url="...">` |

### Web Component Changes

- **HTML interface unchanged** - `<o-embed url="...">` still works
- **New attribute**: `privacy` - Enable/disable privacy-enhanced mode (default: `true`)
- **Reactive**: Subscribes to `defaultStore` - auto-updates when you call `register()`

---

## 0.1.0 (2024-01-05)

- **For library consumers**:
  - Remove references to `Provider.*`; rely on `getProviderFromUrl(url)?.name` or use `convertUrlToEmbedUrl(url)` for an auto-detected embed link.
- **For `<o-embed>` usage** in `@social-embed/wc`:
  - No user code changes typically required, unless you were depending on the `Provider` enum externally.
  - Now it's enough to set `url` on `<o-embed>`. Unknown providers fallback to `<iframe>` or produce an error message for invalid URLs.

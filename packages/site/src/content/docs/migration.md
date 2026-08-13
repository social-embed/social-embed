---
title: Migration Notes
slug: migration
sidebar:
  order: 5
---

This page provides an overview of breaking changes across versions. For detailed migration instructions, see the package-specific guides.

## Migration Guides

| Package | Guide | Description |
|---------|-------|-------------|
| `@social-embed/lib` | [v0.1 → v0.2](/lib/migration/0.2/) | Complete API redesign |
| `@social-embed/wc` | [v0.1 → v0.2](/wc/migration/0.2/) | Privacy mode, reactive store |

## Version History

### 0.2.0 - Complete API Redesign

Version 0.2 introduces a completely redesigned API with type-safe generics and privacy-by-default.

**Key changes:**

- `EmbedProvider` → `UrlMatcher<TName, TData, TOptions>`
- `EmbedProviderRegistry` → `MatcherRegistry` (immutable)
- New `RegistryStore` for mutable operations with reactivity
- Privacy-enhanced mode enabled by default
- New `Embed` class with `.toHtml()`, `.toUrl()`, `.toNodes()` methods

**Architecture split:**

| Layer | Purpose | API |
|-------|---------|-----|
| **Core** | SSR-safe, immutable | `MatcherRegistry`, `defineMatcher()` |
| **Browser** | Mutable, reactive | `register()`, `toEmbedUrl()`, `defaultStore` |
| **WC** | HTML authors | `<o-embed url="...">` |

### 0.1.0 (2024-01-05)

- **Library**: Removed `Provider.*` enum; use `getProviderFromUrl(url)?.name` instead
- **Web Component**: No breaking changes; `<o-embed url="...">` continues to work

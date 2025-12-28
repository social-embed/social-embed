---
title: Release notes
description: Latest updates for the @social-embed URL parsing library.
sidebar:
  order: 90
---

## 0.2.0 (unreleased)

### Breaking Changes - Complete API Redesign

This release completely redesigns the library API for type safety and SSR compatibility.

#### New Core Types

- **`UrlMatcher<TName, TData, TOptions>`** replaces `EmbedProvider`
  ```typescript
  interface UrlMatcher<TName extends string, TData, TOptions> {
    readonly name: TName;
    readonly domains?: readonly string[];
    readonly supportsPrivacyMode?: boolean;
    canMatch(ctx: MatchContext): boolean;
    parse(ctx: MatchContext): Result<TData>;
    toEmbedUrl(data: TData, options?: PrivacyOptions): string;
    toOutput(data: TData, options?: OutputOptions): EmbedOutput;
  }
  ```

- **`MatcherRegistry`** replaces `EmbedProviderRegistry`
  - O(1) domain-based indexed dispatch
  - Immutable: `with()`, `without()` return new registries
  - Mutable: `register()`, `unregister()` modify in place

- **`Result<T>`** monad for explicit error handling
  - `{ ok: true, value: T }` or `{ ok: false, error: MatchError }`
  - Error codes: `NO_MATCH`, `INVALID_FORMAT`, `MISSING_ID`, `PARSE_ERROR`

- **`EmbedOutput`** structured output model
  - `nodes: EmbedNode[]` - iframe or HTML nodes
  - `scripts?: ScriptRequest[]` - for future script-hydrated embeds
  - `styles?: StyleChunk[]` - for custom styling

- **`MatchContext`** pre-parsed URL context
  - Parse once, match many pattern for efficiency

#### New Features

- **Privacy-by-default**: YouTube embeds use `youtube-nocookie.com`
- **Factory functions**: `defineIframeMatcher()` for config-driven matchers
- **Browser module**: `import { mount } from "@social-embed/lib/browser"`
- **SSR-safe**: All core APIs work without DOM

#### Migration Guide

```typescript
// Before (v1)
import { getProviderFromUrl, convertUrlToEmbedUrl } from "@social-embed/lib";
const provider = getProviderFromUrl(url);
const embedUrl = provider?.getEmbedUrlFromId(provider.getIdFromUrl(url));

// After (v2)
import { MatcherRegistry } from "@social-embed/lib";
const registry = MatcherRegistry.withDefaults();
const result = registry.match(url);
if (result.ok) {
  const embedUrl = result.matcher.toEmbedUrl(result.data);
}
```

#### Custom Matcher Migration

```typescript
// Before (v1)
const MyProvider: EmbedProvider = {
  name: "MyService",
  canParseUrl(url) { return url.includes("myservice.com"); },
  getIdFromUrl(url) { return url.match(/\/v\/(\w+)/)?.[1] ?? ""; },
  getEmbedUrlFromId(id) { return `https://myservice.com/embed/${id}`; },
};

// After (v2)
import { defineIframeMatcher } from "@social-embed/lib";
const MyMatcher = defineIframeMatcher({
  name: "MyService",
  domains: ["myservice.com"],
  patterns: [/myservice\.com\/v\/(\w+)/],
  embedUrl: (id) => `https://myservice.com/embed/${id}`,
});
```

---

## Upcoming release

<!-- _Enter the most recent changes here_ -->

## 0.1.0-next.11 (2026-01-01)

### Enhancements

- **YouTube Shorts support**: Added detection and handling for YouTube Shorts URLs ([#51](https://github.com/social-embed/social-embed/pull/51))
  - New `isYouTubeShortsUrl()` helper to detect `/shorts/VIDEO_ID` patterns
  - New `YOUTUBE_SHORTS_DIMENSIONS` constant for portrait aspect ratio (347×616)
  - Updated `youTubeUrlRegex` to capture Shorts video IDs
  - Fixed regex to properly handle URL fragments (`#`) in addition to query parameters

### Development

- **Type Safety**: Improved test suite with built-in type checking (#42)
  - Added dedicated Vitest configuration with type checking enabled
  - Support for declarative type tests using `.test-d.ts` files
  - Isolated package type checking to prevent cross-package type leakage

- **Build System**: TypeScript and tooling improvements (#45)
  - Updated `moduleResolution` to `"bundler"` for Vite 5+ compatibility
  - Added `skipLibCheck` to avoid third-party type declaration issues
  - Fixed package.json exports to include explicit types field
  - Applied Biome 2.0 formatting with improved import sorting

### Documentation

- **Domain migration**: Documentation links updated from `social-embed.git-pull.com` to `social-embed.org`

- **README overhaul**: Enhanced documentation with:
  - Better explanation of utility functions and their usage
  - Improved installation instructions for different package managers
  - More comprehensive examples for each supported platform
  - Clearer structure and formatting

_Additional details on the next release will go here._

## 0.1.0-next.10 (2025-01-05)

### Breaking Changes

- **Remove `Provider` enum** in favor of a **provider registry** or name-based detection.
  - All references to `Provider.*` are removed.
  - `getProviderFromUrl(url)` now returns an **object** with a `.name` field (e.g. `"YouTube"`) instead of an enum entry.
  - `ProviderIdFunctionMap` and `ProviderIdUrlFunctionMap` no longer needed. Each provider is handled in its own module or by calling `convertUrlToEmbedUrl(url)`.

### Enhancements

- **Flexible provider approach**:
  - Each provider has a consistent shape (`name`, `getIdFromUrl`, `getEmbedUrlFromId`).
  - A new or custom provider can be added to a registry or used independently without updating an enum.
- **Spotify**: Extended detection/embedding beyond just `track`, `album`, `playlist` to **also support** `artist`, `show`, and `episode` links.
- **Improved TSDoc**: Various files now include richer doc comments for Typedoc/TypeDoc generation.

### Tests

- **Refactored unit tests** to remove references to the old `Provider` enum.
- **New tests** confirm that URL detection works with the new registry approach or direct function calls.

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

- Added normal documentation:
  https://social-embed.org/lib/
- YouTube: Move back to single file
- [#30](https://github.com/social-embed/social-embed/pull/30): Add loom, wistia
  and edpuzzle

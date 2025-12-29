# @social-embed/lib API Redesign — External Review Request

> **Date**: 2025-12-29
> **Context**: Seeking expert feedback on API design decisions before v2.0 release
> **Branch**: `refactor-registry`

---

## Project Overview

**social-embed** is a lightweight, browser-friendly toolkit for transforming media URLs into embeddable content. It converts URLs from YouTube, Spotify, Vimeo, DailyMotion, and other platforms into iframe embeds with **zero server-side dependencies**.

### Packages

| Package | Purpose | Status |
|---------|---------|--------|
| `@social-embed/lib` | Core library — URL parsing, embed URL generation | API redesign in progress |
| `@social-embed/wc` | Web Component (`<o-embed>`) — drop-in HTML element | Stable |

### Target Use Cases

- Content Management Systems (user-generated content)
- Markdown editors with auto-embed
- JSFiddle / CodePen / AI canvas environments (ChatGPT/Claude/Gemini artifacts)
- SSR frameworks (Next.js, Astro, etc.)
- WYSIWYG editors

### Target Environments

| Constraint | Decision |
|------------|----------|
| Runtime | Modern browsers (2025+), Node.js 18+, Deno, Bun, Edge workers |
| Module format | ESM-only (no UMD/CommonJS for new API) |
| CDN usage | Optimized for `esm.sh`, unpkg, JSFiddle |
| Dependencies | Zero runtime dependencies |
| Bundle size | Critical — tree-shakable, separate entry points |

---

## The Redesign: v1 → v2

### v1 API (Current stable)

Simple, imperative functions:

```typescript
import { convertUrlToEmbedUrl, getYouTubeIdFromUrl } from "@social-embed/lib";

// One-liner for common case
const embedUrl = convertUrlToEmbedUrl("https://youtu.be/abc123");
// => "https://www.youtube.com/embed/abc123"

// Extract ID if needed
const videoId = getYouTubeIdFromUrl("https://youtu.be/abc123");
// => "abc123"
```

### v2 API (Proposed redesign)

Registry-based architecture with type-safe matchers:

```typescript
import { MatcherRegistry } from "@social-embed/lib";

const registry = MatcherRegistry.withDefaults();

// Match and get typed result
const result = registry.match("https://youtu.be/abc123");
if (result.ok) {
  console.log(result.matcher.name);  // "YouTube"
  console.log(result.data.videoId);   // "abc123"
}

// Generate embed URL (privacy-enhanced by default)
const embedUrl = registry.toEmbedUrl("https://youtu.be/abc123");
// => "https://www.youtube-nocookie.com/embed/abc123"

// Generate structured output for SSR
const output = registry.toOutput("https://youtu.be/abc123", { width: 800 });
// => { nodes: [{ type: "iframe", src: "...", attributes: {...} }] }
```

---

## Core Types (v2)

### Result<T> — Explicit Error Handling

```typescript
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: MatchError };

interface MatchError {
  code: "NO_MATCH" | "INVALID_FORMAT" | "MISSING_ID" | "PARSE_ERROR";
  message: string;
  fatal?: boolean;  // If true, stop trying other matchers
}
```

### UrlMatcher<TName, TData, TOptions> — Type-Safe Matchers

```typescript
interface UrlMatcher<TName extends string, TParseResult, TRenderOptions> {
  readonly name: TName;
  readonly domains?: readonly string[];     // For O(1) dispatch
  readonly schemes?: readonly string[];     // For spotify: URIs
  readonly supportsPrivacyMode?: boolean;

  canMatch(ctx: MatchContext): boolean;
  parse(ctx: MatchContext): Result<TParseResult>;
  toEmbedUrl(data: TParseResult, options?: PrivacyOptions & TRenderOptions): string;
  toOutput(data: TParseResult, options?: OutputOptions & TRenderOptions): EmbedOutput;
}
```

### EmbedOutput — SSR-Safe Structured Output

```typescript
interface EmbedOutput {
  nodes: EmbedNode[];
  scripts?: ScriptRequest[];  // Future: Twitter, Instagram
  styles?: StyleChunk[];
}

type EmbedNode =
  | { type: "iframe"; src: string; attributes: Record<string, string> }
  | { type: "html"; content: string };  // For blockquote-based embeds
```

### MatcherRegistry — Indexed Dispatch

```typescript
class MatcherRegistry {
  // Construction
  static create(matchers?, options?): MatcherRegistry;
  static withDefaults(): MatcherRegistry;

  // Immutable composition
  with(...matchers): MatcherRegistry;      // Returns NEW registry
  without(...names): MatcherRegistry;

  // Mutable augmentation (for CDN/runtime scenarios)
  register(matcher, options?): this;       // Modifies IN PLACE
  unregister(name): this;

  // Core operations
  match(url: string): MatchResult;
  toEmbedUrl(url: string, options?): string | undefined;
  toOutput(url: string, options?): EmbedOutput | undefined;

  // Discovery
  list(): UrlMatcher[];
  get(name: string): UrlMatcher | undefined;
  has(name: string): boolean;
}
```

### Factory Functions

```typescript
// Config-driven iframe matchers
const YouTubeMatcher = defineIframeMatcher({
  name: "YouTube",
  domains: ["youtube.com", "youtu.be"],
  patterns: [/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, /youtu\.be\/([a-zA-Z0-9_-]{11})/],
  embedUrl: (id, { privacy = true }) =>
    privacy ? `https://www.youtube-nocookie.com/embed/${id}` : `https://www.youtube.com/embed/${id}`,
  supportsPrivacyMode: true,
});

// Future: script-hydrated embeds
const TwitterMatcher = defineScriptMatcher({
  name: "Twitter",
  domains: ["twitter.com", "x.com"],
  patterns: [/(?:twitter|x)\.com\/\w+\/status\/(\d+)/],
  renderPlaceholder: (data) => `<blockquote class="twitter-tweet">...</blockquote>`,
  script: { src: "https://platform.twitter.com/widgets.js", dedupeKey: "twitter-widgets" },
});
```

### Browser Module (SSR Split)

```typescript
// Core: SSR-safe, no DOM APIs
import { MatcherRegistry, renderOutput } from "@social-embed/lib";

// Browser-only: DOM mounting
import { mount } from "@social-embed/lib/browser";
await mount(output, { container: "#embed" });
```

---

## Design Rationale

| Decision | Rationale |
|----------|-----------|
| **Registry pattern** | Scale to hundreds of matchers without linear scanning |
| **O(1) domain dispatch** | `byDomain: Map<string, Matcher[]>` for fast lookup |
| **Result<T> monad** | Explicit error handling, no silent failures |
| **Privacy-by-default** | YouTube uses `youtube-nocookie.com` unless `privacy: false` |
| **SSR-safe core** | All matchers return strings/data, no DOM APIs |
| **Browser subpath** | `/browser` contains DOM-specific code (`mount()`) |
| **Both mutability patterns** | `.with()` for functional, `.register()` for runtime/CDN |
| **Type-safe parse results** | Each matcher has typed `TParseResult` |

---

## Questions for Reviewers

### 1. Simplicity vs Power Trade-off

**v1** was simple:
```typescript
const embedUrl = convertUrlToEmbedUrl(url);
```

**v2** requires ceremony:
```typescript
const registry = MatcherRegistry.withDefaults();
const embedUrl = registry.toEmbedUrl(url);
```

**Question**: Should we export convenience functions that use a default singleton?
```typescript
// Proposed addition
import { toEmbedUrl } from "@social-embed/lib";
const embedUrl = toEmbedUrl(url);  // Uses default registry internally
```

### 2. Dual Mutability Model

The registry supports both patterns:
```typescript
// Immutable — returns new registry
const r2 = registry.with(newMatcher);

// Mutable — modifies in place
registry.register(newMatcher);
```

**Question**: Is this confusing? Should we pick one pattern? If so, which?

### 3. Method Naming

- `toOutput()` returns `EmbedOutput` — tautological?
- `renderOutput()` is a standalone function, not a method

**Question**: Better names? Should `renderOutput()` be `output.render()` or `registry.render(output)`?

### 4. MatchContext Exposure

Matchers receive pre-parsed URL context:
```typescript
interface MatchContext {
  raw: string;
  parsed: { hostname, pathname, searchParams, ... };
  host?: string;
  scheme?: string;
}
```

**Question**: Does exposing internal parsing structure lock us into implementation details? Would `canMatch(url: string)` be safer for custom matchers?

### 5. Factory Naming

`defineIframeMatcher()` vs `defineScriptMatcher()` exposes implementation details.

**Question**: If a provider changes from iframe to script-hydrated, the factory name is conceptually wrong. Better approach?

### 6. Web Component Provider-Specific Attributes

The `<o-embed>` component has Spotify-specific attributes:
```html
<o-embed url="..." spotify-size="compact" spotify-theme="dark"></o-embed>
```

**Question**: This creates precedent for `twitter-conversation`, `instagram-captioned`, etc. Should we rely solely on the `provider-options` escape hatch?
```html
<o-embed url="..." provider-options='{"size":"compact","theme":"dark"}'></o-embed>
```

### 7. Metadata Extraction Ergonomics

Extracting typed metadata requires type casting:
```typescript
const result = registry.match(url);
if (result.ok && result.matcher.name === "YouTube") {
  const { videoId } = result.data as YouTubeData;  // Cast required
}
```

**Question**: Should we add type-safe extraction?
```typescript
const youtube = registry.matchWith(url, YouTubeMatcher);
if (youtube.ok) {
  youtube.data.videoId;  // Fully typed, no cast
}
```

### 8. Error Code Design

Current codes: `NO_MATCH`, `INVALID_FORMAT`, `MISSING_ID`, `PARSE_ERROR`

**Question**: Are these sufficient? Too granular? Missing any important cases?

---

## Identified Strengths

1. **Result<T> monad** — Major improvement over nullable returns
2. **Privacy-by-default** — Right stance for modern web
3. **O(1) domain dispatch** — Scales to hundreds of matchers
4. **SSR-safe core split** — Clean `/browser` separation
5. **Type-safe parse results** — Each matcher returns typed data
6. **Factory pattern** — `defineIframeMatcher()` is ergonomic for simple cases
7. **Future-proof architecture** — Supports script-hydrated embeds (Twitter, Instagram)

---

## Identified Concerns

1. **Simple things aren't simple** — v2 adds ceremony to the common case
2. **`toOutput()` naming** — Generic, doesn't communicate what kind of output
3. **Provider-specific attribute proliferation** — WC has Spotify-specific attrs
4. **Dual mutability model** — `.with()` + `.register()` on same class is confusing
5. **Factory naming leak** — `defineIframeMatcher` exposes implementation
6. **Metadata extraction friction** — Type casting required
7. **`MatchContext` commitment** — Exposed structure may lock implementation
8. **`renderOutput()` discoverability** — Global function feels disconnected

---

## Appendix: Current Matchers

| Matcher | Domains | Parse Result | Notes |
|---------|---------|--------------|-------|
| YouTube | youtube.com, youtu.be | `{ videoId }` | Privacy mode uses youtube-nocookie.com |
| Spotify | spotify.com, open.spotify.com | `{ id, contentType }` | 6 content types, complex height logic |
| Vimeo | vimeo.com | `{ videoId }` | |
| DailyMotion | dailymotion.com | `{ videoId }` | |
| Loom | loom.com | `{ videoId }` | |
| Wistia | wistia.com | `{ videoId }` | |
| EdPuzzle | edpuzzle.com | `{ mediaId }` | |

---

## Links

- **Repository**: [github.com/user/social-embed](https://github.com/user/social-embed) *(update with actual URL)*
- **Live docs**: https://social-embed.org/
- **Branch with changes**: `refactor-registry`
- **Design doc**: `notes/plan.md` in repository

---

## Feedback Format

Please respond with:
1. **Overall impression** — Does this redesign make sense?
2. **Concerns** — What would you push back on?
3. **Suggestions** — Specific API changes you'd recommend
4. **Questions** — Anything unclear from this document?

Thank you for your time!

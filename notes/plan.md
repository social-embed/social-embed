# @social-embed/lib API Redesign Proposal

> **Status**: RFC - Requesting feedback before implementation
> **Breaking**: Yes - Replaces `EmbedProvider`/`EmbedProviderRegistry` API

## Goals

1. **Type-safe** - Full TypeScript inference for parse results and options per matcher
2. **Flexible** - Support both simple (regex-based) and bespoke (custom function) matchers
3. **Runtime-augmentable** - Registries can be modified after construction
4. **HTML generation** - Lib generates iframe HTML, WC becomes thin wrapper
5. **Generic** - `UrlMatcher` naming works beyond embeds (metadata extraction, routing, etc.)

---

## Core API

### UrlMatcher Interface

```typescript
interface UrlMatcher<
  TName extends string = string,
  TParseResult = unknown,
  TRenderOptions = void
> {
  readonly name: TName;

  /** Quick check if this matcher handles the URL */
  canMatch(url: string): boolean;

  /** Parse URL into structured data */
  parse(url: string): ParseResult<TParseResult>;

  /** Generate embed URL from parsed data */
  toEmbedUrl(data: TParseResult, options?: TRenderOptions): string;

  /** Generate iframe HTML from parsed data */
  toHtml(data: TParseResult, options?: HtmlOptions & TRenderOptions): string;
}

interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface HtmlOptions {
  width?: string | number;
  height?: string | number;
  className?: string;
  attributes?: Record<string, string>;
}
```

### MatcherRegistry

```typescript
class MatcherRegistry {
  // Construction
  static create(matchers?: MatcherInput[]): MatcherRegistry;
  static withDefaults(): MatcherRegistry;  // All built-in matchers

  // Immutable composition (returns NEW registry)
  with(...matchers: MatcherInput[]): MatcherRegistry;
  without(...names: string[]): MatcherRegistry;

  // Mutable augmentation (modifies IN PLACE)
  register(matcher: UrlMatcher): this;
  unregister(name: string): this;

  // Core operations
  match(url: string): MatchResult | undefined;
  parse(url: string): { matcher: UrlMatcher; data: unknown } | undefined;
  toEmbedUrl(url: string): string | undefined;
  toHtml(url: string, options?: HtmlOptions): string | undefined;

  // Discovery
  list(): UrlMatcher[];
  get(name: string): UrlMatcher | undefined;
  has(name: string): boolean;
}
```

---

## Two-Tier Matcher System

### Simple Matchers (config-driven)

For straightforward providers with regex patterns and template URLs:

```typescript
import { defineSimpleMatcher } from "@social-embed/lib";

const YouTubeMatcher = defineSimpleMatcher({
  name: "YouTube",
  patterns: [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ],
  embedUrl: (id) => `https://www.youtube.com/embed/${id}`,
  defaultDimensions: { width: 560, height: 315 },
  iframeAttributes: { frameborder: "0" },
});
```

### Bespoke Matchers (full control)

For complex providers requiring custom logic:

```typescript
const SpotifyMatcher: UrlMatcher<"Spotify", SpotifyData, SpotifyOptions> = {
  name: "Spotify",

  canMatch(url) {
    return /spotify\.com/.test(url) || /^spotify:/.test(url);
  },

  parse(url) {
    // Custom parsing for both URLs and URIs
    // Returns { id, contentType: "track" | "album" | ... }
  },

  toEmbedUrl(data, options) {
    return `https://open.spotify.com/embed/${data.contentType}/${data.id}`;
  },

  toHtml(data, options) {
    // Custom HTML with special attributes like allowtransparency
  },
};
```

---

## Usage Examples

### Basic Usage

```typescript
import { MatcherRegistry } from "@social-embed/lib";

const registry = MatcherRegistry.withDefaults();

// Get embed URL
const embedUrl = registry.toEmbedUrl("https://youtu.be/abc123");
// => "https://www.youtube.com/embed/abc123"

// Get HTML
const html = registry.toHtml("https://youtu.be/abc123", { width: 800 });
// => '<iframe src="https://www.youtube.com/embed/abc123" width="800" ...></iframe>'
```

### Custom Matcher + Defaults

```typescript
import { MatcherRegistry, defineSimpleMatcher } from "@social-embed/lib";

const TikTokMatcher = defineSimpleMatcher({
  name: "TikTok",
  patterns: [/tiktok\.com\/@[\w]+\/video\/(\d+)/],
  embedUrl: (id) => `https://www.tiktok.com/embed/${id}`,
  defaultDimensions: { width: 325, height: 580 },
});

// Immutable: returns new registry
const registry = MatcherRegistry.withDefaults().with(TikTokMatcher);
```

### Runtime Augmentation

```typescript
import { MatcherRegistry, matchers } from "@social-embed/lib";

// Create mutable registry
const registry = MatcherRegistry.withDefaults();

// Augment at runtime (mutates in place)
registry.register(MyCustomMatcher);
registry.unregister("DailyMotion");
```

### Subset of Providers

```typescript
import { matchers, MatcherRegistry } from "@social-embed/lib";

// Only video providers
const videoOnly = MatcherRegistry.create([
  matchers.YouTube,
  matchers.Vimeo,
  matchers.Loom,
]);

// All except specific ones
const filtered = MatcherRegistry.withDefaults().without("DailyMotion", "Wistia");
```

### Metadata Extraction

```typescript
const result = registry.parse("https://open.spotify.com/track/abc123");

if (result) {
  console.log(result.matcher.name);  // "Spotify"
  console.log(result.data);          // { id: "abc123", contentType: "track" }
}
```

### Browser/CDN Usage (ESM)

```html
<script type="module">
  import { MatcherRegistry } from "https://esm.sh/@social-embed/lib";

  const registry = MatcherRegistry.withDefaults();
  document.body.innerHTML = registry.toHtml("https://youtu.be/abc123");
</script>
```

---

## Provider-Specific Types

```typescript
// YouTube - simple string ID
interface YouTubeData { videoId: string }

// Spotify - discriminated content type
type SpotifyContentType = "track" | "album" | "playlist" | "artist" | "show" | "episode";
interface SpotifyData { id: string; contentType: SpotifyContentType }

// Vimeo
interface VimeoData { videoId: string }

// DailyMotion
interface DailyMotionData { videoId: string }

// Loom
interface LoomData { videoId: string }

// Wistia
interface WistiaData { videoId: string }

// EdPuzzle
interface EdPuzzleData { mediaId: string }
```

---

## WC Integration

The web component becomes a thin wrapper around the lib:

```typescript
import { MatcherRegistry } from "@social-embed/lib";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

class OEmbedElement extends LitElement {
  @property() url = "";
  @property({ type: Number }) width?: number;
  @property({ type: Number }) height?: number;

  registry: MatcherRegistry = MatcherRegistry.withDefaults();

  render() {
    const html = this.registry.toHtml(this.url, {
      width: this.width,
      height: this.height,
    });
    return html ? unsafeHTML(html) : this.renderFallback();
  }
}
```

---

## Open Questions

1. **Should `toHtml()` be optional on the interface?** Some use cases only need `parse()` or `toEmbedUrl()`.

2. **Error handling strategy**: Should `parse()` throw or return `{ success: false }`? Currently proposing result type.

3. **Registry immutability default**: Should `.with()` be the only way to add matchers, or keep mutable `.register()` for runtime scenarios?

4. **Matcher priority/ordering**: When multiple matchers could match a URL, how do we handle priority? First-registered wins?

5. **HTML escaping**: Should we use a dependency like `he` or roll our own minimal escaper?

---

## Feedback Requested

- Does the two-tier (simple/bespoke) matcher system make sense?
- Is the immutable (`.with()`) vs mutable (`.register()`) distinction clear and useful?
- Any concerns about the type-safe generic approach?
- Suggestions for the API naming?

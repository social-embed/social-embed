# @social-embed/lib API Redesign Proposal

> **Status**: RFC - Validated by expert review, ready for implementation
> **Breaking**: Yes - Replaces `EmbedProvider`/`EmbedProviderRegistry` API
> **Version**: 2.0 (clean slate)

---

## Target Environment

| Constraint | Decision |
|------------|----------|
| **Runtime** | Modern browsers (2025+), Node.js 18+, Deno, Bun, Edge workers |
| **Module format** | ESM-only. No UMD/CommonJS. |
| **CDN usage** | Optimized for `esm.sh`, JSFiddle, CodePen, AI canvas embeds (ChatGPT/Claude/Gemini artifacts) |
| **TypeScript** | Full inference, strict mode. No specific version constraints beyond modern TS. |
| **Dependencies** | Minimal, vetted. Small trusted deps OK (e.g., `he` for HTML escaping). |
| **Bundle size** | Critical. Tree-shakable. Separate entry points per matcher. |

---

## Validated Decisions (from expert review)

| Question | Decision | Rationale |
|----------|----------|-----------|
| Backward compatibility | **Clean break** | No existing users to migrate |
| SSR support | **Required** | All methods must be pure strings, no DOM APIs |
| Privacy-by-default | **Yes** | `youtube-nocookie.com` by default, DNT attributes |
| oEmbed integration | **No** | Matcher-only, no network fetching |
| Matcher scale | **Hundreds** | Need indexed dispatch, not linear scan |
| Conflict resolution | **Priority + custom** | Priority scores + optional custom resolver |
| Parser/Renderer split | **Keep bundled** | Single `UrlMatcher` interface for simplicity |
| HTML escaping | **Vetted dep** | Use `he` library for robustness |

---

## Goals

1. **Type-safe** - Full TypeScript inference for parse results and options per matcher
2. **Privacy-first** - Privacy-enhanced embeds by default
3. **SSR-safe** - No DOM APIs, pure string transformations
4. **Scalable** - Indexed dispatch for hundreds of matchers
5. **Flexible** - Simple (config-driven) and bespoke (custom function) matchers
6. **Runtime-augmentable** - Mutable registry for CDN/canvas scenarios
7. **Tree-shakable** - Separate entry points for minimal bundles

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

  /**
   * Domains this matcher handles (for indexed dispatch).
   * Required for simple matchers. Omit only for cross-domain matchers.
   * @example ["youtube.com", "youtu.be"]
   */
  readonly domains?: readonly string[];

  /**
   * Whether this matcher supports privacy-enhanced mode.
   * @example YouTube → youtube-nocookie.com
   */
  readonly supportsPrivacyMode?: boolean;

  /** Quick check if this matcher handles the URL */
  canMatch(url: string): boolean;

  /**
   * Parse URL into structured data.
   * ⚠️ SSR-safe: no DOM APIs (document, window, etc.)
   */
  parse(url: string): ParseResult<TParseResult>;

  /**
   * Generate embed URL from parsed data.
   * ⚠️ SSR-safe: pure string transformation.
   */
  toEmbedUrl(data: TParseResult, options?: PrivacyOptions & TRenderOptions): string;

  /**
   * Generate iframe HTML from parsed data.
   * ⚠️ SSR-safe: no DOM APIs, returns string only.
   */
  toHtml(data: TParseResult, options?: HtmlOptions & PrivacyOptions & TRenderOptions): string;
}

interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: ParseError;
}

/** Structured error for property-based testing */
interface ParseError {
  code: "NO_MATCH" | "INVALID_FORMAT" | "MISSING_ID" | "UNKNOWN";
  message: string;
}

/** Privacy options - enabled by default */
interface PrivacyOptions {
  /**
   * Enable privacy-enhanced mode (default: true).
   * - YouTube: uses youtube-nocookie.com
   * - Others: adds DNT/tracking-prevention attributes
   */
  privacy?: boolean;
}

interface HtmlOptions {
  width?: string | number;
  height?: string | number;
  className?: string;
  attributes?: Record<string, string>;
}
```

### MatcherRegistry (with indexed dispatch)

```typescript
class MatcherRegistry {
  // Internal indexes for O(1) domain lookup
  private byDomain: Map<string, UrlMatcher[]>;
  private byName: Map<string, UrlMatcher>;
  private wildcards: UrlMatcher[];

  // Construction
  static create(
    matchers?: MatcherInput[],
    options?: {
      resolver?: (candidates: UrlMatcher[], url: string) => UrlMatcher | undefined;
    }
  ): MatcherRegistry;
  static withDefaults(): MatcherRegistry;

  // Immutable composition (returns NEW registry)
  with(...matchers: MatcherInput[]): MatcherRegistry;
  without(...names: string[]): MatcherRegistry;

  // Mutable augmentation (modifies IN PLACE) - for runtime/CDN scenarios
  register(matcher: UrlMatcher, options?: { priority?: number }): this;
  unregister(name: string): this;

  // Core operations
  match(url: string): MatchResult | undefined;
  parse(url: string): { matcher: UrlMatcher; data: unknown } | undefined;
  toEmbedUrl(url: string, options?: PrivacyOptions): string | undefined;
  toHtml(url: string, options?: HtmlOptions & PrivacyOptions): string | undefined;

  // Discovery
  list(): UrlMatcher[];
  get(name: string): UrlMatcher | undefined;
  has(name: string): boolean;
}
```

**Indexed dispatch algorithm:**
1. Extract domain from URL (fast, no regex)
2. Look up domain in `byDomain` map → O(1)
3. Scan only that domain's matchers (typically 1-2)
4. Fall back to wildcards if no match
5. Resolve conflicts via priority score, then registration order

---

## Two-Tier Matcher System

### Simple Matchers (config-driven)

```typescript
import { defineSimpleMatcher } from "@social-embed/lib";

const YouTubeMatcher = defineSimpleMatcher({
  name: "YouTube",
  domains: ["youtube.com", "youtu.be", "youtube-nocookie.com"],
  patterns: [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ],
  // Privacy mode uses youtube-nocookie.com by default
  embedUrl: (id, { privacy = true } = {}) =>
    privacy
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : `https://www.youtube.com/embed/${id}`,
  defaultDimensions: { width: 560, height: 315 },
  supportsPrivacyMode: true,
});
```

### Bespoke Matchers (full control)

```typescript
const SpotifyMatcher: UrlMatcher<"Spotify", SpotifyData, SpotifyOptions> = {
  name: "Spotify",
  domains: ["spotify.com", "open.spotify.com"],
  supportsPrivacyMode: false,

  canMatch(url) {
    return /spotify\.com/.test(url) || /^spotify:/.test(url);
  },

  parse(url) {
    // Returns { id, contentType: "track" | "album" | ... }
  },

  toEmbedUrl(data) {
    return `https://open.spotify.com/embed/${data.contentType}/${data.id}`;
  },

  toHtml(data, options) {
    // Custom HTML with allowtransparency, encrypted-media
  },
};
```

---

## Usage Examples

### Basic Usage

```typescript
import { MatcherRegistry } from "@social-embed/lib";

const registry = MatcherRegistry.withDefaults();

// Privacy-enhanced by default
const embedUrl = registry.toEmbedUrl("https://youtu.be/abc123");
// => "https://www.youtube-nocookie.com/embed/abc123"

const html = registry.toHtml("https://youtu.be/abc123", { width: 800 });
// => '<iframe src="https://www.youtube-nocookie.com/embed/abc123" width="800" ...></iframe>'

// Opt out of privacy mode
const regularUrl = registry.toEmbedUrl("https://youtu.be/abc123", { privacy: false });
// => "https://www.youtube.com/embed/abc123"
```

### CDN / JSFiddle / AI Canvas Usage

```html
<script type="module">
  import { MatcherRegistry, matchers, defineSimpleMatcher } from "https://esm.sh/@social-embed/lib";

  // Use defaults
  const registry = MatcherRegistry.withDefaults();
  document.body.innerHTML = registry.toHtml("https://youtu.be/abc123");

  // Or add custom matchers at runtime
  const TikTok = defineSimpleMatcher({
    name: "TikTok",
    domains: ["tiktok.com"],
    patterns: [/tiktok\.com\/@[\w]+\/video\/(\d+)/],
    embedUrl: (id) => `https://www.tiktok.com/embed/${id}`,
    defaultDimensions: { width: 325, height: 580 },
  });

  registry.register(TikTok);
</script>
```

### Minimal Bundle (tree-shaking)

```typescript
// Only import what you need
import { MatcherRegistry } from "@social-embed/lib/registry";
import { YouTubeMatcher } from "@social-embed/lib/matchers/youtube";
import { VimeoMatcher } from "@social-embed/lib/matchers/vimeo";

const registry = MatcherRegistry.create([YouTubeMatcher, VimeoMatcher]);
```

### Conflict Resolution

```typescript
// Register with priority (higher = checked first)
registry.register(SpecificMatcher, { priority: 10 });
registry.register(GenericMatcher, { priority: 0 });

// Or use custom resolver
const registry = MatcherRegistry.create(matchers, {
  resolver: (candidates, url) => {
    // Custom logic to pick winner
    return candidates.find(m => m.name === "YouTube") ?? candidates[0];
  }
});
```

### Metadata Extraction

```typescript
const result = registry.parse("https://open.spotify.com/track/abc123");

if (result) {
  console.log(result.matcher.name);  // "Spotify"
  console.log(result.data);          // { id: "abc123", contentType: "track" }
}
```

---

## Package Exports

```json
{
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./registry": "./dist/registry.js",
    "./matchers/youtube": "./dist/matchers/youtube.js",
    "./matchers/spotify": "./dist/matchers/spotify.js",
    "./matchers/vimeo": "./dist/matchers/vimeo.js",
    "./matchers/*": "./dist/matchers/*.js"
  }
}
```

---

## SSR Enforcement

All matchers must be SSR-safe. Enforced via:

1. **Type-level**: Methods return `string`, not DOM nodes
2. **Lint rule**: ESLint forbids `document`, `window`, `HTMLElement` in matcher files
3. **Test-time**: Run in Node.js without DOM polyfills
4. **Documentation**: JSDoc warnings on all interface methods

---

## Provider-Specific Types

```typescript
interface YouTubeData { videoId: string }

type SpotifyContentType = "track" | "album" | "playlist" | "artist" | "show" | "episode";
interface SpotifyData { id: string; contentType: SpotifyContentType }

interface VimeoData { videoId: string }
interface DailyMotionData { videoId: string }
interface LoomData { videoId: string }
interface WistiaData { videoId: string }
interface EdPuzzleData { mediaId: string }
```

---

## WC Integration

The web component becomes a thin wrapper:

```typescript
import { MatcherRegistry } from "@social-embed/lib";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

class OEmbedElement extends LitElement {
  @property() url = "";
  @property({ type: Number }) width?: number;
  @property({ type: Number }) height?: number;
  @property({ type: Boolean }) privacy = true;

  registry: MatcherRegistry = MatcherRegistry.withDefaults();

  render() {
    const html = this.registry.toHtml(this.url, {
      width: this.width,
      height: this.height,
      privacy: this.privacy,
    });
    return html ? unsafeHTML(html) : this.renderFallback();
  }
}
```

---

## Resolved Questions

| Question | Resolution |
|----------|------------|
| `toHtml()` optional? | No - keep required. Use `parse()` + `toEmbedUrl()` for metadata-only |
| Error handling | Result type `{ success, data?, error? }` - no throwing |
| Registry mutability | Both: `.with()` for immutable, `.register()` for runtime |
| Matcher priority | Priority score (higher wins), then registration order, with custom resolver option |
| HTML escaping | Use `he` library for robustness |

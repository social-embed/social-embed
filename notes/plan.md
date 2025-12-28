# @social-embed/lib API Redesign Proposal

> **Status**: RFC - Validated by expert review, ready for implementation
> **Breaking**: Yes - Replaces `EmbedProvider`/`EmbedProviderRegistry` API
> **Version**: 2.0 (clean slate)

---

## Architecture Direction (Endorsed)

| Decision | Status | Implementation |
|----------|--------|----------------|
| Core/browser split | **Endorsed** | SSR-safe core, browser module for DOM execution |
| Script-hydrated embeds | **Future-proof** | Architecture supports, not v1 scope |
| Type complexity | **Worth it** | Correlated match typing, Result<T> monad |

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
8. **Future-proof** - Architecture supports script-hydrated embeds (Twitter, Instagram)

---

## New Architecture: Core Types

### Result Type (Error Handling)

```typescript
export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: MatchError };

export interface MatchError {
  code: "NO_MATCH" | "INVALID_FORMAT" | "MISSING_ID" | "PARSE_ERROR";
  message: string;
  /** If true, no other matcher should attempt this URL */
  fatal?: boolean;
}
```

### EmbedOutput Model

```typescript
/**
 * Structured output that describes an embed without executing it.
 * SSR-safe: no DOM APIs, pure data.
 */
export interface EmbedOutput {
  nodes: EmbedNode[];
  scripts?: ScriptRequest[];  // Future: Twitter, Instagram
  styles?: StyleChunk[];      // Future
}

export type EmbedNode =
  | { type: "iframe"; src: string; attributes: Record<string, string> }
  | { type: "html"; content: string };  // For blockquote-based embeds
```

### MatchContext (Parse Once, Match Many)

```typescript
export interface MatchContext {
  raw: string;
  parsed: ParsedInput;
  host?: string;
  scheme?: string;
}

export function createContext(input: string): Result<MatchContext>;
```

---

## Core/Browser Split

```
@social-embed/lib
├── /              # Core (SSR-safe, no DOM)
│   ├── index.ts
│   ├── registry.ts
│   └── matchers/
│
└── /browser       # Browser-only (DOM execution)
    └── mount.ts   # Executes EmbedOutput in DOM
```

### Browser Mount Function

```typescript
import { mount } from "@social-embed/lib/browser";

const output = registry.toOutput("https://youtu.be/abc123");
await mount(output, { container: "#embed" });
```

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
  readonly domains?: readonly string[];
  readonly schemes?: readonly string[];  // For spotify:, tel:, etc.
  readonly supportsPrivacyMode?: boolean;

  /** Quick check if this matcher handles the URL */
  canMatch(ctx: MatchContext): boolean;

  /** Parse URL into structured data. SSR-safe. */
  parse(ctx: MatchContext): Result<TParseResult>;

  /** Generate embed URL from parsed data. SSR-safe. */
  toEmbedUrl(data: TParseResult, options?: PrivacyOptions & TRenderOptions): string;

  /** Generate structured output. SSR-safe. */
  toOutput(data: TParseResult, options?: OutputOptions & PrivacyOptions & TRenderOptions): EmbedOutput;
}

/** Correlated match result - matcher name correlates with data type */
type MatchOk<M extends UrlMatcher> = {
  ok: true;
  matcher: M;
  data: M extends UrlMatcher<any, infer R, any> ? R : never;
};

type MatchResult<M extends UrlMatcher = UrlMatcher> =
  | MatchOk<M>
  | { ok: false; error: MatchError };

/** Privacy options - enabled by default */
interface PrivacyOptions {
  privacy?: boolean;  // default: true
}

interface OutputOptions {
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
  match(url: string): MatchResult;
  toEmbedUrl(url: string, options?: PrivacyOptions): string | undefined;
  toOutput(url: string, options?: OutputOptions & PrivacyOptions): EmbedOutput | undefined;

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

### Iframe Matchers (config-driven)

```typescript
import { defineIframeMatcher } from "@social-embed/lib";

const YouTubeMatcher = defineIframeMatcher({
  name: "YouTube",
  domains: ["youtube.com", "youtu.be", "youtube-nocookie.com"],
  patterns: [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ],
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
  schemes: ["spotify"],  // For spotify: URIs

  canMatch(ctx) {
    return ctx.host?.includes("spotify.com") || ctx.scheme === "spotify";
  },

  parse(ctx) {
    // Returns Result<{ id, contentType }>
  },

  toEmbedUrl(data) {
    return `https://open.spotify.com/embed/${data.contentType}/${data.id}`;
  },

  toOutput(data, options) {
    return {
      nodes: [{
        type: "iframe",
        src: this.toEmbedUrl(data),
        attributes: { allowtransparency: "true", allow: "encrypted-media" },
      }],
    };
  },
};
```

### Script Matchers (future: Twitter, Instagram)

```typescript
import { defineScriptMatcher } from "@social-embed/lib";

const TwitterMatcher = defineScriptMatcher({
  name: "Twitter",
  domains: ["twitter.com", "x.com"],
  patterns: [/(?:twitter|x)\.com\/\w+\/status\/(\d+)/],
  parseData: (ctx, match) => ({ tweetId: match[1] }),
  renderPlaceholder: (data) => `<blockquote class="twitter-tweet">...</blockquote>`,
  script: {
    src: "https://platform.twitter.com/widgets.js",
    dedupeKey: "twitter-widgets",
  },
});
```

---

## Usage Examples

### Basic Usage (SSR-Safe)

```typescript
import { MatcherRegistry, renderOutput } from "@social-embed/lib";

const registry = MatcherRegistry.withDefaults();

// Privacy-enhanced by default
const embedUrl = registry.toEmbedUrl("https://youtu.be/abc123");
// => "https://www.youtube-nocookie.com/embed/abc123"

// Get structured output
const output = registry.toOutput("https://youtu.be/abc123", { width: 800 });
// => { nodes: [{ type: "iframe", src: "...", attributes: {...} }] }

// Render to HTML string (SSR)
const html = renderOutput(output);
// => '<iframe src="https://www.youtube-nocookie.com/embed/abc123" width="800" ...></iframe>'
```

### Browser Usage with mount()

```typescript
import { MatcherRegistry } from "@social-embed/lib";
import { mount } from "@social-embed/lib/browser";

const registry = MatcherRegistry.withDefaults();
const output = registry.toOutput("https://youtu.be/abc123");

// Mount to DOM (handles script execution for future embeds)
await mount(output, { container: "#embed" });
```

### CDN / JSFiddle / AI Canvas Usage

```html
<script type="module">
  import { MatcherRegistry, defineIframeMatcher } from "https://esm.sh/@social-embed/lib";
  import { mount } from "https://esm.sh/@social-embed/lib/browser";

  const registry = MatcherRegistry.withDefaults();
  const output = registry.toOutput("https://youtu.be/abc123");
  await mount(output, { container: "#embed" });

  // Add custom matchers at runtime
  const TikTok = defineIframeMatcher({
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
const result = registry.match("https://open.spotify.com/track/abc123");

if (result.ok) {
  console.log(result.matcher.name);  // "Spotify"
  console.log(result.data);          // { id: "abc123", contentType: "track" }
} else {
  console.log(result.error.code);    // "NO_MATCH"
  console.log(result.error.fatal);   // false
}
```

---

## Package Exports

> ⚠️ **Note**: Need to verify `exports` field doesn't conflict with Vite's build system before finalizing.

```json
{
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./browser": "./dist/browser/index.js",
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
import { MatcherRegistry, renderOutput } from "@social-embed/lib";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

class OEmbedElement extends LitElement {
  @property() url = "";
  @property({ type: Number }) width?: number;
  @property({ type: Number }) height?: number;
  @property({ type: Boolean }) privacy = true;

  registry: MatcherRegistry = MatcherRegistry.withDefaults();

  render() {
    const output = this.registry.toOutput(this.url, {
      width: this.width,
      height: this.height,
      privacy: this.privacy,
    });
    return output ? unsafeHTML(renderOutput(output)) : this.renderFallback();
  }
}
```

---

## Resolved Questions

| Question | Resolution |
|----------|------------|
| Core/browser split | Yes - SSR-safe core, optional `/browser` for DOM execution |
| Script-hydrated embeds | Future-proof - architecture supports via `defineScriptMatcher` |
| Error handling | `Result<T>` monad: `{ ok: true, value } \| { ok: false, error }` |
| Registry mutability | Both: `.with()` for immutable, `.register()` for runtime |
| Matcher priority | Priority score (higher wins), then registration order, with custom resolver |
| HTML escaping | Use `he` library for robustness |
| Type complexity | Worth it - correlated match typing provides strong inference |

---

## Phase 10: ESM/CDN Optimization

> **Status**: Implementation Required
> **Added**: 2025-12-17
> **Goal**: Enable CDN usage via esm.sh, unpkg, JSFiddle, AI canvas environments

### Current State Analysis

The v2 refactor created the architecture but **build configuration is incomplete**:

| Aspect | Status | Issue |
|--------|--------|-------|
| `"type": "module"` | ✅ | ESM package |
| Dual ESM/CJS exports | ✅ | `lib.js` + `lib.umd.cjs` |
| Zero dependencies | ✅ | Pure JS, browser-safe |
| `/browser` subpath | ❌ | Only `.d.ts` files, no JS output! |
| `unpkg`/`browser` fields | ❌ | Missing from package.json |
| Source maps | ❌ | Not generated |
| IIFE for `<script>` tag | ❌ | Only ES/UMD formats |

### Critical Gap: `/browser` Subpath

**Source exists:**
```
src/browser/
├── index.ts      ← Re-exports mount, clearScriptCache
└── mount.ts      ← DOM-specific code
```

**Build output missing JS:**
```
dist/browser/
├── index.d.ts    ← Types only!
└── mount.d.ts    ← No .js files!
```

**Result:** `import { mount } from "@social-embed/lib/browser"` fails at runtime.

### Implementation Plan

#### Commit 1: Add `/browser` subpath export

**File: `packages/lib/package.json`**
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/lib.js",
      "require": "./dist/lib.umd.cjs"
    },
    "./browser": {
      "types": "./dist/browser/index.d.ts",
      "import": "./dist/browser/index.js",
      "require": "./dist/browser/index.cjs"
    }
  }
}
```

#### Commit 2: Update Vite config for multiple entries

**File: `packages/lib/vite.config.ts`**

Using Vite's multiple entry pattern (from `vite/playground/lib/vite.multiple-output.config.js`):

```typescript
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    sourcemap: true,  // Enable source maps
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "browser/index": resolve(__dirname, "src/browser/index.ts"),
      },
      name: "SocialEmbedLib",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        const ext = format === "es" ? "js" : "cjs";
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      output: {
        preserveModules: false,
      },
    },
  },
  plugins: [dts()],
});
```

#### Commit 3: Add CDN-friendly package.json fields

**File: `packages/lib/package.json`**
```json
{
  "unpkg": "./dist/lib.umd.cjs",
  "jsdelivr": "./dist/lib.umd.cjs",
  "browser": "./dist/lib.js",
  "sideEffects": false
}
```

#### Commit 4: Add IIFE build for `<script>` tag usage

Update vite.config.ts to include IIFE format:

```typescript
formats: ["es", "cjs", "iife"],
fileName: (format, entryName) => {
  if (format === "iife") return `${entryName}.global.js`;
  // ...
},
```

#### Commit 5: Add local CDN testing infrastructure

**Testing approaches (from research):**

1. **esm.sh local testing**: Use `?raw` query or self-host esm.sh server
2. **unpkg simulation**: Serve dist/ via local HTTP server
3. **verdaccio**: Local npm registry for full package testing

**File: `packages/lib/test/cdn.test.ts`**
```typescript
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("CDN compatibility", () => {
  it("should have browser subpath JS files", () => {
    const browserIndex = readFileSync("dist/browser/index.js", "utf-8");
    expect(browserIndex).toContain("mount");
  });

  it("should have valid UMD global", () => {
    const umd = readFileSync("dist/lib.umd.cjs", "utf-8");
    expect(umd).toContain("SocialEmbedLib");
  });
});
```

**File: `packages/lib/scripts/test-cdn.sh`**
```bash
#!/bin/bash
# Start local server and test CDN imports
npx serve dist -p 3333 &
SERVER_PID=$!

# Test ESM import
node --input-type=module -e "
  import('http://localhost:3333/lib.js')
    .then(m => console.log('ESM OK:', Object.keys(m)))
    .catch(e => { console.error('ESM FAIL:', e); process.exit(1); })
    .finally(() => process.kill($SERVER_PID));
"
```

#### Commit 6: Document CDN usage patterns

**File: `packages/lib/README.md`** (add section)
```markdown
## CDN Usage

### esm.sh (recommended)
\`\`\`html
<script type="module">
  import { MatcherRegistry } from "https://esm.sh/@social-embed/lib";
  import { mount } from "https://esm.sh/@social-embed/lib/browser";

  const registry = MatcherRegistry.withDefaults();
  const output = registry.toOutput("https://youtu.be/abc123");
  await mount(output, { container: "#embed" });
</script>
\`\`\`

### unpkg (UMD)
\`\`\`html
<script src="https://unpkg.com/@social-embed/lib"></script>
<script>
  const registry = SocialEmbedLib.MatcherRegistry.withDefaults();
</script>
\`\`\`

### JSFiddle / CodePen / AI Canvas
Use the esm.sh imports above in the JavaScript panel.
\`\`\`

### Local CDN Testing

To verify CDN compatibility locally before publishing:

```bash
# Build the package
pnpm run build

# Test with local server
pnpm run test:cdn

# Or manually with esm.sh raw mode simulation
npx serve dist -p 3333
# Then in browser: import("http://localhost:3333/lib.js")
```

### References

- [esm.sh CDN](https://esm.sh/) - No-build ESM CDN, auto-transforms CommonJS
- [unpkg](https://unpkg.com/) - Raw file CDN for npm packages
- [Vite Library Mode](https://vite.dev/guide/build.html#library-mode) - Build configuration patterns

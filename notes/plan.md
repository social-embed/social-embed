# @social-embed/lib API Redesign Proposal

> **Status**: ✅ IMPLEMENTED (2025-12-29)
> **Breaking**: Yes - Complete API redesign
> **Version**: 2.0 (clean slate)

---

## Implementation Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1.1 | ✅ | Create `Embed` class with `.toHtml()`, `.toUrl()`, `.toNodes()` |
| Phase 1.2 | ✅ | Create `MatchInput` facade for stable matcher API |
| Phase 1.3 | ✅ | Make `MatcherRegistry` immutable (removed `.register()`) |
| Phase 1.4 | ✅ | Create `RegistryStore` with subscribe/notify pattern |
| Phase 1.5 | ✅ | Add `UNSUPPORTED_PRIVACY` error code |
| Phase 1.6 | ✅ | Create unified `defineMatcher({ type })` factory |
| Phase 2 | ✅ | Browser module convenience exports (`toEmbedUrl`, `toEmbed`, `register`) |
| Phase 3 | ✅ | Web Component store subscription + `data-opt-*` attributes |
| Phase 4 | ✅ | Build config and package.json (already correct) |
| Phase 5 | ✅ | Documentation updates |

All 248 tests pass (184 lib + 64 wc).

---

## Expert Review Summary

External review identified a critical framing issue: **the API was designed for power users first, with convenience bolted on**. The correct approach inverts this:

| Wrong (Original) | Right (Revised) |
|------------------|-----------------|
| Registry is the API | Registry is an escape hatch |
| Tier 3 first | Tier 1 (zero-config) first |
| `MatcherRegistry.withDefaults().toEmbedUrl(url)` | `toEmbedUrl(url)` |

---

## Audience Tiers (Priority Order)

| Tier | Audience | What They Need | API Surface |
|------|----------|----------------|-------------|
| **1** | CDN/JSFiddle/AI canvas users | One-liner, no setup | `toEmbedUrl(url)` |
| **1.5** | WC users who add matchers | Runtime extension | `register(matcher)` |
| **2** | HTML authors | `<o-embed url="...">` | Web Component |
| **3** | Framework integrators | Full control, custom registries | `MatcherRegistry` class |

---

## Revised Architecture

### Layer Separation

```
@social-embed/lib
├── Core (SSR-safe, immutable)
│   ├── MatcherRegistry     ← Immutable, .with() only
│   ├── defineMatcher()     ← Factory function
│   ├── Result<T>           ← Error handling
│   └── matchers/           ← Built-in matchers
│
├── Browser (mutable, reactive)
│   ├── defaultRegistry     ← Mutable singleton for WC
│   ├── toEmbedUrl()        ← Convenience wrapper
│   ├── toEmbed()           ← Returns rich Embed object
│   ├── match()             ← Convenience wrapper
│   ├── register()          ← Modifies defaultRegistry
│   └── mount()             ← DOM execution
│
└── WC Integration
    └── <o-embed>           ← Subscribes to defaultRegistry
```

### Key Changes from Original Plan

| Original | Revised | Rationale |
|----------|---------|-----------|
| `MatcherRegistry` has both `.with()` and `.register()` | Split: Registry immutable, Store mutable | Avoid confusing dual API |
| `toOutput()` | `toEmbed()` returning `Embed` object | Richer, method-based |
| `renderOutput(output)` standalone | `embed.toHtml()` method | Discoverable |
| `defineIframeMatcher()` / `defineScriptMatcher()` | `defineMatcher({ type: "iframe" })` | Hide implementation |
| `MatchContext` exposed to matchers | `MatchInput` facade | Don't lock in internals |
| `spotify-size`, `spotify-theme` WC attrs | `data-opt-*` proxy pattern | Scales to N providers |

---

## Revised Core Types

### Result<T> (unchanged)

```typescript
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: MatchError };

interface MatchError {
  code: MatchErrorCode;
  message: string;
  fatal?: boolean;
}

// ADDED: UNSUPPORTED_PRIVACY for privacy-first providers
type MatchErrorCode =
  | "NO_MATCH"
  | "INVALID_FORMAT"
  | "MISSING_ID"
  | "PARSE_ERROR"
  | "UNSUPPORTED_PRIVACY";  // NEW
```

### MatchInput (replaces MatchContext)

Facade that hides internal parsing details:

```typescript
// What custom matcher authors see (stable API)
interface MatchInput {
  readonly url: string;
  readonly hostname: string;
  readonly pathname: string;
  getParam(name: string): string | null;
  getPathSegment(index: number): string | null;
}

// Internal parsing (can change without breaking matchers)
// NOT exposed to matcher authors
```

### Embed (replaces EmbedOutput)

Rich object with methods:

```typescript
interface Embed {
  readonly provider: string;
  readonly data: unknown;
  readonly nodes: EmbedNode[];
  readonly scripts?: ScriptRequest[];

  // Methods for rendering
  toHtml(): string;
  toUrl(): string;

  // For JSX/virtual DOM users
  toNodes(): EmbedNode[];
}

type EmbedNode =
  | { type: "iframe"; src: string; attributes: Record<string, string> }
  | { type: "rawHtml"; content: string };  // Renamed from "html"
```

### UrlMatcher (revised)

```typescript
interface UrlMatcher<TName extends string, TData, TOptions = void> {
  readonly name: TName;
  readonly domains?: readonly string[];
  readonly schemes?: readonly string[];
  readonly supportsPrivacyMode?: boolean;

  canMatch(input: MatchInput): boolean;       // MatchInput, not MatchContext
  parse(input: MatchInput): Result<TData>;
  toEmbedUrl(data: TData, options?: PrivacyOptions & TOptions): string;
  toEmbed(data: TData, options?: EmbedOptions & TOptions): Embed;  // Renamed
}
```

### MatcherRegistry (immutable only)

```typescript
class MatcherRegistry {
  // Construction
  static create(matchers?: MatcherInput[], options?: RegistryOptions): MatcherRegistry;
  static withDefaults(): MatcherRegistry;

  // Immutable composition ONLY (no .register())
  with(...matchers: MatcherInput[]): MatcherRegistry;
  without(...names: string[]): MatcherRegistry;

  // Core operations
  match(url: string): MatchResult;
  toEmbedUrl(url: string, options?: PrivacyOptions): string | undefined;
  toEmbed(url: string, options?: EmbedOptions): Embed | undefined;

  // Type-safe matching (NEW)
  isMatch<M extends UrlMatcher>(
    result: MatchResult,
    matcher: M
  ): result is MatchSuccess<M>;

  // Discovery
  list(): UrlMatcher[];
  get(name: string): UrlMatcher | undefined;
  has(name: string): boolean;
  readonly size: number;
}
```

### RegistryStore (NEW - mutable wrapper)

For Web Component reactivity:

```typescript
class RegistryStore {
  private currentRegistry: MatcherRegistry;
  private listeners: Set<() => void>;

  constructor(initial?: MatcherRegistry);

  // Mutable API
  register(matcher: UrlMatcher, options?: { priority?: number }): void;
  unregister(name: string): void;

  // Access immutable registry
  get(): MatcherRegistry;

  // Reactivity
  subscribe(listener: () => void): () => void;

  private notify(): void;
}

// Singleton for browser module
export const defaultStore = new RegistryStore(MatcherRegistry.withDefaults());
```

---

## Revised API Surface

### Tier 1: Zero-Config (PRIMARY)

```typescript
// packages/lib/src/browser/index.ts
import { toEmbedUrl, toEmbed, match, register } from "@social-embed/lib/browser";

// One-liner (uses defaultStore internally)
const embedUrl = toEmbedUrl("https://youtu.be/abc123");
// => "https://www.youtube-nocookie.com/embed/abc123"

// Rich object
const embed = toEmbed("https://youtu.be/abc123");
const html = embed.toHtml();

// Inspection
const result = match("https://youtu.be/abc123");
if (result.ok) {
  console.log(result.provider);  // "YouTube"
  console.log(result.data);      // { videoId: "abc123" }
}
```

### Tier 1.5: Runtime Extension

```typescript
import { register, defineMatcher } from "@social-embed/lib/browser";

// Register before WC renders
register(defineMatcher({
  name: "CorpVideo",
  type: "iframe",
  domains: ["video.corp.internal"],
  patterns: [/video\.corp\.internal\/watch\/(\w+)/],
  embedUrl: (id) => `https://video.corp.internal/embed/${id}`,
}));

// Now <o-embed url="https://video.corp.internal/watch/123"> works
```

### Tier 3: Framework Integrators

```typescript
// Explicit import for power users
import { MatcherRegistry, defineMatcher, defaultMatchers } from "@social-embed/lib";

// Create isolated, immutable registry
const registry = MatcherRegistry.create([
  ...defaultMatchers,
  myCustomMatcher,
]);

// Immutable extension
const extended = registry.with(anotherMatcher);

// Type-safe matching
const result = registry.match(url);
if (registry.isMatch(result, YouTubeMatcher)) {
  result.data.videoId;  // Fully typed
}
```

---

## Revised Factory: defineMatcher()

Unified factory with discriminated config:

```typescript
// Replaces defineIframeMatcher() and defineScriptMatcher()
function defineMatcher<TName extends string>(
  config: IframeMatcherConfig<TName> | ScriptMatcherConfig<TName>
): UrlMatcher<TName, ...>;

// Iframe config
interface IframeMatcherConfig<TName extends string> {
  name: TName;
  type: "iframe";
  domains: readonly string[];
  patterns: readonly RegExp[];
  embedUrl: (id: string, options?: PrivacyOptions) => string;
  defaultDimensions?: { width: number | string; height: number | string };
  iframeAttributes?: Record<string, string>;
  supportsPrivacyMode?: boolean;
}

// Script config (future)
interface ScriptMatcherConfig<TName extends string> {
  name: TName;
  type: "script";
  domains: readonly string[];
  patterns: readonly RegExp[];
  renderPlaceholder: (data: unknown) => string;
  script: { src: string; dedupeKey: string };
}
```

---

## Revised Web Component

### Attribute Strategy: `data-opt-*` Proxy

Remove provider-specific attributes. Use generic data attributes:

```html
<!-- OLD (doesn't scale) -->
<o-embed url="..." spotify-size="compact" spotify-theme="dark"></o-embed>

<!-- NEW (scales to N providers) -->
<o-embed url="..." data-opt-size="compact" data-opt-theme="dark"></o-embed>
```

Implementation:

```typescript
class OEmbedElement extends LitElement {
  @property() url = "";
  @property({ type: Number }) width?: number;
  @property({ type: Number }) height?: number;
  @property({ type: Boolean }) privacy = true;

  // Subscribes to global store for reactivity
  private unsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = defaultStore.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }

  // Collect data-opt-* attributes into options object
  private getProviderOptions(): Record<string, string> {
    const opts: Record<string, string> = {};
    for (const attr of this.attributes) {
      if (attr.name.startsWith("data-opt-")) {
        const key = attr.name.slice(9);  // Remove "data-opt-"
        opts[key] = attr.value;
      }
    }
    return opts;
  }

  render() {
    const registry = defaultStore.get();
    const embed = registry.toEmbed(this.url, {
      width: this.width,
      height: this.height,
      privacy: this.privacy,
      ...this.getProviderOptions(),
    });
    return embed ? unsafeHTML(embed.toHtml()) : this.renderFallback();
  }
}
```

---

## Implementation Phases

### Phase 1: Core Restructure

1. **Rename and refactor types**
   - `EmbedOutput` → `Embed` with methods
   - `MatchContext` → `MatchInput` facade
   - `toOutput()` → `toEmbed()`
   - Add `UNSUPPORTED_PRIVACY` error code

2. **Make MatcherRegistry immutable**
   - Remove `.register()` and `.unregister()` methods
   - Keep only `.with()` and `.without()`

3. **Create RegistryStore**
   - Mutable wrapper with subscribe/notify
   - Instantiate `defaultStore` singleton

4. **Unify factory**
   - Create `defineMatcher({ type: "iframe" | "script" })`
   - Deprecate `defineIframeMatcher()`, `defineScriptMatcher()`

### Phase 2: Browser Module

5. **Add convenience exports**
   - `toEmbedUrl()`, `toEmbed()`, `match()` using defaultStore
   - `register()` that calls `defaultStore.register()`

6. **Update mount()**
   - Work with new `Embed` type
   - Handle script deduplication race condition

### Phase 3: Web Component

7. **Subscribe to defaultStore**
   - Add lifecycle hooks for reactivity
   - Re-render when store changes

8. **Replace provider attributes**
   - Remove `spotify-size`, `spotify-theme`, `spotify-view`, `spotify-start`
   - Implement `data-opt-*` collection

9. **Add refresh() method**
   - For late registration scenarios
   - Document the timing requirement

### Phase 4: Build & Package

10. **Fix /browser subpath export**
    - Update Vite config for multiple entries
    - Verify exports work with esm.sh

11. **Add package.json fields**
    - `unpkg`, `jsdelivr`, `browser`, `sideEffects`

### Phase 5: Documentation

12. **Update README examples**
    - Show Tier 1 API first
    - Move registry to "Advanced" section

13. **Migration guide**
    - From current implementation to new API

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/output.ts` | Rename/Refactor | `EmbedOutput` → `Embed` class with methods |
| `src/context.ts` | Refactor | Create `MatchInput` facade, hide `MatchContext` |
| `src/registry.ts` | Refactor | Remove mutable methods, keep immutable |
| `src/store.ts` | **NEW** | `RegistryStore` class with reactivity |
| `src/factories/iframe.ts` | Refactor | Merge into `defineMatcher()` |
| `src/factories/index.ts` | Refactor | Export unified `defineMatcher()` |
| `src/browser/index.ts` | Refactor | Add convenience exports, defaultStore |
| `src/result.ts` | Update | Add `UNSUPPORTED_PRIVACY` code |
| `src/index.ts` | Update | Re-export appropriate items per tier |
| `packages/wc/src/OEmbedElement.ts` | Refactor | Subscribe to store, use `data-opt-*` |

---

## Validation Checklist

- [ ] Tier 1 user can `toEmbedUrl(url)` without knowing about registries
- [ ] `register()` before WC render → WC uses new matcher
- [ ] `register()` after WC render → WC re-renders (via subscription)
- [ ] `MatcherRegistry` is fully immutable (no in-place modification)
- [ ] `defineMatcher()` works for both iframe and script types
- [ ] Type guards work: `registry.isMatch(result, YouTubeMatcher)`
- [ ] `data-opt-*` attributes collected correctly
- [ ] `/browser` subpath exports work from CDN
- [ ] SSR still works (no DOM in core)

---

## Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| Convenience layer? | Yes, as primary API via browser module |
| Mutability model? | Split: Registry immutable, Store mutable |
| Provider WC attrs? | `data-opt-*` proxy pattern |
| Method naming? | `toEmbed()` → `Embed` object with `.toHtml()` |
| MatchContext exposure? | `MatchInput` facade, hide internals |
| Factory naming? | Unified `defineMatcher({ type })` |
| Type-safe extraction? | `registry.isMatch(result, Matcher)` type guard |
| Error codes? | Add `UNSUPPORTED_PRIVACY` |

---

## References

- [Expert Review Document](./api-review-for-external-feedback.md)
- [esm.sh CDN](https://esm.sh/)
- [Vite Library Mode](https://vite.dev/guide/build.html#library-mode)

# @social-embed/lib

> A lightweight utility for transforming media URLs into embeddable content or extracting media IDs.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/social-embed/social-embed/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/@social-embed/lib.svg?style=flat)](https://www.npmjs.com/package/@social-embed/lib)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@social-embed/lib)](https://bundlephobia.com/package/@social-embed/lib)

## What It Does

This library makes it easy to work with media URLs from popular platforms like YouTube, Vimeo, and Spotify:

- **Convert** URLs to their embeddable format
- **Extract** IDs from media URLs
- **Detect** which platform a URL belongs to
- **Check** if a URL is supported by any provider

All with **zero server-side dependencies** - everything runs in the browser.

## Quick Start

```typescript
import { convertUrlToEmbedUrl } from "@social-embed/lib";

// Convert ANY supported URL to its embed form
const embedUrl = convertUrlToEmbedUrl("https://youtu.be/Bd8_vO5zrjo");
console.log(embedUrl); // "https://www.youtube.com/embed/Bd8_vO5zrjo"
```

## Installation

**NPM:**
```bash
npm i @social-embed/lib
```

**yarn:**
```bash
yarn add @social-embed/lib
```

**pnpm:**
```bash
pnpm add @social-embed/lib
```

### Using a CDN

For browser environments, JSFiddle, CodePen, or AI code canvases:

```typescript
// esm.sh (recommended for modern browsers)
import { MatcherRegistry } from "https://esm.sh/@social-embed/lib";

// jsdelivr
import { MatcherRegistry } from "https://cdn.jsdelivr.net/npm/@social-embed/lib/+esm";

// unpkg
import { MatcherRegistry } from "https://unpkg.com/@social-embed/lib";
```

**Browser subpath** (includes DOM mount utilities):

```typescript
import { mount } from "https://esm.sh/@social-embed/lib/browser";
```

**Quick CDN example:**

```html
<div id="embed"></div>
<script type="module">
  import { MatcherRegistry } from "https://esm.sh/@social-embed/lib";
  import { mount } from "https://esm.sh/@social-embed/lib/browser";

  const registry = MatcherRegistry.withDefaults();
  const output = registry.toOutput("https://youtu.be/dQw4w9WgXcQ");
  await mount(output, { container: "#embed" });
</script>
```

## Key Features

- **Tiny footprint** - Minimal impact on your bundle size
- **Type-safe** - Full TypeScript support with exported types
- **Platform-agnostic** - Works in browsers, Node.js, and other JavaScript environments
- **Comprehensive support** - Works with numerous media platforms
- **No external dependencies** - Zero npm dependencies

## Supported Platforms & Examples

### YouTube

```typescript
import { MatcherRegistry } from "@social-embed/lib";

const registry = MatcherRegistry.withDefaults();

// Extract video ID
const result = registry.match("https://youtu.be/Bd8_vO5zrjo");
if (result.ok) {
  console.log(result.data.videoId); // "Bd8_vO5zrjo"
}

// Get embed URL (privacy-enhanced by default)
const embedUrl = registry.toEmbedUrl("https://youtu.be/Bd8_vO5zrjo");
console.log(embedUrl);
// "https://www.youtube-nocookie.com/embed/Bd8_vO5zrjo"

// With options (start time, autoplay, etc.)
const embedUrlWithOptions = registry.toEmbedUrl("https://youtu.be/Bd8_vO5zrjo", {
  start: 90,
  autoplay: true,
  mute: true,
});
```

### DailyMotion

```typescript
const registry = MatcherRegistry.withDefaults();

// Extract video ID
const result = registry.match("https://www.dailymotion.com/video/x7znrd0");
if (result.ok) {
  console.log(result.data.videoId); // "x7znrd0"
}

// Get embed URL
console.log(registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0"));
// "https://geo.dailymotion.com/player.html?video=x7znrd0"
```

### Spotify

```typescript
console.log(convertUrlToEmbedUrl("spotify:album:1DFixLWuPkv3KT3TnV35m3"));
// "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3"
```

### Vimeo

```typescript
console.log(convertUrlToEmbedUrl("vimeo.com/channels/staffpicks/134668506"));
// "https://player.vimeo.com/video/134668506"
```

### Loom

```typescript
console.log(convertUrlToEmbedUrl("loom.com/share/e883f70b219a49f6ba7fbeac71a72604"));
// "https://www.loom.com/embed/e883f70b219a49f6ba7fbeac71a72604"
```

### EdPuzzle

```typescript
console.log(convertUrlToEmbedUrl("edpuzzle.com/media/606b413369971e424ec6021e"));
// "https://edpuzzle.com/embed/media/606b413369971e424ec6021e"
```

### Wistia

```typescript
console.log(convertUrlToEmbedUrl("https://support.wistia.com/medias/26sk4lmiix"));
// "https://fast.wistia.net/embed/iframe/26sk4lmiix"
```

### Check Provider Support

```typescript
import { MatcherRegistry } from "@social-embed/lib";

const registry = MatcherRegistry.withDefaults();

// Check if URL matches any supported provider
const youtubeResult = registry.match("https://youtu.be/abc123");
console.log(youtubeResult.ok); // true

const unknownResult = registry.match("https://example.com");
console.log(unknownResult.ok); // false

// Get the matched provider name
if (youtubeResult.ok) {
  console.log(youtubeResult.matcher.name); // "YouTube"
}
```

## Try It Out

- [CodePen][codepen]
- [CodePen Console][codepen console]
- [JSFiddle][jsfiddle]

## Related Packages

If you want a ready-to-use HTML component, check out [@social-embed/wc](https://social-embed.org/wc/) - our Web Component implementation that uses this library internally.

## Security

### Built-in Matchers

All built-in matchers (YouTube, Spotify, Vimeo, etc.) use iframe-based embeds with properly escaped attributes. They are safe to use with any URL input.

### Custom Matchers

When creating custom matchers with `defineScriptMatcher`, you must escape any user-provided data:

```typescript
import { defineScriptMatcher, escapeHtml } from "@social-embed/lib";

const MyMatcher = defineScriptMatcher({
  // ...
  renderPlaceholder: (data) => {
    // ❌ UNSAFE - XSS vulnerability
    // return `<div>${data.userInput}</div>`;

    // ✅ SAFE - escape user data
    return `<div>${escapeHtml(data.userInput)}</div>`;
  },
});
```

The `escapeHtml()` function escapes `& < > " '` characters to prevent XSS attacks.

## License

MIT

[codepen]: https://codepen.io/attachment/pen/VwPPrNq
[codepen console]: https://codepen.io/attachment/pen/poRRpdp?editors=0010
[jsfiddle]: https://jsfiddle.net/gitpull/pcLagbsm/

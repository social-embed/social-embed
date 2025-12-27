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
- **Validate** URLs with a simple utility function

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

```typescript
// unpkg
import { getYouTubeIdFromUrl } from "https://www.unpkg.com/@social-embed/lib?module";

// skypack
import { getYouTubeIdFromUrl } from "https://cdn.skypack.dev/@social-embed/lib";
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
// Extract ID from any YouTube URL format
const videoId = getYouTubeIdFromUrl("https://youtu.be/Bd8_vO5zrjo");
console.log(videoId); // "Bd8_vO5zrjo"

// Convert to embed URL
const embedUrl = getYouTubeEmbedUrlFromId("Bd8_vO5zrjo");
console.log(embedUrl); // "https://www.youtube.com/embed/Bd8_vO5zrjo"

// Or do it all in one step
console.log(convertUrlToEmbedUrl("https://www.youtube.com/watch?v=Bd8_vO5zrjo"));
// "https://www.youtube.com/embed/Bd8_vO5zrjo"
```

### DailyMotion

```typescript
const videoId = getDailyMotionIdFromUrl("https://www.dailymotion.com/video/x7znrd0");
console.log(videoId); // "x7znrd0"

console.log(getDailyMotionEmbedFromId("x7znrd0"));
// "https://www.dailymotion.com/embed/video/x7znrd0"
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

### General URL Validation

```typescript
import { isValidUrl } from "@social-embed/lib";

console.log(isValidUrl("https://apple.com")); // true
console.log(isValidUrl("notaurl")); // false
```

## Try It Out

- [CodePen][codepen]
- [CodePen Console][codepen console]
- [JSFiddle][jsfiddle]

## Related Packages

If you want a ready-to-use HTML component, check out [@social-embed/wc](https://social-embed.org/wc/) - our Web Component implementation that uses this library internally.

## License

MIT

[codepen]: https://codepen.io/attachment/pen/VwPPrNq
[codepen console]: https://codepen.io/attachment/pen/poRRpdp?editors=0010
[jsfiddle]: https://jsfiddle.net/gitpull/pcLagbsm/

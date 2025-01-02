# `@social-embed/lib` &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/social-embed/social-embed/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@social-embed/lib.svg?style=flat)](https://www.npmjs.com/package/@social-embed/lib)

A lightweight, browser-friendly utility that parses common media URLs (YouTube, Vimeo, Spotify, etc.) and converts them into embeddable links or extracts relevant IDs.

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

If your environment supports ESM or direct URL imports, you can pull from a CDN:

**unpkg**:

```typescript
import { getYouTubeIdFromUrl } from "https://www.unpkg.com/@social-embed/lib?module";
```

**skypack**:

```typescript
import { getYouTubeIdFromUrl } from "https://cdn.skypack.dev/@social-embed/lib";
```

---

## Usage

Below is a simple TypeScript example demonstrating some core functions:

```typescript
import {
  convertUrlToEmbedUrl,
  getYouTubeIdFromUrl,
  getDailyMotionIdFromUrl,
  getDailyMotionEmbedFromId,
} from "@social-embed/lib";

// 1. Convert any recognized media URL into its embeddable form
console.log(
  convertUrlToEmbedUrl("https://www.youtube.com/watch?v=Bd8_vO5zrjo"),
);
// Output: "https://www.youtube.com/embed/Bd8_vO5zrjo"

// 2. Extract YouTube video ID
console.log(getYouTubeIdFromUrl("https://youtu.be/Bd8_vO5zrjo"));
// Output: "Bd8_vO5zrjo"

// 3. DailyMotion usage
console.log(
  getDailyMotionIdFromUrl("https://www.dailymotion.com/video/x7znrd0"),
);
// Output: "x7znrd0"

console.log(getDailyMotionEmbedFromId("x7znrd0"));
// Output: "https://www.dailymotion.com/embed/video/x7znrd0"
```

### More Examples

**Spotify**

```typescript
console.log(convertUrlToEmbedUrl("spotify:album:1DFixLWuPkv3KT3TnV35m3"));
// "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3"
```

**Vimeo**

```typescript
console.log(convertUrlToEmbedUrl("vimeo.com/channels/staffpicks/134668506"));
// "https://player.vimeo.com/video/134668506"
```

**Loom**

```typescript
console.log(
  convertUrlToEmbedUrl("loom.com/share/e883f70b219a49f6ba7fbeac71a72604"),
);
// "https://www.loom.com/embed/e883f70b219a49f6ba7fbeac71a72604"
```

**EdPuzzle**

```typescript
console.log(
  convertUrlToEmbedUrl("edpuzzle.com/media/606b413369971e424ec6021e"),
);
// "https://edpuzzle.com/embed/media/606b413369971e424ec6021e"
```

**Wistia**

```typescript
console.log(
  convertUrlToEmbedUrl("https://support.wistia.com/medias/26sk4lmiix"),
);
// "https://fast.wistia.net/embed/iframe/26sk4lmiix"
```

### Validate Any URL

```typescript
import { isValidUrl } from "@social-embed/lib";

console.log(isValidUrl("https://apple.com")); // true
console.log(isValidUrl("notaurl")); // false
```

---

## Try It Out

- [CodePen][codepen]
- [CodePen Console][codepen console]
- [JSFiddle][jsfiddle]

[codepen]: https://codepen.io/attachment/pen/VwPPrNq
[codepen console]: https://codepen.io/attachment/pen/poRRpdp?editors=0010
[jsfiddle]: https://jsfiddle.net/gitpull/pcLagbsm/

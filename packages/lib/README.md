# `@social-embed/lib` &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/social-embed/social-embed/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@social-embed/lib.svg?style=flat)](https://www.npmjs.com/package/@social-embed/lib)

A lightweight, browser-friendly utility that parses common media URLs (YouTube, Vimeo, Spotify, etc.) and converts them into embeddable links or extracts relevant IDs.

## Installation

NPM:

```bash
npm i @social-embed/lib
```

yarn:

```bash
yarn add @social-embed/lib
```

pnpm:

```bash
pnpm add @social-embed/lib
```

### Using a CDN

If your environment supports ESM or direct URL imports, you can pull from a CDN:

unpkg:

```typescript
import { getYouTubeIdFromUrl } from "https://www.unpkg.com/@social-embed/lib?module";
```

skypack:

```typescript
import { getYouTubeIdFromUrl } from "https://cdn.skypack.dev/@social-embed/lib";
```

## Usage

Below is a simple TypeScript example demonstrating some of the core functions:

```typescript
import { convertUrlToEmbedUrl, getYouTubeIdFromUrl } from "@social-embed/lib";

console.log(
  convertUrlToEmbedUrl("https://www.youtube.com/watch?v=Bd8_vO5zrjo"),
);
// Output: https://www.youtube.com/embed/Bd8_vO5zrjo

console.log(getYouTubeIdFromUrl("https://www.youtube.com/watch?v=Bd8_vO5zrjo"));
// Output: Bd8_vO5zrjo
```

## Try it Out

- [CodePen][codepen]
- [CodePen Console][codepen console]
- [JSFiddle][jsfiddle]

[codepen]: https://codepen.io/attachment/pen/VwPPrNq
[codepen console]: https://codepen.io/attachment/pen/poRRpdp?editors=0010
[jsfiddle]: https://jsfiddle.net/gitpull/pcLagbsm/

---
layout: page.11ty.cjs
title: <o-embed> ⌲ Install
---

# Just want library functions?

If you just want to use [API utilities](/api/) you can do:

```bash
npm i @social-embed/lib
# yarn
yarn add @social-embed/lib
```

Then import and use as such:

```typescript
import {getYouTubeIdFromUrl} from '@social-embed/lib';

console.log(getYouTubeIdFromUrl('https://www.youtube.com/watch?v=Bd8_vO5zrjo'));
// output: Bd8_vO5zrjo
```

Demo: [CodePen](https://codepen.io/attachment/pen/VwPPrNq),
[jsfiddle](https://jsfiddle.net/gitpull/pcLagbsm/)

# Install

`<o-embed>` is distributed on npm, so you can install it locally or use it via npm CDNs like unpkg.com.

## Local Installation

NPM:

```bash
npm i @social-embed/wc
```

yarn:

```bash
yarn add @social-embed/wc
```

## CDN

npm CDNs like [unpkg.com]() can directly serve files that have been published to npm. This works great for standard JavaScript modules that the browser can load natively.

For this element to work from unpkg.com specifically, you need to include the `?module` query parameter, which tells unpkg.com to rewrite "bare" module specificers to full URLs.

### HTML

```html
<script type="module" src="https://unpkg.com/@social-embed/wc?module"></script>

<o-embed url="https://youtu.be/Bd8_vO5zrjo" allowfullscreen></o-embed>
<o-embed
  url="https://www.youtube.com/watch?v=NB5hH3ksvKE"
  allowfullscreen
></o-embed>
```

#### Codepen

Codepen: [https://codepen.io/attachment/pen/poRRwdy](https://codepen.io/attachment/pen/poRRwdy)

<p class="codepen" data-height="265" data-theme-id="dark"
data-default-tab="html,result" data-user="attachment" data-slug-hash="poRRwdy"
data-preview="true" style="height: 265px; box-sizing: border-box; display: flex;
align-items: center; justify-content: center; border: 2px solid; margin: 1em 0;
padding: 1em;" data-pen-title="Example of o-embed">
  <span>See the Pen <a href="https://codepen.io/attachment/pen/poRRwdy">
    Example of o-embed</a> by Tony (<a
    href="https://codepen.io/attachment">@attachment</a>)
      on <a href="https://codepen.io">CodePen</a>.</span>
      </p>
      <script async
      src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### JavaScript

```js
import {OEmbedElement} from 'https://unpkg.com/@social-embed/wc?module';
```

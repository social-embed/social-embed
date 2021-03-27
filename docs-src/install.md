---
layout: page.11ty.cjs
title: <o-embed> ⌲ Install
---

# Install

`<o-embed>` is distributed on npm, so you can install it locally or use it via npm CDNs like unpkg.com.

## Local Installation

NPM:

```bash
npm i @tony/oembed-component
```

yarn:

```bash
yarn add @tony/oembed-component
```

## CDN

npm CDNs like [unpkg.com]() can directly serve files that have been published to npm. This works great for standard JavaScript modules that the browser can load natively.

For this element to work from unpkg.com specifically, you need to include the `?module` query parameter, which tells unpkg.com to rewrite "bare" module specificers to full URLs.

### HTML

```html
<script
  type="module"
  src="https://unpkg.com/@tony/oembed-component?module"
></script>

<o-embed url="https://youtu.be/Bd8_vO5zrjo" allowfullscreen></o-embed>
<o-embed
  url="https://www.youtube.com/watch?v=NB5hH3ksvKE"
  allowfullscreen
></o-embed>
```

#### Codepen

Codepen: https://codepen.io/attachment/pen/bGBZGEv

<p class="codepen" data-height="265" data-theme-id="dark"
data-default-tab="html,result" data-user="attachment" data-slug-hash="bGBZGEv"
data-preview="true" style="height: 265px; box-sizing: border-box; display: flex;
align-items: center; justify-content: center; border: 2px solid; margin: 1em 0;
padding: 1em;" data-pen-title="Example of o-embed">
  <span>See the Pen <a href="https://codepen.io/attachment/pen/bGBZGEv">
    Example of o-embed</a> by Tony (<a
    href="https://codepen.io/attachment">@attachment</a>)
      on <a href="https://codepen.io">CodePen</a>.</span>
      </p>
      <script async
      src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### JavaScript

```js
import {OEmbedElement} from 'https://unpkg.com/@tony/oembed-component?module';
```

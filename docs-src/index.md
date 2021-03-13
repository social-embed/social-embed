---
layout: page.11ty.cjs
title: <o-embed> ⌲ Home
---

# &lt;o-embed>

`<o-embed>` is a [web component] to automatically switch out tags with [oEmbed]
embedded content. You can it anywhere you can use HTML!

[web component]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[oembed]: https://oembed.com/

## As easy as HTML

<section class="columns">
  <div>

`<o-embed>` can handle simple embeds with _open_ embedding, such as YouTube, DailyMotion,
Vimeo, and Spotify.

```html
<o-embed url="https://youtu.be/VixChkcDC2g"></o-embed>
```

  </div>
  <div>

<o-embed url="https://youtu.be/VixChkcDC2g"></o-embed>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<o-embed>` can be configured with attributes in plain HTML.

```html
<o-embed url="https://www.youtube.com/watch?v=6e5B7EKVg48"></o-embed>
```

  </div>
  <div>

<o-embed url="https://www.youtube.com/watch?v=6e5B7EKVg48"></o-embed>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<o-embed>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const url = 'https://www.youtube.com/watch?v=XLOCQw5s9Uw';

render(
  html`
    <h2>This is a &lt;o-embed&gt;</h2>
    <o-embed .url=${url}></o-embed>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;o-embed&gt;</h2>
<o-embed url="https://www.youtube.com/watch?v=XLOCQw5s9Uw"></o-embed>

  </div>
</section>

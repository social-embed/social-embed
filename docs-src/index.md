---
layout: page.11ty.cjs
title: <o-embed> ⌲ Home
---

# &lt;o-embed>

`<o-embed>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<o-embed>` is just an HTML element. You can it anywhere you can use HTML!

```html
<o-embed></o-embed>
```

  </div>
  <div>

<o-embed></o-embed>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<o-embed>` can be configured with attributed in plain HTML.

```html
<o-embed url="URL"></o-embed>
```

  </div>
  <div>

<o-embed url="URL"></o-embed>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<o-embed>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const url ='https://youtu.be/FTQbiNvZqaY?list=RDCLAK5uy_lf8okgl2ygD075nhnJVjlfhwp8NsUgEbs';

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
<o-embed url="https://youtu.be/FTQbiNvZqaY?list=RDCLAK5uy_lf8okgl2ygD075nhnJVjlfhwp8NsUgEbs"></o-embed>

  </div>
</section>

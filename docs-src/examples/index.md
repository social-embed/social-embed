---
layout: example.11ty.cjs
title: <o-embed> ⌲ Examples ⌲ YouTube
tags: example
name: YouTube
description: A basic example
---

<h3>HTML</h3>

URL: https://youtu.be/FTQbiNvZqaY

```html
<o-embed url="https://youtu.be/FTQbiNvZqaY"></o-embed>
```

<o-embed url="https://youtu.be/FTQbiNvZqaY"></o-embed>

<h2>Optional: Inner / child content</h2>

<style>
  o-embed p {
    border: solid 1px blue;
    padding: 8px;
  }
</style>

<h3>CSS</h3>

```css
p {
  border: solid 1px blue;
  padding: 8px;
}
```

<h3>HTML</h3>

```html
<o-embed url="https://youtu.be/FTQbiNvZqaY">
  <p>This is some content inside</p>
</o-embed>
```

<o-embed url="https://youtu.be/FTQbiNvZqaY">
  <p>This is some content inside</p>
</o-embed>

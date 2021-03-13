---
layout: example.11ty.cjs
title: <o-embed> ⌲ Examples ⌲ allowfullscreen Property
tags: example
name: allowfullscreen Property
description: Setting the allowfullscreen property
---

<o-embed url="https://www.youtube.com/watch?v=G_QhTdzWBJk"></o-embed>

<h3>HTML</h3>

```html
<o-embed url="https://www.youtube.com/watch?v=G_QhTdzWBJk"></o-embed>
```

Note: `allowfullscreen` without `="true"` doesn't render correctly

<o-embed url="https://www.youtube.com/watch?v=G_QhTdzWBJk" allowfullscreen />

<h3>HTML</h3>

```html
<o-embed
  url="https://www.youtube.com/watch?v=G_QhTdzWBJk"
  allowfullscreen="true"
/>
```

<o-embed url="https://www.youtube.com/watch?v=G_QhTdzWBJk" allowfullscreen="true" />

<h3>HTML</h3>

```html
<o-embed
  url="https://www.youtube.com/watch?v=G_QhTdzWBJk"
  allowfullscreen="true"
/>
```

<o-embed url="https://www.youtube.com/watch?v=G_QhTdzWBJk"
allowfullscreen="false" />

<h3>HTML</h3>

```html
<o-embed
  url="https://www.youtube.com/watch?v=G_QhTdzWBJk"
  allowfullscreen="false"
/>
```

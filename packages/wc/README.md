# &lt;o-embed&gt; Web Component

> Transform media URLs into beautiful embeds with a single HTML tag.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/social-embed/social-embed/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/@social-embed/wc.svg?style=flat)](https://www.npmjs.com/package/@social-embed/wc)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@social-embed/wc)](https://bundlephobia.com/package/@social-embed/wc)

A [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that turns URLs from popular media platforms (YouTube, Spotify, Vimeo, etc.) into fully functional embedded players. Just add a single tag to your HTML:

```html
<!-- Before: Raw link your users can't interact with -->
https://www.youtube.com/watch?v=G_QhTdzWBJk

<!-- After: Interactive embedded player -->
<o-embed url="https://www.youtube.com/watch?v=G_QhTdzWBJk"></o-embed>
```

## Demo & Examples

See it in action:
- [Try on CodeSandbox](https://codepen.io/attachment/pen/poRRwdy)
- [Try on JSFiddle](https://jsfiddle.net/gitpull/vc13Lhkz/)

### Live Examples by Platform

- [YouTube](https://social-embed.org/wc/providers/youtube)
- [Spotify](https://social-embed.org/wc/providers/spotify)
- [Vimeo](https://social-embed.org/wc/providers/vimeo)
- [DailyMotion](https://social-embed.org/wc/providers/dailymotion)

## Key Features

- **Zero configuration** - Just drop in the tag with a URL
- **No server** - Everything processes in the browser
- **Framework-agnostic** - Works with any web technology
- **Standards-based** - Uses native Web Components
- **Responsive** - Adapts to container width
- **Lightweight** - Minimal impact on page load
- **Automatic platform detection** - Supports multiple content providers

## Quick Start

### 1. Install

**NPM:**
```bash
npm i @social-embed/wc
```

**Yarn:**
```bash
yarn add @social-embed/wc
```

**PNPM:**
```bash
pnpm add @social-embed/wc
```

### 2. Add to your project

**Option A: Via Script Tag**
```html
<script type="module" src="https://unpkg.com/@social-embed/wc?module"></script>

<o-embed url="https://www.youtube.com/watch?v=G_QhTdzWBJk"></o-embed>
```

**Option B: Via Import**
```js
// In your JavaScript/TypeScript file
import "@social-embed/wc";

// Then in your HTML
document.body.innerHTML = `
  <o-embed url="https://youtu.be/Bd8_vO5zrjo" allowfullscreen></o-embed>
`;
```

## Supported Media Platforms

| Platform | Example URL |
|----------|-------------|
| YouTube | youtube.com/watch?v=ID, youtu.be/ID |
| Spotify | open.spotify.com/track/ID, spotify:album:ID |
| Vimeo | vimeo.com/ID, vimeo.com/channels/name/ID |
| DailyMotion | dailymotion.com/video/ID |
| Loom | loom.com/share/ID |
| EdPuzzle | edpuzzle.com/media/ID |
| Wistia | support.wistia.com/medias/ID |

## Common Use Cases

- **CMS Systems** - Enable media embeds in user-generated content
- **Markdown/WYSIWYG Editors** - Automatically transform URLs into embeds
- **Blogs & Documentation** - Easily add media examples
- **Social Platforms** - Turn shared links into rich interactive content
- **Educational Sites** - Embed instructional videos with minimal effort

## Advanced Usage

### Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `url` | — | The media URL to embed (required) |
| `width` | `"560"` | Width of the embed |
| `height` | `"315"` | Height of the embed |
| `allowfullscreen` | `"true"` | Enable fullscreen button |
| `frameborder` | `"0"` | Iframe border width |

```html
<!-- Set custom dimensions -->
<o-embed url="https://youtu.be/Bd8_vO5zrjo" width="640" height="360"></o-embed>

<!-- Enable fullscreen button -->
<o-embed url="https://youtu.be/Bd8_vO5zrjo" allowfullscreen></o-embed>
```

### CSS Custom Properties

Control embed dimensions globally with CSS custom properties:

```css
o-embed {
  --social-embed-iframe-width: 100%;
  --social-embed-iframe-height: 400px;
}
```

This is useful for responsive layouts and preventing Cumulative Layout Shift (CLS):

```css
o-embed {
  display: block;
  --social-embed-iframe-width: 100%;
  --social-embed-iframe-height: 315px;
  min-height: 315px;
}
```

### Slot Content

You can add child content inside `<o-embed>` — it renders after the iframe via a `<slot>`. This can be used for captions or as a fallback when JavaScript is unavailable:

```html
<o-embed url="https://youtu.be/Bd8_vO5zrjo">
  <a href="https://youtu.be/Bd8_vO5zrjo">Watch on YouTube</a>
</o-embed>
```

### Generic Fallback

Any valid URL — even from unsupported platforms — renders as a plain `<iframe>`. This makes `<o-embed>` a universal embed tag that happens to have smart defaults for known providers.

## Technical Details

Built with:
- [**Lit**](https://lit.dev/) - Lightweight web component framework
- [**TypeScript**](https://www.typescriptlang.org/) - Type-safe JavaScript
- [**@social-embed/lib**](https://social-embed.org/lib/) - URL parsing engine

## Alternative Solutions

- [embed.ly](https://embed.ly/) / [iframely](https://iframely.com/) - Commercial embed services
- [plyr](https://plyr.io/) - Custom video/audio player
- Other web components - [Angular](https://github.com/ckeditor/ckeditor5/issues/2737#issuecomment-471326090), [thangman22](https://github.com/thangman22/oembed-component)

_Want just the URL parsing without the component? Check out [@social-embed/lib](https://social-embed.org/lib/)._

## License

MIT

[codesandbox]: https://codepen.io/attachment/pen/poRRwdy
[jsfiddle]: https://jsfiddle.net/gitpull/vc13Lhkz/
[youtube]: https://social-embed.org/wc/providers/youtube
[spotify]: https://social-embed.org/wc/providers/spotify
[dailymotion]: https://social-embed.org/wc/providers/dailymotion
[vimeo]: https://social-embed.org/wc/providers/vimeo

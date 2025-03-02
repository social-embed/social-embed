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

- [YouTube](https://social-embed.git-pull.com/wc/providers/youtube)
- [Spotify](https://social-embed.git-pull.com/wc/providers/spotify)
- [Vimeo](https://social-embed.git-pull.com/wc/providers/vimeo)
- [DailyMotion](https://social-embed.git-pull.com/wc/providers/dailymotion)

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

```html
<!-- Set custom dimensions -->
<o-embed url="https://youtu.be/Bd8_vO5zrjo" width="640" height="360"></o-embed>

<!-- Enable fullscreen button -->
<o-embed url="https://youtu.be/Bd8_vO5zrjo" allowfullscreen></o-embed>

<!-- Add loading spinner with message -->
<o-embed url="https://youtu.be/Bd8_vO5zrjo" loading="Loading video..."></o-embed>
```

### Error Handling

```html
<!-- Custom error message -->
<o-embed url="invalid-url" error-message="Sorry, this URL isn't supported"></o-embed>
```

## Technical Details

Built with:
- [**Lit**](https://lit.dev/) - Lightweight web component framework
- [**TypeScript**](https://www.typescriptlang.org/) - Type-safe JavaScript
- [**@social-embed/lib**](https://social-embed.git-pull.com/lib/) - URL parsing engine

## Alternative Solutions

- [embed.ly](https://embed.ly/) / [iframely](https://iframely.com/) - Commercial embed services
- [plyr](https://plyr.io/) - Custom video/audio player
- Other web components - [Angular](https://github.com/ckeditor/ckeditor5/issues/2737#issuecomment-471326090), [thangman22](https://github.com/thangman22/oembed-component)

_Want just the URL parsing without the component? Check out [@social-embed/lib](https://social-embed.git-pull.com/lib/)._

## License

MIT

[codesandbox]: https://codepen.io/attachment/pen/poRRwdy
[jsfiddle]: https://jsfiddle.net/gitpull/vc13Lhkz/
[youtube]: https://social-embed.git-pull.com/wc/providers/youtube
[spotify]: https://social-embed.git-pull.com/wc/providers/spotify
[dailymotion]: https://social-embed.git-pull.com/wc/providers/dailymotion
[vimeo]: https://social-embed.git-pull.com/wc/providers/vimeo

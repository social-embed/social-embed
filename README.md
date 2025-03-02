# Social Embed

> A lightweight, browser-friendly toolkit for transforming media URLs into embeddable content.

[![npm version](https://img.shields.io/npm/v/@social-embed/lib.svg?style=flat)](https://www.npmjs.com/package/@social-embed/lib)
[![npm version](https://img.shields.io/npm/v/@social-embed/wc.svg?style=flat)](https://www.npmjs.com/package/@social-embed/wc)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Easily convert URLs from popular platforms (YouTube, Spotify, Vimeo, etc.) into embeddable content with zero server-side dependencies. Available as a JavaScript library or a drop-in Web Component.

## Demo

[Try it on CodePen](https://codepen.io/attachment/pen/poRRwdy) | [Live Examples](https://social-embed.git-pull.com/wc/)

```html
<!-- Before: Raw URL that users need to manually process -->
https://www.youtube.com/watch?v=Bd8_vO5zrjo

<!-- After: Simply wrap in o-embed tags -->
<o-embed url="https://www.youtube.com/watch?v=Bd8_vO5zrjo"></o-embed>
```

## Key Features

- **Zero dependencies** - Client-side parsing with no backend requirements
- **Multi-platform support** - YouTube, Spotify, Vimeo, DailyMotion, and more
- **Lightweight** - Small footprint for fast page loads
- **Framework-agnostic** - Works with any frontend technology
- **Simple API** - Easy to integrate with straightforward methods

## Quick Start

### Option 1: Web Component

```html
<!-- Add the web component -->
<script type="module" src="https://unpkg.com/@social-embed/wc?module"></script>

<!-- Use it in your HTML -->
<o-embed url="https://www.youtube.com/watch?v=Bd8_vO5zrjo"></o-embed>
```

### Option 2: JavaScript Library

```bash
# Install the package
npm install @social-embed/lib
```

```javascript
// Convert a URL to its embed form
import { convertUrlToEmbedUrl } from "@social-embed/lib";

const embedUrl = convertUrlToEmbedUrl("https://youtu.be/Bd8_vO5zrjo");
// Output: "https://www.youtube.com/embed/Bd8_vO5zrjo"
```

## Supported Platforms

| Platform    | URL Examples                                     | Status      |
|-------------|--------------------------------------------------|-------------|
| YouTube     | youtube.com/watch?v=ID, youtu.be/ID              | ✅ Stable   |
| Spotify     | open.spotify.com/track/ID, spotify:track:ID      | ✅ Stable   |
| Vimeo       | vimeo.com/ID, vimeo.com/channels/staff/ID        | ✅ Stable   |
| DailyMotion | dailymotion.com/video/ID                         | ✅ Stable   |
| Loom        | loom.com/share/ID                                | ✅ Stable   |
| EdPuzzle    | edpuzzle.com/media/ID                            | ✅ Stable   |
| Wistia      | support.wistia.com/medias/ID                     | ✅ Stable   |

For more details and examples for each platform, [see the documentation](https://social-embed.git-pull.com/).

## Packages

| Package | Description | Status | Links |
|---------|-------------|--------|-------|
| **@social-embed/lib** | Core library for parsing and generating embed URLs | 🟡 API in development | [Documentation](https://social-embed.git-pull.com/lib/) · [npm](https://www.npmjs.com/package/@social-embed/lib) |
| **@social-embed/wc** | Web Component for easy embedding in any HTML | ✅ Stable | [Documentation](https://social-embed.git-pull.com/wc/) · [npm](https://www.npmjs.com/package/@social-embed/wc) |

## Use Cases

- **Content Management Systems** - Add embed functionality to user-generated content
- **Markdown Editors** - Enhance editors with automatic embeds
- **Social Platforms** - Turn shared links into rich embeds
- **Documentation Sites** - Embed media examples in tutorials
- **WYSIWYG Editors** - Integrate with HTML editors like CKEditor

## Browser Support

Works in all modern browsers that support Web Components.

## Projects

| Package     | Source          | Website                                                | Status          | Description                               |
| ----------- | --------------- | ------------------------------------------------------ | --------------- | ----------------------------------------- |
| Library     | [packages/lib/] | https://social-embed.git-pull.com/lib/                 | 🟡 API unstable | Constants, regexes, id scraper, url maker |
| `<o-embed>` | [packages/wc/]  | https://social-embed.git-pull.com/wc/                  | ✅ Stable       | [custom element] / [web component]        |

[packages/wc/]: packages/wc/
[packages/lib/]: packages/lib/
[custom element]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
[web component]: https://developer.mozilla.org/en-US/docs/Web/Web_Components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

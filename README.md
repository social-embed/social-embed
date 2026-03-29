# Social Embed

> Paste a media URL. Store one portable tag. Render the right embed.

[![npm version](https://img.shields.io/npm/v/@social-embed/lib.svg?style=flat)](https://www.npmjs.com/package/@social-embed/lib)
[![npm version](https://img.shields.io/npm/v/@social-embed/wc.svg?style=flat)](https://www.npmjs.com/package/@social-embed/wc)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Every media platform has its own URL formats and iframe rules. social-embed hides that behind one stable contract: users paste normal URLs, the library detects and converts them, and the web component renders the correct embed. Instead of storing provider-specific iframe markup, you store one readable tag.

What you used to store in your database:

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/Bd8_vO5zrjo"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen></iframe>
```

What you store now:

```html
<o-embed url="https://www.youtube.com/watch?v=Bd8_vO5zrjo"></o-embed>
```

The URL is the canonical data. Everything else — provider detection, embed URL construction, iframe rendering, platform-specific dimensions — is derived at render time.

## Demo

[Try it on CodePen](https://codepen.io/attachment/pen/poRRwdy) | [Live Examples](https://social-embed.org/wc/)

## Quick Start

### Web Component (most users)

```html
<script type="module" src="https://unpkg.com/@social-embed/wc?module"></script>
```

```html
<o-embed url="https://www.youtube.com/watch?v=Bd8_vO5zrjo"></o-embed>
```

That's it. No build step, no bundler, no framework.

### JavaScript Library (custom renderers, server-side validation)

```bash
npm install @social-embed/lib
```

```javascript
// Convert a URL to its embed form
import { MatcherRegistry } from "@social-embed/lib";

const registry = MatcherRegistry.withDefaults();
const embedUrl = registry.toEmbedUrl("https://youtu.be/Bd8_vO5zrjo");
// Output: "https://www.youtube-nocookie.com/embed/Bd8_vO5zrjo"
```

## Why social-embed

- **Store URLs, not embed code** — `<o-embed url="...">` is both the storage format and the rendering instruction. Clean databases, portable markdown, future-proof content.
- **Framework-agnostic** — Works with any frontend technology via native Web Components
- **Zero npm dependencies** — The core library (`@social-embed/lib`) has no dependencies; the web component uses [Lit](https://lit.dev/)
- **Small bundles** — ~2 kB gzipped for the library, ~10 kB for the web component (includes Lit)
- **Client-side only** — No backend, no API keys, no oEmbed server
- **Extensible** — Add custom matchers with `defineIframeMatcher` / `defineScriptMatcher` and register them on `MatcherRegistry`

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

For more details and examples, [see the documentation](https://social-embed.org/).

## Packages

| Package | Description | Status | Links |
|---------|-------------|--------|-------|
| **@social-embed/wc** | Web Component — drop `<o-embed>` into any HTML | ✅ Stable | [Docs](https://social-embed.org/wc/) · [npm](https://www.npmjs.com/package/@social-embed/wc) |
| **@social-embed/lib** | Core library — matchers, registry, embed URL generation (v0.2 redesign) | 🟡 Pre-release | [Docs](https://social-embed.org/lib/) · [Migration](https://social-embed.org/lib/migration/0.2/) · [npm](https://www.npmjs.com/package/@social-embed/lib) |

## Use Cases

- **Rich text editors** — Users paste URLs; the editor stores `<o-embed>` instead of provider-specific iframe HTML. One custom node definition, not one per provider.
- **Markdown & MDX** — `<o-embed>` survives markdown parsing, renders in the browser, and is readable in source.
- **CMS & database content** — Store one tag per embed instead of HTML blobs. When platforms change their embed format, update the library — no database migration.
- **Sandboxes & demos** — Works from a CDN with zero configuration.

## Browser Support

Works in all modern browsers that support Web Components.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

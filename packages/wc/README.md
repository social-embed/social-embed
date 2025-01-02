# `<o-embed>` &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/social-embed/social-embed/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@social-embed/wc.svg?style=flat)](https://www.npmjs.com/package/@social-embed/wc)

A [Web Component] that transforms URLs from various media platforms (YouTube, Spotify, Vimeo, etc.) into embeddable frames. Because it’s a standard browser component, `<o-embed>` works in any HTML environment without requiring a custom server or third-party API.

## Highlights

- **Browser-friendly.** Built on modern Web Components.
- **No extra services.** Client-side parsing from [`@social-embed/lib`].
- **Drop-in usage.** Insert `<o-embed>` in your HTML, or load it via ES modules.

_Just want the parsing logic without the web component? See [@social-embed/lib](https://social-embed.git-pull.com/lib/)._

## Demo

- [CodeSandbox][codesandbox]
- [JSFiddle][jsfiddle]

### Example Embeds

- [YouTube][youtube]
- [Spotify][spotify]
- [Vimeo][vimeo]
- [DailyMotion][dailymotion]

---

## Use Cases

- **Dynamic content backends** where users enter a media URL (e.g., YouTube links).
- **WYSIWYG or HTML editors** such as [CKEditor] with its [`MediaEmbed`] module ([ckeditor#2737]).
- **Embed detection**: checking if a URL is embeddable. If you only need to detect and parse, consider using [`@social-embed/lib`] directly.

## Tech Stack

- **[Lit]** – used for building components.
- **[lit-html]** – templating.
- **[TypeScript]** – typed development.

## Setup

Below are typical installation commands for each package manager.

NPM:

```bash
npm i @social-embed/wc
```

Yarn:

```bash
yarn add @social-embed/wc
```

pnpm:

```bash
pnpm add @social-embed/wc
```

## Usage

Include the component and place an `<o-embed>` element in your HTML. For example:

```html
<script type="module" src="https://unpkg.com/@social-embed/wc?module"></script>

<o-embed url="https://www.youtube.com/watch?v=G_QhTdzWBJk"></o-embed>
```

Alternatively, import it into your JavaScript or TypeScript file:

```js
import "https://unpkg.com/@social-embed/wc?module";

document.body.innerHTML = `
  <o-embed url="https://youtu.be/Bd8_vO5zrjo" allowfullscreen></o-embed>
`;
```

---

## Similar Tools

- [embed.ly] / [iframely] – scripts that find and replace URLs in the DOM.
- [plyr] – a customizable video/audio player that can accept URLs.
- `<oembed>` components – e.g., [Angular OEmbed component][angular-oembed].
- `<o-embed>` components – e.g., [thangman22/oembed-component][thangman22].

---

[codesandbox]: https://codepen.io/attachment/pen/poRRwdy
[jsfiddle]: https://jsfiddle.net/gitpull/vc13Lhkz/
[youtube]: https://social-embed.git-pull.com/wc/providers/youtube
[spotify]: https://social-embed.git-pull.com/wc/providers/spotify
[dailymotion]: https://social-embed.git-pull.com/wc/providers/dailymotion
[vimeo]: https://social-embed.git-pull.com/wc/providers/vimeo
[ckeditor]: https://github.com/ckeditor/ckeditor5/issues/2737
[`MediaEmbed`]: https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html
[ckeditor#2737]: https://github.com/ckeditor/ckeditor5/issues/2737
[`@social-embed/lib`]: https://social-embed.git-pull.com/lib/
[Web Component]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[Lit]: https://lit.dev/
[lit-html]: https://lit.dev/docs/libraries/standalone-templates/
[TypeScript]: https://www.typescriptlang.org/
[embed.ly]: https://embed.ly/
[iframely]: https://iframely.com/
[plyr]: https://plyr.io/
[angular-oembed]: https://github.com/ckeditor/ckeditor5/issues/2737#issuecomment-471326090
[thangman22]: https://github.com/thangman22/oembed-component

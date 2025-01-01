# [`<o-embed>`](https://social-embed.git-pull.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/social-embed/social-embed/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@social-embed/wc.svg?style=flat)](https://www.npmjs.com/package/@social-embed/wc)

[Web component] for URLs of embed-friendly sites such as YouTube,
Spotify, Vimeo, and so on.

- Works anywhere you can use HTML

  Web components are browser-friendly.

- No server or service required

  URL patterns and ID extraction are handled by a separate client-based, browser-friendly package – [`@social-embed/lib`] – which can even be used independently.

## Demo

- [CodeSandbox]
- [JSFiddle]

### Examples

- [YouTube]
- [Spotify]
- [Vimeo]
- [DailyMotion]

[codesandbox]: https://codepen.io/attachment/pen/poRRwdy
[jsfiddle]: https://jsfiddle.net/gitpull/vc13Lhkz/
[youtube]: https://social-embed.git-pull.com/wc/providers/youtube
[spotify]: https://social-embed.git-pull.com/wc/providers/spotify
[dailymotion]: https://social-embed.git-pull.com/wc/providers/dailymotion
[vimeo]: https://social-embed.git-pull.com/wc/providers/vimeo

## Use Cases

- Dynamic content backends
  - Users enter a media URL, such as a YouTube link
  - HTML content where embeds are saved
- HTML Editors  
  This package was originally created for [CKEditor]'s [`MediaEmbed`] module (see issue [ckeditor#2737])
- Also common is detecting if a URL is embeddable or not. In that case, see [`@social-embed/lib`].  
  See StackOverflow/Regex websites about detecting embed URLs

  (Google search: [youtube regex site:stackoverflow.com])

[youtube regex site:stackoverflow.com]: https://www.google.com/search?q=youtube+regex+site%3Astackoverflow.com
[`mediaembed`]: https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html
[ckeditor#2737]: https://github.com/ckeditor/ckeditor5/issues/2737
[ckeditor]: https://github.com/ckeditor/ckeditor5/issues/2737
[`@social-embed/lib`]: https://social-embed.git-pull.com/lib/

## Tech

Built with [Lit] using [lit-html] + [TypeScript]. [View the source](https://github.com/social-embed/social-embed/tree/master/packages/wc) on GitHub.

[web component]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[oembed]: https://oembed.com/
[lit]: https://lit.dev/
[lit-html]: https://lit.dev/docs/libraries/standalone-templates/
[typescript]: https://www.typescriptlang.org/

Compare to [thangman22/oembed-component](https://github.com/thangman22/oembed-component).

## Setup

Install dependencies:

NPM:

```bash
npm i @social-embed/lib
```

yarn:

```bash
yarn add @social-embed/lib
```

pnpm:

```bash
pnpm add @social-embed/lib
```



## Usage

```html
<o-embed url="https://www.youtube.com/watch?v=G_QhTdzWBJk"></o-embed>
```

## Similar tools

- [embed.ly](https://embed.ly/) and [iframely](https://iframely.com/) – invoked as scripts that find/replace URLs with rich content
- [plyr](https://plyr.io/) – customizable frontend for video players, accepts URLs
- `<oembed>` components:
  - [Angular component from ckeditor#2737](https://github.com/ckeditor/ckeditor5/issues/2737#issuecomment-471326090)
- `<o-embed>` components:
  - [thangman22/oembed-component](https://github.com/thangman22/oembed-component)

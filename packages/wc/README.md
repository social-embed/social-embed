# [`<o-embed>`](https://social-embed.git-pull.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/social-embed/social-embed/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@social-embed/wc.svg?style=flat)](https://www.npmjs.com/package/@social-embed/wc)

A modern, TypeScript [web component] for [OEmbed] tags. Built in [LitElement].

At this stage: This doesn't actually use OEmbed, rather it finds IDs and swaps out
with an embed template. It's created for use with CKEditor 5, see
[ckeditor5#2737].

Demo: [CodeSandbox], Examples: [YouTube], [Spotify], [Vimeo], [DailyMotion]

[litelement]: https://lit-element.polymer-project.org/
[web component]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[oembed]: https://oembed.com/
[ckeditor5#2737]: https://github.com/ckeditor/ckeditor5/issues/2737
[codesandbox]: https://codepen.io/attachment/pen/poRRwdy
[youtube]: https://social-embed.git-pull.com/docs/wc/providers/youtube
[spotify]: https://social-embed.git-pull.com/docs/wc/providers/spotify
[dailymotion]: https://social-embed.git-pull.com/docs/wc/providers/dailymotion
[vimeo]: https://social-embed.git-pull.com/docs/wc/providers/vimeo

Compare to [thangman22/oembed-component](https://github.com/thangman22/oembed-component).

## Setup

Install dependencies:

```bash
npm i @social-embed/wc
```

```bash
yarn add @social-embed/wc
```

## Usage

```html
<o-embed url="https://www.youtube.com/watch?v=G_QhTdzWBJk"></o-embed>
```

## Contributing

### Build

This sample uses the TypeScript compiler to produce JavaScript that runs in modern browsers.

To build the JavaScript version of your component:

```bash
yarn build
```

To watch files and rebuild when the files are modified, run the following command in a separate shell:

```bash
yarn build --watch
```

### Testing

This sample uses web-test-runner and the open-wc test helpers for testing. See the [open-wc testing documentation](https://open-wc.org/testing/testing.html) for more information.

Tests can be run with the `test` script:

```bash
yarn test
```

Note: On Ubuntu, you may need to download libraries:

```bash
sudo apt install libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1
libxdamage1
```

### Dev Server

via `vite preview`:

```bash
yarn serve
```

There is a development HTML file located at `/index.html` that you can view at http://localhost:4173/index.html.

### Editing

If you use VS Code, we highly recommend the [lit-plugin extension](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin), which enables some extremely useful features for lit-html templates:

- Syntax highlighting
- Type-checking
- Code completion
- Hover-over docs
- Jump to definition
- Linting
- Quick Fixes

The project is setup to recommend lit-plugin to VS Code users if they don't already have it installed.

### Linting

Linting of TypeScript files is provided by [ESLint](eslint.org) and [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint). In addition, [lit-analyzer](https://www.npmjs.com/package/lit-analyzer) is used to type-check and lint lit-html templates with the same engine and rules as lit-plugin.

The rules are mostly the recommended rules from each project, but some have been turned off to make LitElement usage easier. The recommended rules are pretty strict, so you may want to relax them by editing `.eslintrc.json` and `tsconfig.json`.

To lint the project run:

```bash
yarn lint
```

### Formatting

[Prettier](https://prettier.io/) is used for code formatting. It has been pre-configured according to the Polymer Project's style. You can change this in `.prettierrc.json`.

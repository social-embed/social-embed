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
[youtube]: https://social-embed.git-pull.com/examples/
[spotify]: https://social-embed.git-pull.com/examples/spotify/
[dailymotion]: https://social-embed.git-pull.com/examples/dailymotion/
[vimeo]: https://social-embed.git-pull.com/examples/vimeo/

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
<o-embed src="https://www.youtube.com/watch?v=G_QhTdzWBJk"></o-embed>
```

## Contributing

### Build

This sample uses the TypeScript compiler to produce JavaScript that runs in modern browsers.

To build the JavaScript version of your component:

```bash
npm run build
```

To watch files and rebuild when the files are modified, run the following command in a separate shell:

```bash
npm run build:watch
```

Both the TypeScript compiler and lit-analyzer are configured to be very strict. You may want to change `tsconfig.json` to make them less strict.

### Testing

This sample uses web-test-runner and the open-wc test helpers for testing. See the [open-wc testing documentation](https://open-wc.org/testing/testing.html) for more information.

Tests can be run with the `test` script:

```bash
npm test
```

### Dev Server

This sample uses open-wc's [es-dev-server](https://github.com/open-wc/open-wc/tree/master/packages/es-dev-server) for previewing the project without additional build steps. ES dev server handles resolving Node-style "bare" import specifiers, which aren't supported in browsers. It also automatically transpiles JavaScript and adds polyfills to support older browsers.

To run the dev server and open the project in a new browser tab:

```bash
npm run serve
```

There is a development HTML file located at `/dev/index.html` that you can view at http://localhost:8000/dev/index.html.

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
npm run lint
```

### Formatting

[Prettier](https://prettier.io/) is used for code formatting. It has been pre-configured according to the Polymer Project's style. You can change this in `.prettierrc.json`.

Prettier has not been configured to run when committing files, but this can be added with Husky and and `pretty-quick`. See the [prettier.io](https://prettier.io/) site for instructions.

To build the site, run:

```bash
npm run docs
```

To serve the site locally, run:

```bash
npm run docs:serve
```

To watch the site files, and re-build automatically, run:

```bash
npm run docs:watch
```

The site will usually be served at http://localhost:8000.

### Bundling and minification

This starter project doesn't include any build-time optimizations like bundling or minification. We recommend publishing components as unoptimized JavaScript modules, and performing build-time optimizations at the application level. This gives build tools the best chance to deduplicate code, remove dead code, and so on.

For information on building application projects that include LitElement components, see [Build for production](https://lit-element.polymer-project.org/guide/build) on the LitElement site.

### More information

See [Get started](https://lit-element.polymer-project.org/guide/start) on the LitElement site for more information.

### Credit

[lit-element-starter-ts](https://github.com/PolymerLabs/lit-element-starter-ts)

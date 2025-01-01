# [`@social-embed/lib`](https://social-embed.git-pull.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/social-embed/social-embed/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@social-embed/lib.svg?style=flat)](https://www.npmjs.com/package/@social-embed/lib)

## Start

Install the package:

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

Then import and use it like so:

```typescript
import { convertUrlToEmbedUrl, getYouTubeIdFromUrl } from "@social-embed/lib";

console.log(
  convertUrlToEmbedUrl("https://www.youtube.com/watch?v=Bd8_vO5zrjo"),
);
// output: https://www.youtube.com/embed/Bd8_vO5zrjo

console.log(getYouTubeIdFromUrl("https://www.youtube.com/watch?v=Bd8_vO5zrjo"));
// output: Bd8_vO5zrjo
```

If your environment supports ESM or direct URLs, you can also import the library like this:

```typescript
// unpkg
import { getYouTubeIdFromUrl } from "https://www.unpkg.com/@social-embed/lib?module";

// skypack
import { getYouTubeIdFromUrl } from "https://cdn.skypack.dev/@social-embed/lib";
```

## Try

- [CodePen], [CodePen Console]
- [JSFiddle]

[codepen]: https://codepen.io/attachment/pen/VwPPrNq
[codepen console]: https://codepen.io/attachment/pen/poRRpdp?editors=0010
[jsfiddle]: https://jsfiddle.net/gitpull/pcLagbsm/

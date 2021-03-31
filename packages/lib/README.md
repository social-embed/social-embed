# [`@social-embed/lib`](https://oembed-component.git-pull.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/social-embed/social-embed/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@social-embed/lib.svg?style=flat)](https://www.npmjs.com/package/@social-embed/lib)

## Start

To use [the lib](https://oembed-components.git-pull.com/api/) you can do:

```bash
npm i @social-embed/lib
# or
yarn add @social-embed/lib
```

Then import and use as such:

```typescript
import {getYouTubeIdFromUrl} from '@social-embed/lib';

console.log(getYouTubeIdFromUrl('https://www.youtube.com/watch?v=Bd8_vO5zrjo'));
// output: Bd8_vO5zrjo
```

If you support ESM / Urls, you can also import via like this:

```typescript
// unpkg
import {getYouTubeIdFromUrl} from 'https://www.unpkg.com/@social-embed/lib@0.0.1-next.0?module';
// skypack
import {getYouTubeIdFromUrl} from 'https://cdn.skypack.dev/@social-embed/lib';
```

## API reference

[https://oembed-components.git-pull.com/api/](https://oembed-components.git-pull.com/api/)

## Try

- [CodePen], [codepen console]
- [jsfiddle]

[codepen]: https://codepen.io/attachment/pen/VwPPrNq
[codepen console]: https://codepen.io/attachment/pen/poRRpdp?editors=0010
[jsfiddle]: https://jsfiddle.net/gitpull/pcLagbsm/

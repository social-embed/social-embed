# CHANGES

## 0.0.1-next.24 (2020-03-24)

`convertURLToEmbedURL` -> `convertUrlToEmbedUrl`

```typescript
import {convertUrlToEmbedUrl} from '@tony/oembed-component';
convertUrlToEmbedUrl('https://vimeo.com/134668506'); // https://player.vimeo.com/video/134668506
convertUrlToEmbedUrl('https://youtu.be/FTQbiNvZqaY'); // https://www.youtube.com/embed/FTQbiNvZqaY
```

## 0.0.1-next.23 (2020-03-24)

New all-in-one function to URL to `<iframe>` friendly URL

```typescript
import {convertURLToEmbedURL} from '@tony/oembed-component';
convertURLToEmbedURL('https://vimeo.com/134668506'); // https://player.vimeo.com/video/134668506
convertURLToEmbedURL('https://youtu.be/FTQbiNvZqaY'); // https://www.youtube.com/embed/FTQbiNvZqaY
```

## 0.0.1-next.22 (2020-03-24)

- Typing fix for `getSpotifyEmbedUrlFromIdAndType()`
- YouTube: Support https://youtu.be URLs

## 0.0.1-next.21 (2020-03-24)

Extract spotify regex patterns, ID extraction and embed URL maker

## 0.0.1-next.20 (2020-03-24)

Try to fix a build issue

```typescript
declare global {
  // eslint-disable-next-line
  module JSX {
    interface IntrinsicElements {
      'o-embed': Partial<OEmbedElement>;
    }
  }
}
```

## 0.0.1-next.19 (2020-03-24)

Stab at React support in TypeScript out of the box

```typescript
declare global {
  // eslint-disable-next-line
  declare module JSX {
    interface IntrinsicElements {
      'o-embed': Partial<OEmbedElement>;
    }
  }
}
```

See also: https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements

## 0.0.1-next.18 (2020-03-24)

Support passing string values to `width`/`height`, e.g. `width="100%"`

Before this `width="100%"` would render as `Nan`.

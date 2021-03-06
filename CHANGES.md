---
title: News
---

Here you can find project-wide changes. For more detailed changes:

- [`@social-embed/lib`](https://social-embed.git-pull.com/docs/lib/release-notes)
- [`@social-embed/wc`](https://social-embed.git-pull.com/docs/wc/release-notes)

## current

- Update dev dependencies: karma, eslint, rollup
- Move to monorepo structure
- Switch from karma to web-test-runner to get around import issues
- Decouple library regexes to `packages/lib/`
- Decouple docs to `packages/site/`
- Add [typedoc] documentation: https://social-embed.git-pull.com/api/
- Move documentation to [docusaurus]

[typedoc]: https://typedoc.org/
[docusaurus]: https://docusaurus.io/

# Legacy changes

This project was formerly one repository, named `@tony/oembed-component`

## 0.0.1-next.27 (2020-03-25)

- Update dependency packages (rollup, docs, testing)
- DailyMotion: Fix iframe dimensions

## 0.0.1-next.26 (2020-03-24)

- Fix DailyMotion visibility issue, add tests for player

## 0.0.1-next.25 (2020-03-24)

- Export `youTubeUrlRegex`
- Change casing on functions from `URL` -> `Url`
- Make protocol optional
- Add tests for Dailymotion

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

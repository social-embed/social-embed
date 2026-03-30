# Raw HTML Example

Repo path: `examples/integration-patterns/raw-html`

Expected StackBlitz GitHub-subdir URL pattern: `https://stackblitz.com/fork/github/social-embed/social-embed/tree/<branch-or-tag>/examples/integration-patterns/raw-html?file=index.html`

This example demonstrates the simplest possible integration of `<o-embed>`: a plain HTML page loading the web component from a CDN.

## Problem Solved

Show how to use `<o-embed>` without any build tools, frameworks, or bundlers. This is useful for static sites, CMS content previews, or quick prototypes.

Run the dev server:

```bash
pnpm --filter raw-html dev
```

You should see a page with an embedded YouTube video.

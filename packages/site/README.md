# Social Embed Documentation Site

> The official documentation site for the Social Embed project, available at [social-embed.org](https://social-embed.org)

[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01.svg?style=flat-square)](https://astro.build)
[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

This site documents the Social Embed project and its packages:
- [@social-embed/lib](https://social-embed.org/lib/) - Core URL parsing library
- [@social-embed/wc](https://social-embed.org/wc/) - Web Component implementation

## Development

This site is built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), Astro's documentation theme.

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm/yarn

### Setup

```bash
# Install dependencies from the repository root
pnpm install

# Or if in the site directory
pnpm install
```

### Local Development

```bash
# Start the development server
pnpm dev

# The site will be available at http://localhost:4321
```

### Building for Production

```bash
# Build the production site
pnpm build

# Preview the production build
pnpm preview
```

## Project Structure

```
packages/site/
├── public/              # Static assets (images, favicons, etc.)
│   └── js/              # Bundled JavaScript files
├── src/
│   ├── assets/          # Images and other assets referenced in content
│   ├── components/      # Custom Astro/React components
│   ├── content/         # Markdown/MDX documentation content
│   │   ├── docs/        # Main documentation pages
│   │   └── config.ts    # Content collection configuration
│   └── pages/           # Custom pages outside the docs
├── astro.config.mjs     # Astro configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Adding Content

Documentation pages are written in Markdown or MDX and stored in `src/content/docs/`. Each file becomes a route based on its path.

### Example Page Structure

````markdown
---
title: My Page Title
description: A brief description of this page for SEO
---

# My Page Title

Content goes here...

## Code Examples

```js
// Example code
```

## Live Demo

<YourCustomComponent />
````

## Customizing the Site

- **Theme configuration**: Edit `astro.config.mjs` to change navigation, sidebar, and other Starlight settings
- **Styling**: Modify Tailwind CSS styles in `src/styles/` or component styles
- **Components**: Add custom components in `src/components/`

## Deployment

The site is automatically deployed via GitHub Actions when changes are pushed to the main branch.

## License

MIT

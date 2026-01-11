# AGENTS.md - Site Package

AI agent guidance specific to the `packages/site` documentation site.

## Starlight: The Double-Edged Sword

This site uses [Astro Starlight](https://starlight.astro.build/) for documentation. While excellent for docs, Starlight's CSS is **poisonous to custom design**.

### The Problem

Starlight injects CSS classes like `sl-flex`, `sl-markdown-content`, and complex grid layouts that:
- Override Tailwind utilities unpredictably
- Add unwanted padding, margins, and constraints
- Break responsive layouts
- Force content into narrow containers

### The Solution: Pure Astro Pages

For pages requiring custom design (homepage, landing pages, custom layouts):

**DO:** Create pages in `src/pages/` as pure Astro files:
```astro
---
// src/pages/index.astro
import "../tailwind.css";
// Import React components as islands
import { MyComponent } from "../components/MyComponent";
---
<html lang="en">
  <head>
    <!-- Own head, no Starlight -->
    <script is:inline>
      // Theme toggle compatible with Starlight's localStorage key
      const theme = localStorage.getItem('starlight-theme');
      document.documentElement.dataset.theme = theme || 'dark';
    </script>
  </head>
  <body class="bg-white dark:bg-slate-900">
    <!-- Pure Tailwind, no sl-* classes -->
    <MyComponent client:only="react" />
  </body>
</html>
```

**DON'T:** Use `StarlightPage` for custom layouts:
```astro
// AVOID - brings in ALL Starlight CSS cruft
import { StarlightPage } from '@astrojs/starlight/components';
```

**DON'T:** Import Starlight internal CSS:
```ts
// AVOID - may not exist or changes between versions
import '@astrojs/starlight/style/props.css';
```

### When to Use What

| Page Type | Approach |
|-----------|----------|
| Documentation pages | `src/content/docs/*.mdx` (Starlight) |
| Homepage / Landing | `src/pages/*.astro` (Pure Astro) |
| Playground pages | `src/pages/*.astro` (Pure Astro) |
| Custom layouts | `src/pages/*.astro` (Pure Astro) |

### Theme Compatibility

Pure Astro pages should use Starlight's localStorage key for theme consistency:

```javascript
// Read theme (in <head> to prevent flash)
const theme = localStorage.getItem('starlight-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const resolved = theme === 'light' ? 'light'
              : theme === 'dark' ? 'dark'
              : (prefersDark ? 'dark' : 'light');
document.documentElement.dataset.theme = resolved;

// Toggle theme
const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
document.documentElement.dataset.theme = next;
localStorage.setItem('starlight-theme', next);
```

### Starlight Internals to Avoid

These require `Astro.locals.starlightRoute` context (only available on Starlight pages):
- `Header.astro` from Starlight
- `ThemeSelect.astro` from Starlight
- Any component accessing `locals.starlightRoute`

For pure Astro pages, implement your own header/nav/theme toggle using Tailwind.

### Key Files

- `src/pages/index.astro` - Pure Astro homepage (no Starlight)
- `src/content/docs/` - Starlight documentation pages
- `src/tailwind.css` - Shared Tailwind styles
- `astro.config.ts` - Starlight + React + Tailwind integration

### Debugging Starlight Interference

If a page looks broken:
1. Inspect element - look for `sl-*` class names
2. If present, Starlight CSS is interfering
3. Move page to `src/pages/` as pure Astro
4. Use only Tailwind classes

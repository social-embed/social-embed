# AGENTS.md - Site Package

AI agent guidance specific to the `packages/site` documentation site.

## Architecture: Pure Astro

This site uses pure Astro with:
- Custom layouts (`BaseLayout.astro`, `MarkdownLayout.astro`)
- React islands for interactive components
- Tailwind CSS for styling
- Pagefind for search
- Expressive Code for code blocks

### Key Layouts

| Layout | Purpose |
|--------|---------|
| `BaseLayout.astro` | Base for all pages (header, footer, theme) |
| `MarkdownLayout.astro` | 3-column docs layout (sidebar, content, TOC) |

### Custom Components

Core header components in `src/components/core/`:
- `CoreHeaderLayout.astro` - Header skeleton with slots
- `PureSiteTitle.astro` - Logo and site name
- `PurePackageNav.astro` - Package navigation ribbon (wc/lib)
- `PureSocialIcons.astro` - Social icons + search button
- `PureThemeSelect.astro` - Theme toggle
- `PureSearchButton.astro` - Pagefind search modal

MDX components in `src/components/mdx/`:
- `Aside.astro`, `Badge.astro`, `LinkButton.astro`, `Tabs.astro`

### Theme System

Uses `starlight-theme` localStorage key for backward compatibility:

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

### Key Files

- `src/layouts/BaseLayout.astro` - Base layout for all pages
- `src/layouts/MarkdownLayout.astro` - Documentation layout
- `src/content/docs/` - Documentation content
- `astro.config.ts` - Astro + React + Tailwind + Pagefind

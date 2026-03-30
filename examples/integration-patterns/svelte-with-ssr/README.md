# SvelteKit with Server-Side Rendering

Repo path: `examples/integration-patterns/svelte-with-ssr`

Expected StackBlitz GitHub-subdir URL pattern: `https://stackblitz.com/fork/github/social-embed/social-embed/tree/<branch-or-tag>/examples/integration-patterns/svelte-with-ssr?file=src%2Froutes%2F%2Bpage.svelte`

**Problem:** How do I use `<o-embed>` in a SvelteKit application, ensuring it works with Server-Side Rendering (SSR) and hydrates correctly on the client?

**Solution:** This example demonstrates how to integrate the `social-embed` web component into a SvelteKit project. The key is to load the component only on the client-side using Svelte's `onMount` lifecycle function and a dynamic import.

This approach ensures that:
1.  The server-side rendering process does not fail, as it will simply render a plain `<o-embed>` tag without trying to execute the browser-specific component code.
2.  The web component is loaded on the client, where it "hydrates" the existing `<o-embed>` tag, turning it into a fully functional embedded element.
3.  You can still use Svelte's event binding syntax (`on:oembed-rendered`) to listen to events dispatched from the web component.

## How to run this example

1.  Navigate to this directory.
2.  Run `pnpm install`.
3.  Run `pnpm dev` to start the development server.
4.  Open your browser to `http://localhost:5173` (or the port shown in your terminal).

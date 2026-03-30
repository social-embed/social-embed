<script lang="ts">
import { onMount } from "svelte";

// We only want to import the web component on the client side.
onMount(async () => {
  try {
    // The web component registers itself on import.
    await import("@social-embed/wc");
  } catch (e) {
    console.error("Failed to load social-embed web component", e);
  }
});

const urls = [
  "https://www.youtube.com/watch?v=K-nLp_GCHko",
  "https://vimeo.com/254123550",
  "https://twitter.com/WebDevSimplified/status/1701655679462539645",
  "https://www.tiktok.com/@vorosvas/video/7343272995225308449",
];
</script>

<svelte:head>
  <title>Svelte + social-embed</title>
  <meta name="description" content="Using social-embed in SvelteKit" />
</svelte:head>

<section>
  <h1>SvelteKit with social-embed</h1>

  <p>
    This example demonstrates how to use the <code>&lt;o-embed&gt;</code> web component
    in a SvelteKit application. The component is loaded only on the client-side
    to ensure compatibility with Server-Side Rendering (SSR).
  </p>

  <div class="embeds-container">
    {#each urls as url}
      <div class="embed-wrapper">
        <p>Embedding: <code>{url}</code></p>
        <o-embed {url}></o-embed>
      </div>
    {/each}
  </div>
</section>

<style>
  section {
    font-family: sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  .embeds-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .embed-wrapper {
    border: 1px solid #eee;
    padding: 1rem;
    border-radius: 8px;
  }
  code {
    background-color: #f0f0f0;
    padding: 0.2em 0.4em;
    border-radius: 4px;
  }
</style>

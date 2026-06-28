import "@social-embed/wc";
import { getCmsPreviewHtml } from "./cmsHelpers";

export function bootstrapApp(container: HTMLElement) {
  const previews = getCmsPreviewHtml();
  container.innerHTML = `
    <main data-testid="app-root" style="font-family: sans-serif; margin: 0 auto; max-width: 960px; padding: 24px;">
      <h1>Database / CMS Content Example</h1>
      <p>This example renders the same embed from stored HTML and a structured URL field.</p>
      <section style="display: grid; gap: 16px; grid-template-columns: 1fr 1fr;">
        <div>
          <h2>Stored HTML body</h2>
          <pre data-testid="stored-html-source" style="background: #f6f6f6; min-height: 120px; overflow-x: auto; padding: 12px; white-space: pre-wrap;">${previews.htmlBody.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
          <div data-testid="stored-body-preview" style="border: 1px solid #ccc; margin-top: 8px; min-height: 120px; padding: 12px;"></div>
        </div>
        <div>
          <h2>Structured URL field</h2>
          <pre data-testid="structured-source" style="background: #f6f6f6; min-height: 120px; overflow-x: auto; padding: 12px; white-space: pre-wrap;">${previews.structuredBody.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
          <div data-testid="structured-preview" style="border: 1px solid #ccc; margin-top: 8px; min-height: 120px; padding: 12px;"></div>
        </div>
      </section>
    </main>
  `;

  const storedBodyPreview = container.querySelector(
    '[data-testid="stored-body-preview"]',
  ) as HTMLDivElement | null;
  const structuredPreview = container.querySelector(
    '[data-testid="structured-preview"]',
  ) as HTMLDivElement | null;

  if (storedBodyPreview) {
    storedBodyPreview.innerHTML = previews.htmlBody;
  }

  if (structuredPreview) {
    structuredPreview.innerHTML = previews.structuredBody;
  }
}

const root = document.getElementById("app");

if (!root) {
  throw new Error("App container not found");
}

bootstrapApp(root);

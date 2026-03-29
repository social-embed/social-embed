import "@social-embed/wc";
import { INVALID_URL, validateEmbedUrl, VALID_URL } from "./validationHelpers";

export function bootstrapApp(container: HTMLElement) {
  container.innerHTML = `
    <main data-testid="app-root" style="font-family: sans-serif; margin: 0 auto; max-width: 960px; padding: 24px;">
      <h1>Server-side Validation Example</h1>
      <p>Validate the URL before storing it. Only recognized providers are accepted.</p>
      <label for="embed-url">Embed URL</label>
      <div style="display: flex; gap: 12px; margin-top: 8px;">
        <input data-testid="url-input" id="embed-url" style="flex: 1;" type="url" value="${INVALID_URL}" />
        <button data-testid="validate-button" type="button">Validate</button>
        <button data-testid="sample-valid" type="button">Use Sample Valid URL</button>
      </div>
      <p data-testid="status" style="margin-top: 16px;"></p>
      <div data-testid="preview" style="border: 1px solid #ccc; min-height: 120px; padding: 12px;"></div>
    </main>
  `;

  const input = container.querySelector('[data-testid="url-input"]') as HTMLInputElement;
  const status = container.querySelector('[data-testid="status"]') as HTMLParagraphElement;
  const preview = container.querySelector('[data-testid="preview"]') as HTMLDivElement;
  const validateButton = container.querySelector('[data-testid="validate-button"]') as HTMLButtonElement;
  const sampleValidButton = container.querySelector('[data-testid="sample-valid"]') as HTMLButtonElement;

  function renderStatus() {
    const result = validateEmbedUrl(input.value);

    if (result.isValid) {
      status.textContent = `Accepted provider: ${result.providerName}`;
      preview.innerHTML = `<o-embed data-testid="validated-embed" url="${input.value}"></o-embed>`;
      return;
    }

    status.textContent = "Rejected: URL is not a recognized provider";
    preview.innerHTML = "";
  }

  validateButton.addEventListener("click", renderStatus);
  sampleValidButton.addEventListener("click", () => {
    input.value = VALID_URL;
    renderStatus();
  });

  renderStatus();
}

const root = document.getElementById("app");

if (!root) {
  throw new Error("App container not found");
}

bootstrapApp(root);

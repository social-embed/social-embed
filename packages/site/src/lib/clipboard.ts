/**
 * Clipboard utility for copying text to clipboard.
 * Uses the modern Clipboard API (97%+ browser support).
 */

export interface CopyResult {
  success: boolean;
  error?: string;
}

/**
 * Copy text to clipboard using the Clipboard API.
 *
 * @param text - The text to copy to clipboard
 * @returns Promise resolving to success status
 */
export async function copyToClipboard(text: string): Promise<CopyResult> {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Clipboard access denied",
      success: false,
    };
  }
}

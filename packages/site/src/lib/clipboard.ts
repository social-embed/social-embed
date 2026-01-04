/**
 * Clipboard utility for copying text to clipboard.
 * Provides a unified interface with fallback for older browsers.
 */

export interface CopyResult {
  success: boolean;
  error?: string;
}

/**
 * Copy text to clipboard using the Clipboard API with fallback.
 *
 * @param text - The text to copy to clipboard
 * @returns Promise resolving to success status
 */
export async function copyToClipboard(text: string): Promise<CopyResult> {
  // Try modern Clipboard API first
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (err) {
      // Clipboard API failed (permissions, etc.) - try fallback
      console.warn("Clipboard API failed, trying fallback:", err);
    }
  }

  // Fallback: Create temporary textarea and use execCommand
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.setAttribute("readonly", ""); // Prevent mobile keyboard
    document.body.appendChild(textarea);

    // Select and copy
    textarea.select();
    textarea.setSelectionRange(0, text.length); // For mobile devices

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (success) {
      return { success: true };
    }
    return { error: "execCommand returned false", success: false };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unknown error",
      success: false,
    };
  }
}

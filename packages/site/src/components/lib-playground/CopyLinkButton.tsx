/**
 * CopyLinkButton - Button for copying shareable playground links to clipboard.
 *
 * Features:
 * - Visual feedback: default -> success (checkmark) -> default
 * - Accessible with keyboard support
 */

import { useCallback, useEffect, useState } from "react";
import { copyToClipboard } from "../../lib/clipboard";

export interface CopyLinkButtonProps {
  /**
   * Function that returns the URL to copy.
   * Called at click time to get current state.
   */
  getUrl: () => string;

  /**
   * Optional className for additional styling.
   */
  className?: string;

  /**
   * Duration to show success state (ms). Defaults to 2000.
   */
  successDuration?: number;
}

/** Link icon (Lucide Link2 path) */
function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <line x1="8" x2="16" y1="12" y2="12" />
    </svg>
  );
}

/** Check icon (Lucide Check path) */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * Button that copies a shareable URL to clipboard.
 * Shows visual feedback on successful copy.
 */
export function CopyLinkButton({
  getUrl,
  className = "",
  successDuration = 2000,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  // Reset copied state after successDuration with proper cleanup
  useEffect(() => {
    if (!copied) return;
    const timeoutId = setTimeout(() => setCopied(false), successDuration);
    return () => clearTimeout(timeoutId);
  }, [copied, successDuration]);

  const handleCopy = useCallback(async () => {
    const url = getUrl();
    const result = await copyToClipboard(url);

    if (result.success) {
      setCopied(true);
    } else {
      console.error("Failed to copy URL:", result.error);
    }
  }, [getUrl]);

  const Icon = copied ? CheckIcon : LinkIcon;

  return (
    <button
      aria-label={copied ? "Link copied" : "Copy shareable link"}
      className={`h-[22px] px-2 inline-flex items-center gap-1.5 rounded text-xs font-medium transition-colors cursor-pointer border-0 ${
        copied
          ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400"
          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
      } ${className}`}
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy link"}
      type="button"
    >
      <Icon className="w-3.5 h-3.5" />
      {copied && <span className="sr-only">Copied!</span>}
    </button>
  );
}

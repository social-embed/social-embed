import { useCallback, useEffect, useMemo, useRef } from "react";

export interface ConsoleEntry {
  type: "log" | "warn" | "error" | "info";
  args: string[];
  timestamp: number;
}

export interface PreviewPaneProps {
  code: string;
  wcUrl: string;
  onConsoleMessage?: (entry: ConsoleEntry) => void;
  className?: string;
}

/**
 * Generate the console capture script to inject into the iframe.
 */
function getConsoleCaptureScript(): string {
  return `
<script>
(function() {
  const originalConsole = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    info: console.info.bind(console),
  };

  ['log', 'warn', 'error', 'info'].forEach(method => {
    console[method] = (...args) => {
      originalConsole[method](...args);
      try {
        parent.postMessage({
          type: 'console',
          method,
          args: args.map(arg => {
            try {
              if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
              }
              return String(arg);
            } catch {
              return String(arg);
            }
          }),
          timestamp: Date.now(),
        }, '*');
      } catch (e) {
        originalConsole.error('Console capture error:', e);
      }
    };
  });

  window.onerror = (message, source, lineno, colno, error) => {
    parent.postMessage({
      type: 'console',
      method: 'error',
      args: [\`Error: \${message} (line \${lineno})\`],
      timestamp: Date.now(),
    }, '*');
    return false;
  };

  window.onunhandledrejection = (event) => {
    parent.postMessage({
      type: 'console',
      method: 'error',
      args: [\`Unhandled Promise: \${event.reason}\`],
      timestamp: Date.now(),
    }, '*');
  };
})();
</script>`;
}

/**
 * Generate the full srcdoc HTML with WC URL replaced and scripts injected.
 */
function generateSrcdoc(code: string, wcUrl: string): string {
  // Replace {{WC_URL}} placeholder with actual WC URL
  let processedCode = code.replace(/\{\{WC_URL\}\}/g, wcUrl);

  // Inject console capture script after <head> tag
  const consoleCaptureScript = getConsoleCaptureScript();

  if (processedCode.includes("<head>")) {
    processedCode = processedCode.replace(
      "<head>",
      `<head>\n${consoleCaptureScript}`,
    );
  } else if (processedCode.includes("<body>")) {
    processedCode = processedCode.replace(
      "<body>",
      `<body>\n${consoleCaptureScript}`,
    );
  } else {
    // Fallback: prepend
    processedCode = `${consoleCaptureScript}\n${processedCode}`;
  }

  return processedCode;
}

/**
 * Sandboxed iframe preview for the playground.
 */
export function PreviewPane({
  code,
  wcUrl,
  onConsoleMessage,
  className = "",
}: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate srcdoc from inputs
  const srcdoc = useMemo(() => generateSrcdoc(code, wcUrl), [code, wcUrl]);

  // Listen for postMessage from iframe
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Only accept messages from our iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      const data = event.data;
      if (data?.type === "console" && onConsoleMessage) {
        onConsoleMessage({
          args: data.args,
          timestamp: data.timestamp,
          type: data.method,
        });
      }
    },
    [onConsoleMessage],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return (
    <div className={`relative h-full bg-white ${className}`}>
      <iframe
        className="h-full w-full border-0"
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin"
        srcDoc={srcdoc}
        title="Preview"
      />
    </div>
  );
}

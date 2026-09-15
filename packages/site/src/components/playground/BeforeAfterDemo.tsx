import { convertUrlToEmbedUrl, getProviderFromUrl } from "@social-embed/lib";
import { useCallback, useMemo, useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { MiniPlayground } from "./MiniPlayground";

/**
 * Generate a representative iframe HTML blob for a given media URL.
 * This shows what developers would have to store *without* social-embed.
 */
function generateIframeHtml(url: string): string {
  const provider = getProviderFromUrl(url);
  const embedUrl = convertUrlToEmbedUrl(url);

  if (!provider || !embedUrl) {
    return `<iframe\n  src="${url}"\n  width="560"\n  height="315"\n></iframe>`;
  }

  const name = provider.name;

  // Provider-specific iframe attributes to show the ugly reality
  const attrs: Record<string, string> = {
    frameborder: "0",
    height: "315",
    src: embedUrl,
    width: "560",
  };

  if (name === "YouTube") {
    attrs.allow =
      "accelerometer; autoplay;\n    clipboard-write; encrypted-media;\n    gyroscope; picture-in-picture";
    attrs.allowfullscreen = "";
  } else if (name === "Spotify") {
    attrs.width = "100%";
    attrs.height = "352";
    attrs.allow =
      "autoplay; clipboard-write;\n    encrypted-media; fullscreen;\n    picture-in-picture";
    attrs.loading = "lazy";
  } else if (name === "Vimeo") {
    attrs.allow = "autoplay; fullscreen;\n    picture-in-picture";
    attrs.allowfullscreen = "";
  } else if (name === "DailyMotion") {
    attrs.allow = "autoplay; fullscreen;\n    picture-in-picture; web-share";
    attrs.allowfullscreen = "";
  } else if (name === "Loom") {
    attrs.allowfullscreen = "";
    attrs.webkitallowfullscreen = "";
    attrs.mozallowfullscreen = "";
  } else {
    attrs.allow = "autoplay; fullscreen";
    attrs.allowfullscreen = "";
  }

  const lines = ["<iframe"];
  for (const [key, val] of Object.entries(attrs)) {
    if (val === "") {
      lines.push(`  ${key}`);
    } else {
      lines.push(`  ${key}="${val}"`);
    }
  }
  lines.push("></iframe>");
  return lines.join("\n");
}

interface BeforeAfterDemoProps {
  className?: string;
}

/**
 * Before/After demo: read-only iframe code on the left,
 * interactive <o-embed> playground on the right.
 * The iframe code updates reactively when the playground URL changes.
 */
export function BeforeAfterDemo({ className = "" }: BeforeAfterDemoProps) {
  const [currentUrl, setCurrentUrl] = useState(
    "https://www.youtube.com/watch?v=EJxwWpaGoJs",
  );

  const iframeHtml = useMemo(
    () => generateIframeHtml(currentUrl),
    [currentUrl],
  );

  const handleCodeChange = useCallback((code: string) => {
    // Extract URL from the snippet code
    const match = code.match(/url="([^"]+)"/);
    if (match?.[1]) {
      setCurrentUrl(match[1]);
    }
  }, []);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <div className="flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          Before — stored in your database
        </p>
        <div className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <CodeEditor
            className="h-full"
            language="html"
            onChange={() => {}}
            readOnly
            value={iframeHtml}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          After —{" "}
          <code className="text-indigo-600 dark:text-indigo-400">
            &lt;o-embed&gt;
          </code>
        </p>
        <MiniPlayground
          className="h-full"
          codeHeight="50px"
          iframeHeight="350px"
          initialViewMode="snippet"
          onSnippetChange={handleCodeChange}
        />
      </div>
    </div>
  );
}

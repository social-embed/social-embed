import {
  type IntegrationPatternExample,
  integrationPatternExamples,
  integrationPatternSectionTitles,
} from "@examples/integration-patterns/manifest";
import { useState } from "react";
import {
  buildIntegrationPatternDetailPath,
  buildStackBlitzUrl,
  integrationPatternGithubBaseUrl,
} from "../../lib/integrationPatternLinks";

const groupedExamples = Object.entries(integrationPatternSectionTitles).map(
  ([sectionId, sectionTitle]) => ({
    examples: integrationPatternExamples.filter(
      (example) => example.section === sectionId,
    ),
    sectionId,
    sectionTitle,
  }),
);

type DemoIntegrationPatternsBrowseProps = {
  basePath?: string;
  mode?: "demo" | "public";
};

const featuredExamples = integrationPatternExamples.filter(
  (example) => example.kind === "runnable" && example.tier === "core",
);

function ExampleCard({
  basePath,
  example,
  mode,
}: {
  basePath: string;
  example: IntegrationPatternExample;
  mode: "demo" | "public";
}) {
  const [isInlinePreviewVisible, setIsInlinePreviewVisible] = useState(false);

  return (
    <article
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      id={example.id}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
            example.kind === "runnable"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
          }`}
        >
          {example.kind}
        </span>
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
            example.tier === "core"
              ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {example.tier}
        </span>
        {example.kind === "runnable" && (
          <span className="inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Live app
          </span>
        )}
      </div>

      <h4 className="text-base font-semibold text-slate-900 dark:text-white">
        {example.title}
      </h4>
      <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
        {example.problemSolved}
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
        {example.description}
      </p>

      {mode === "demo" && (
        <dl className="mt-4 grid gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-400">
          <div>
            <dt className="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">
              Path
            </dt>
            <dd className="mt-1 font-mono">{example.githubPath}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">
              Files
            </dt>
            <dd className="mt-1 font-mono">{example.files.join(", ")}</dd>
          </div>
          {example.kind === "runnable" && (
            <div>
              <dt className="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">
                Dev Port
              </dt>
              <dd className="mt-1 font-mono">{example.devPort}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <a
          className="rounded-full border border-slate-300 px-3 py-1.5 font-medium text-slate-700 no-underline transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
          href={buildIntegrationPatternDetailPath(basePath, example.id)}
        >
          {example.kind === "runnable"
            ? "View embedded demo"
            : "View example details"}
        </a>
        <a
          className="rounded-full border border-slate-300 px-3 py-1.5 font-medium text-slate-700 no-underline transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
          href={`${integrationPatternGithubBaseUrl}/${example.githubPath}`}
          rel="noreferrer"
          target="_blank"
        >
          View source
        </a>
        {example.kind === "runnable" && (
          <>
            <a
              className="rounded-full bg-slate-900 px-3 py-1.5 font-medium text-white no-underline transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              href={buildStackBlitzUrl(example, { view: "editor" })}
              rel="noreferrer"
              target="_blank"
            >
              Open in StackBlitz
            </a>
            <button
              className="rounded-full border border-blue-300 px-3 py-1.5 font-medium text-blue-700 transition hover:border-blue-400 hover:text-blue-800 dark:border-blue-800 dark:text-blue-300 dark:hover:border-blue-700 dark:hover:text-blue-200"
              onClick={() =>
                setIsInlinePreviewVisible((currentValue) => !currentValue)
              }
              type="button"
            >
              {isInlinePreviewVisible
                ? "Hide inline preview"
                : "Try inline preview"}
            </button>
          </>
        )}
      </div>

      {example.kind === "runnable" && isInlinePreviewVisible && (
        <div className="mt-4 space-y-3">
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            Embedded StackBlitz previews work best in Chromium-based browsers
            and can be blocked by privacy settings. The full StackBlitz tab is
            the fallback path.
          </p>
          <iframe
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; xr-spatial-tracking"
            className="h-[560px] w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800"
            loading="lazy"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            src={buildStackBlitzUrl(example, {
              ctl: 1,
              embed: 1,
              hideExplorer: 1,
              terminalHeight: 45,
              view: "editor",
            })}
            title={`${example.title} StackBlitz preview`}
          />
        </div>
      )}
    </article>
  );
}

export function DemoIntegrationPatternsBrowse({
  basePath = "/wc/integration-patterns",
  mode = "public",
}: DemoIntegrationPatternsBrowseProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-10 p-6">
      <header className="space-y-4">
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {mode === "public" ? "Public docs surface" : "Demo attic"}
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Start with the integration problem, not the framework.
          </h2>
          <p className="max-w-3xl text-slate-600 dark:text-slate-400">
            The happy path is not “pick a framework card and leave the site.” It
            is “recognize your problem, inspect a working implementation, and
            only then open the sandbox.” These examples are the source of truth
            for the integration docs and map directly to{" "}
            <code>examples/integration-patterns/</code>.
          </p>
        </div>
      </header>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-blue-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Choose the problem you need to solve
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            These are the core runnable examples most likely to unblock
            adoption. The full catalog stays below.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {featuredExamples.map((example) => (
            <a
              className="group rounded-2xl border border-slate-200 bg-white/90 p-4 no-underline transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-blue-800"
              href={`#${example.id}`}
              key={example.id}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                {integrationPatternSectionTitles[example.section]}
              </p>
              <h4 className="mt-2 text-base font-semibold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                {example.title}
              </h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {example.problemSolved}
              </p>
            </a>
          ))}
        </div>
      </section>

      {groupedExamples.map(({ sectionId, sectionTitle, examples }) => (
        <section className="space-y-4" id={sectionId} key={sectionId}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {sectionTitle}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {
                  examples.filter((example) => example.kind === "runnable")
                    .length
                }{" "}
                runnable,{" "}
                {
                  examples.filter((example) => example.kind === "fixture")
                    .length
                }{" "}
                copy-paste fixtures
              </p>
            </div>
            {mode === "demo" && (
              <p className="text-xs font-mono text-slate-500 dark:text-slate-500">
                section id: {sectionId}
              </p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {examples.map((example) => (
              <ExampleCard
                basePath={basePath}
                example={example}
                key={example.id}
                mode={mode}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

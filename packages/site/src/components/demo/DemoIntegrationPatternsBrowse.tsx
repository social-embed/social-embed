import {
  integrationPatternExamples,
  integrationPatternSectionTitles,
} from "@examples/integration-patterns/manifest";

const gitBranch =
  typeof __GIT_BRANCH__ === "string" && __GIT_BRANCH__.length > 0
    ? __GIT_BRANCH__
    : "master";
const branchSegment = encodeURIComponent(gitBranch);
const githubBaseUrl = `https://github.com/social-embed/social-embed/tree/${branchSegment}`;
const stackblitzBaseUrl = `https://stackblitz.com/github/social-embed/social-embed/tree/${branchSegment}`;

const groupedExamples = Object.entries(integrationPatternSectionTitles).map(
  ([sectionId, sectionTitle]) => ({
    examples: integrationPatternExamples.filter(
      (example) => example.section === sectionId,
    ),
    sectionId,
    sectionTitle,
  }),
);

export function DemoIntegrationPatternsBrowse() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Integration Pattern Examples
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          These examples are the source of truth for the integration patterns
          docs. Runnable examples are standalone apps under{" "}
          <code>examples/integration-patterns/</code>.
        </p>
      </header>

      {groupedExamples.map(({ sectionId, sectionTitle, examples }) => (
        <section className="space-y-4" id={sectionId} key={sectionId}>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {sectionTitle}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {examples.map((example) => (
              <article
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                key={example.id}
              >
                <div className="mb-3 flex items-center gap-2">
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

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <a
                      className="text-blue-600 no-underline hover:underline dark:text-blue-400"
                      href={`${githubBaseUrl}/${example.githubPath}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      View source
                    </a>
                  </p>
                  {example.kind === "runnable" && (
                    <p>
                      <a
                        className="text-blue-600 no-underline hover:underline dark:text-blue-400"
                        href={`${stackblitzBaseUrl}/${example.githubPath}${
                          example.stackblitzOpenFile
                            ? `?file=${encodeURIComponent(example.stackblitzOpenFile)}`
                            : ""
                        }`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open in StackBlitz
                      </a>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

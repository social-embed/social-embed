import type { RunnableExample } from "@examples/integration-patterns/manifest";

const gitBranch =
  typeof __GIT_BRANCH__ === "string" && __GIT_BRANCH__.length > 0
    ? __GIT_BRANCH__
    : "master";
const branchSegment = encodeURIComponent(gitBranch);

export const integrationPatternGithubBaseUrl = `https://github.com/social-embed/social-embed/tree/${branchSegment}`;
export const integrationPatternStackBlitzBaseUrl = `https://stackblitz.com/github/social-embed/social-embed/tree/${branchSegment}`;

type StackBlitzUrlOptions = {
  ctl?: 0 | 1;
  embed?: 0 | 1;
  file?: string;
  hideExplorer?: 0 | 1;
  terminalHeight?: number;
  view?: "both" | "editor" | "preview";
};

export function buildIntegrationPatternDetailPath(
  basePath: string,
  exampleId: string,
) {
  return `${basePath.replace(/\/$/, "")}/${exampleId}/`;
}

export function buildStackBlitzUrl(
  example: Pick<RunnableExample, "githubPath"> & {
    stackblitzOpenFile?: string;
  },
  options: StackBlitzUrlOptions = {},
) {
  const url = new URL(
    `${integrationPatternStackBlitzBaseUrl}/${example.githubPath}`,
  );

  if (example.stackblitzOpenFile) {
    url.searchParams.set("file", example.stackblitzOpenFile);
  }

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

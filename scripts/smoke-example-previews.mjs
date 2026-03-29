import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const rootDir = resolve(import.meta.dirname, "..");

const examples = [
  {
    cwd: resolve(rootDir, "examples/integration-patterns/rich-text-tiptap"),
    id: "rich-text-tiptap",
    port: 4311,
  },
  {
    cwd: resolve(rootDir, "examples/integration-patterns/rich-text-slate"),
    id: "rich-text-slate",
    port: 4312,
  },
  {
    cwd: resolve(
      rootDir,
      "examples/integration-patterns/markdown-react-markdown",
    ),
    id: "markdown-react-markdown",
    port: 4313,
  },
  {
    cwd: resolve(rootDir, "examples/integration-patterns/cms-content"),
    id: "cms-content",
    port: 4314,
  },
  {
    cwd: resolve(rootDir, "examples/integration-patterns/server-validation"),
    id: "server-validation",
    port: 4315,
  },
];

function spawnPreview(example) {
  const child = spawn(
    "pnpm",
    [
      "preview",
      "--host",
      "127.0.0.1",
      "--strictPort",
      "--port",
      String(example.port),
    ],
    {
      cwd: example.cwd,
      detached: true,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  return {
    child,
    getOutput() {
      return output;
    },
  };
}

async function waitForHttp(url, child, getOutput, timeoutMs = 30_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (child.exitCode !== null) {
      throw new Error(
        `Preview server exited early for ${url}\n${getOutput().trim()}`,
      );
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until timeout.
    }

    await delay(250);
  }

  throw new Error(`Timed out waiting for ${url}\n${getOutput().trim()}`);
}

async function stopPreview(child) {
  if (child.exitCode !== null) {
    return;
  }

  try {
    process.kill(-child.pid, "SIGTERM");
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !("code" in error) ||
      error.code !== "ESRCH"
    ) {
      throw error;
    }
  }

  const start = Date.now();
  while (child.exitCode === null && Date.now() - start < 5_000) {
    await delay(100);
  }

  if (child.exitCode === null) {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !("code" in error) ||
        error.code !== "ESRCH"
      ) {
        throw error;
      }
    }
  }
}

async function smokeExample(example) {
  const url = `http://127.0.0.1:${example.port}/`;
  const preview = spawnPreview(example);

  try {
    await waitForHttp(url, preview.child, preview.getOutput);

    const requireFromExample = createRequire(
      resolve(example.cwd, "package.json"),
    );
    const { chromium } = requireFromExample("playwright");

    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.locator('[data-testid="app-root"]').waitFor({
        state: "visible",
        timeout: 10_000,
      });
    } finally {
      await browser.close();
    }

    console.log(`[smoke] ${example.id} ok`);
  } finally {
    await stopPreview(preview.child);
  }
}

for (const example of examples) {
  await smokeExample(example);
}

import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import {
  integrationPatternExamples,
  type RunnableExample,
} from "../examples/integration-patterns/manifest.ts";

const rootDir = resolve(import.meta.dirname, "..");

const examples = integrationPatternExamples
  .filter((e): e is RunnableExample => e.kind === "runnable")
  .map((e) => ({
    cwd: resolve(rootDir, e.files[0]),
    id: e.id,
    port: e.devPort,
  }));

function spawnPreview(example: { cwd: string; id: string; port: number }) {
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
  child.stdout?.on("data", (chunk: Buffer) => {
    output += chunk.toString();
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    output += chunk.toString();
  });

  return {
    child,
    getOutput() {
      return output;
    },
  };
}

async function waitForHttp(
  url: string,
  child: ChildProcess,
  getOutput: () => string,
  timeoutMs = 30_000,
) {
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

async function stopPreview(child: ChildProcess) {
  if (child.exitCode !== null) {
    return;
  }

  try {
    process.kill(-(child.pid as number), "SIGTERM");
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
      process.kill(-(child.pid as number), "SIGKILL");
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

async function smokeExample(example: {
  cwd: string;
  id: string;
  port: number;
}) {
  const url = `http://127.0.0.1:${example.port}/`;
  const preview = spawnPreview(example);

  try {
    await waitForHttp(url, preview.child, preview.getOutput);

    const requireFromExample = createRequire(
      resolve(example.cwd, "package.json"),
    );
    const { chromium } = requireFromExample("playwright") as {
      chromium: {
        launch: (opts: { headless: boolean }) => Promise<{
          newPage: () => Promise<{
            goto: (url: string, opts: object) => Promise<void>;
            locator: (sel: string) => {
              waitFor: (opts: object) => Promise<void>;
            };
          }>;
          close: () => Promise<void>;
        }>;
      };
    };

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

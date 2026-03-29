import fs from "node:fs";
import path from "node:path";

const rootDir = path.join(import.meta.dirname, "..");
const packageNames = ["@social-embed/lib", "@social-embed/wc"];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const workspaceVersions = new Map(
  packageNames.map((packageName) => {
    const packageDir = packageName.endsWith("/lib") ? "lib" : "wc";
    const packageJsonPath = path.join(
      rootDir,
      "packages",
      packageDir,
      "package.json",
    );
    const pkg = readJson(packageJsonPath);
    return [packageName, `^${pkg.version}`];
  }),
);

const examplesDir = path.join(rootDir, "examples", "integration-patterns");
const exampleDirs = fs
  .readdirSync(examplesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

let updateCount = 0;

for (const exampleDir of exampleDirs) {
  const packageJsonPath = path.join(examplesDir, exampleDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    continue;
  }

  const pkg = readJson(packageJsonPath);
  let changed = false;

  for (const dependencyType of ["dependencies", "devDependencies"]) {
    const deps = pkg[dependencyType];
    if (!deps) {
      continue;
    }

    for (const [packageName, nextVersion] of workspaceVersions) {
      if (deps[packageName] && deps[packageName] !== nextVersion) {
        deps[packageName] = nextVersion;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
    updateCount += 1;
    console.log(`Updated ${path.relative(rootDir, packageJsonPath)}`);
  }
}

console.log(`Done. Updated ${updateCount} example package(s).`);

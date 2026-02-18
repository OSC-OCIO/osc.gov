const fs = require("node:fs/promises");
const path = require("node:path");
const esbuild = require("esbuild");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const sass = require("sass");
const chokidar = require("chokidar");

const ROOT = __dirname;
const SITE_ASSETS_DIR = path.join(ROOT, "_site", "assets");
const IS_PRODUCTION = process.env.ELEVENTY_ENV === "production";

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyDir(source, destination) {
  await ensureDir(path.dirname(destination));
  await fs.cp(source, destination, { recursive: true });
}

async function buildJavaScript() {
  await ensureDir(path.join(SITE_ASSETS_DIR, "js"));

  await esbuild.build({
    entryPoints: {
      app: path.join(ROOT, "js", "app.js"),
      admin: path.join(ROOT, "js", "admin.js"),
      "uswds-init": path.join(ROOT, "js", "uswds-init.js"),
    },
    outdir: path.join(SITE_ASSETS_DIR, "js"),
    format: "iife",
    bundle: true,
    minify: IS_PRODUCTION,
    sourcemap: !IS_PRODUCTION,
    target: ["chrome58", "firefox57", "safari11", "edge18"],
  });
}

async function buildSass() {
  await ensureDir(path.join(SITE_ASSETS_DIR, "styles"));

  const result = sass.compile(path.join(ROOT, "styles", "styles.scss"), {
    style: IS_PRODUCTION ? "compressed" : "expanded",
    sourceMap: !IS_PRODUCTION,
    loadPaths: [
      path.join(ROOT, "node_modules", "@uswds"),
      path.join(ROOT, "node_modules", "@uswds", "uswds", "packages"),
    ],
    quietDeps: true,
    silenceDeprecations: ["import", "global-builtin", "if-function"],
  });

  const cssPath = path.join(SITE_ASSETS_DIR, "styles", "styles.css");
  await fs.writeFile(cssPath, result.css);

  if (result.sourceMap) {
    const mapPath = `${cssPath}.map`;
    await fs.writeFile(mapPath, JSON.stringify(result.sourceMap));
  }

  if (IS_PRODUCTION) {
    await autoprefixStyles(cssPath);
  }
}

async function autoprefixStyles(cssPath) {
  const css = await fs.readFile(cssPath, "utf8");
  const enableSourceMap = process.env.ELEVENTY_ENV !== "production";
  const processed = await postcss([autoprefixer()]).process(css, {
    from: cssPath,
    to: cssPath,
    map: enableSourceMap ? { inline: false } : false,
  });

  await fs.writeFile(cssPath, processed.css);
  if (processed.map) {
    await fs.writeFile(`${cssPath}.map`, processed.map.toString());
  }
}

async function copyUswdsAssets() {
  await copyDir(
    path.join(ROOT, "node_modules", "@uswds", "uswds", "dist", "fonts"),
    path.join(SITE_ASSETS_DIR, "uswds", "fonts"),
  );

  await copyDir(
    path.join(ROOT, "node_modules", "@uswds", "uswds", "dist", "img"),
    path.join(SITE_ASSETS_DIR, "uswds", "img"),
  );
}

async function copyProjectImages() {
  await copyDir(path.join(ROOT, "img"), path.join(SITE_ASSETS_DIR, "img"));
}

async function buildAll({ includeUswds = true } = {}) {
  await Promise.all([buildJavaScript(), buildSass(), copyProjectImages()]);
  if (includeUswds) {
    await copyUswdsAssets();
  }
  console.log("Assets have been built!");
}

async function watchAssets(skipInitialBuild = false) {
  if (!skipInitialBuild) {
    await buildAll();
  }

  let buildInProgress = false;
  let buildQueued = false;
  let debounceTimer;

  let pendingStyles = false;
  let pendingJavaScript = false;
  let pendingImages = false;
  let pendingFullBuild = false;

  function queueChange(relPath) {
    const normalizedPath = relPath.replace(/\\/g, "/");
    if (normalizedPath.startsWith("styles/")) {
      pendingStyles = true;
      return;
    }
    if (normalizedPath.startsWith("js/")) {
      pendingJavaScript = true;
      return;
    }
    if (normalizedPath.startsWith("img/")) {
      pendingImages = true;
      return;
    }
    pendingFullBuild = true;
  }

  async function queueBuild(reason, relPath) {
    if (relPath) {
      queueChange(relPath);
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async () => {
      if (buildInProgress) {
        buildQueued = true;
        return;
      }

      buildInProgress = true;
      try {
        if (reason) {
          console.log(`Asset change detected: ${reason}`);
        }

        const runFullBuild = pendingFullBuild;
        const runStyles = pendingStyles;
        const runJavaScript = pendingJavaScript;
        const runImages = pendingImages;

        pendingFullBuild = false;
        pendingStyles = false;
        pendingJavaScript = false;
        pendingImages = false;

        if (runFullBuild) {
          await buildAll({ includeUswds: false });
        } else {
          const jobs = [];
          if (runStyles) {
            jobs.push(buildSass());
          }
          if (runJavaScript) {
            jobs.push(buildJavaScript());
          }
          if (runImages) {
            jobs.push(copyProjectImages());
          }
          if (jobs.length > 0) {
            await Promise.all(jobs);
            console.log("Assets have been built!");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        buildInProgress = false;
        if (buildQueued) {
          buildQueued = false;
          await queueBuild("queued changes");
        }
      }
    }, 150);
  }

  const watcher = chokidar.watch(
    [path.join(ROOT, "styles"), path.join(ROOT, "js"), path.join(ROOT, "img")],
    {
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 150,
        pollInterval: 50,
      },
    },
  );

  watcher.on("all", (eventName, changedPath) => {
    const relPath = path.relative(ROOT, changedPath);
    queueBuild(`${eventName} ${relPath}`, relPath);
  });

  console.log("Watching assets for changes...");
}

async function main() {
  const isWatchMode = process.argv.includes("--watch");
  const skipInitialBuild = process.argv.includes("--skip-initial");

  if (isWatchMode) {
    await watchAssets(skipInitialBuild);
    return;
  }

  await buildAll();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

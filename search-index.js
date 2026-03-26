const path = require("node:path");

const SITE_DIR = path.join(__dirname, "_site");
const OUTPUT_DIR = path.join(SITE_DIR, "pagefind");

async function buildSearchIndex(pagefind) {
  const { index, errors } = await pagefind.createIndex({
    forceLanguage: "en",
  });

  if (!index) {
    throw new Error(
      `Unable to initialize Pagefind index${errors.length ? `: ${errors.join("; ")}` : ""}`,
    );
  }

  const caseIndexing = await index.addDirectory({
    path: SITE_DIR,
    glob: "case/**/*.html",
  });
  if (caseIndexing.errors.length) {
    throw new Error(
      `Case indexing failed: ${caseIndexing.errors.join("; ")}`,
    );
  }

  const writeResult = await index.writeFiles({
    outputPath: OUTPUT_DIR,
  });
  if (writeResult.errors.length) {
    throw new Error(
      `Pagefind write failed: ${writeResult.errors.join("; ")}`,
    );
  }
}

async function main() {
  const pagefind = await import("pagefind");

  try {
    await buildSearchIndex(pagefind);
  } finally {
    await pagefind.close();
  }
}

main().catch(function (error) {
  console.error(error);
  process.exit(1);
});

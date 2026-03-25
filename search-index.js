const fs = require("node:fs/promises");
const path = require("node:path");
const yaml = require("js-yaml");
const {
  buildResourceRecordKey,
  normalizePageUrl,
  stringValue,
} = require("./search-shared");

const ROOT = __dirname;
const PAGES_DIR = path.join(ROOT, "pages");
const SITE_DIR = path.join(ROOT, "_site");
const OUTPUT_DIR = path.join(SITE_DIR, "pagefind");

function sourcePathToUrl(sourcePath, frontmatter) {
  const permalink = frontmatter && frontmatter.permalink;
  if (
    typeof permalink === "string" &&
    permalink.trim() &&
    !permalink.includes("{%") &&
    !permalink.includes("{{")
  ) {
    return normalizePageUrl(permalink);
  }

  const relPath = path.relative(PAGES_DIR, sourcePath).replace(/\\/g, "/");
  const parsed = path.parse(relPath);

  if (parsed.name.toLowerCase() === "index") {
    return normalizePageUrl(`/${parsed.dir}/`);
  }

  return normalizePageUrl(`/${parsed.dir}/${parsed.name}/`);
}

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  if (!match) {
    return {};
  }

  return yaml.load(match[1]) || {};
}

async function listMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function flattenResourceRecords(frontmatter, pageUrl) {
  const pageTitle = stringValue(frontmatter.title);
  const records = [];

  if (Array.isArray(frontmatter.reports) && frontmatter.reports.length > 0) {
    const nested =
      frontmatter.reports[0] &&
      Array.isArray(frontmatter.reports[0].topics);

    if (nested) {
      frontmatter.reports.forEach(function (category, categoryIndex) {
        const parent = stringValue(category.heading);
        const topics = Array.isArray(category.topics) ? category.topics : [];
        topics.forEach(function (topic, sectionIndex) {
          const section = stringValue(topic.heading);
          const items = Array.isArray(topic.items) ? topic.items : [];
          items.forEach(function (item, itemIndex) {
            const name = stringValue(item && item.name);
            const url = stringValue(item && item.url);
            if (!name || !url) {
              return;
            }

            records.push({
              key: buildResourceRecordKey(
                pageUrl,
                categoryIndex,
                sectionIndex,
                itemIndex,
              ),
              url,
              name,
              pageTitle,
              parent,
              topic: section,
              pageUrl,
            });
          });
        });
      });
    } else {
      frontmatter.reports.forEach(function (sectionData, sectionIndex) {
        const section = stringValue(sectionData.heading);
        const items = Array.isArray(sectionData.items) ? sectionData.items : [];
        items.forEach(function (item, itemIndex) {
          const name = stringValue(item && item.name);
          const url = stringValue(item && item.url);
          if (!name || !url) {
            return;
          }

          records.push({
            key: buildResourceRecordKey(pageUrl, sectionIndex, itemIndex),
            url,
            name,
            pageTitle,
            parent: "",
            topic: section,
            pageUrl,
          });
        });
      });
    }
  } else if (Array.isArray(frontmatter.items)) {
    frontmatter.items.forEach(function (item, itemIndex) {
      const name = stringValue(item && item.name);
      const url = stringValue(item && item.url);
      if (!name || !url) {
        return;
      }

      records.push({
        key: buildResourceRecordKey(pageUrl, "items", itemIndex),
        url,
        name,
        pageTitle,
        parent: "",
        topic: "",
        pageUrl,
      });
    });
  }

  return records;
}

async function loadResourceRecords() {
  const files = await listMarkdownFiles(PAGES_DIR);
  const records = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const frontmatter = parseFrontmatter(raw);

    if (frontmatter.layout !== "layouts/resource-index") {
      continue;
    }

    if (!frontmatter.pagefind_filtering) {
      continue;
    }

    if (
      !Array.isArray(frontmatter.reports) &&
      !Array.isArray(frontmatter.items)
    ) {
      continue;
    }

    const pageUrl = sourcePathToUrl(filePath, frontmatter);
    records.push(...flattenResourceRecords(frontmatter, pageUrl));
  }

  return records;
}

function buildRecordContent(record) {
  return [record.name, record.parent, record.topic, record.pageTitle]
    .filter(Boolean)
    .join("\n");
}

async function buildSearchIndex(pagefind) {
  const resourceRecords = await loadResourceRecords();
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

  for (const record of resourceRecords) {
    const syntheticUrl = `${record.pageUrl}#${encodeURIComponent(record.key)}`;
    const filters = {
      resource_page: [record.pageUrl],
    };

    if (record.parent) {
      filters.resource_parent = [record.parent];
    }
    if (record.topic) {
      filters.resource_topic = [record.topic];
    }

    const result = await index.addCustomRecord({
      url: syntheticUrl,
      language: "en",
      content: buildRecordContent(record),
      meta: {
        title: record.name,
        resource_key: record.key,
        resource_url: record.url,
        resource_page: record.pageUrl,
        resource_parent: record.parent,
        resource_topic: record.topic,
      },
      filters,
    });

    if (result.errors.length) {
      throw new Error(
        `Resource record indexing failed for ${record.url}: ${result.errors.join("; ")}`,
      );
    }
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

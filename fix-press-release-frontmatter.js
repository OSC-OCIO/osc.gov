const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "collections", "press-release");

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");

  // Split front matter from body
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    console.warn(`Skipping (no front matter): ${filePath}`);
    return;
  }

  const frontMatter = fmMatch[1];
  let body = fmMatch[2];

  // Extract tag: first non-empty line after front matter
  // The rest before "Page Content" is a description that stays in the body
  let extractedTag = "";

  // Strip zero-width chars
  body = body.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // First non-empty line is the tag
  const lines = body.split("\n");
  let tagLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim()) {
      extractedTag = lines[i].trim();
      tagLineIdx = i;
      break;
    }
  }

  if (tagLineIdx >= 0) {
    // Remove only the tag line from body
    lines.splice(tagLineIdx, 1);
    body = lines.join("\n");
  }

  // Remove "Page Content" lines
  body = body.replace(/^\s*Page Content\s*$/gm, "");

  // Remove all remaining "Page Content" lines
  body = body.replace(/^\s*Page Content\s*$/gm, "");

  // Remove all \*\*\* (escaped markdown) and plain *** lines
  body = body.replace(/^\s*\\\*\\\*\\\*\s*$/gm, "");
  body = body.replace(/^\s*\*\*\*\s*$/gm, "");

  // Clean up excessive blank lines
  body = body.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";

  // Build updated front matter with tags
  let newFrontMatter = frontMatter;

  if (extractedTag) {
    // Normalize: lowercase, collapse whitespace
    const slug = extractedTag.toLowerCase().replace(/\s+/g, " ").trim();

    // Check if tags already exist in front matter
    if (/^tags\s*:/m.test(newFrontMatter)) {
      // Append to existing tags array
      // Handle both inline [a, b] and list format
      newFrontMatter = newFrontMatter.replace(
        /^(tags\s*:\s*)\[([^\]]*)\]/m,
        (_, prefix, existing) => `${prefix}[${existing}, "${slug}"]`,
      );
    } else {
      // Add tags field
      newFrontMatter += `\ntags:\n  - ${slug}`;
    }
  }

  const output = `---\n${newFrontMatter}\n---\n${body}`;
  fs.writeFileSync(filePath, output, "utf-8");
  console.log(
    `✓ ${path.basename(filePath)}${extractedTag ? ` → tag: "${extractedTag}"` : ""}`,
  );
}

// Process all markdown files
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"));
console.log(`Processing ${files.length} files in ${DIR}\n`);

for (const file of files) {
  processFile(path.join(DIR, file));
}

console.log("\nDone.");

/**
 * Shared computed data for everything under /pages:
 * - Builds clean permalinks from the folder structure (strips the leading "pages/" and file extensions).
 * - Derives eleventyNavigation from the same structure.
 * - Honors explicit front matter: `permalink` (including false), `eleventyNavigation`, and `order`.
 */

// Remove leading "pages/" and split path into parts (with extensions).
function splitParts(inputPath) {
  return inputPath
    .replace(/^\.?\/?pages\//, "")
    .split("/")
    .filter(Boolean);
}

// Drop extensions and trailing index.* to get URL segments.
function toSegments(parts) {
  const withoutExt = parts.map((p) => p.replace(/\.(md|njk|html)$/, ""));
  const isIndex = withoutExt[withoutExt.length - 1] === "index";
  return isIndex ? withoutExt.slice(0, -1) : withoutExt;
}

// Build a label from a segment or title.
function makeLabel(segment, fallback) {
  return (segment || fallback || "Home")
    .replace(/^[0-9]+[-_]/, "")
    .replace(/[-_]+/g, " ")
    .replace(/(^|\s)(\w)/g, (_, s, c) => s + c.toUpperCase());
}

module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      // If the page sets permalink (including false), respect it.
      // if (Boolean(data.permalink)) {
      //   return data.permalink;
      // }
      if (
        data.permalink === false ||
        (typeof data.permalink === "string" && data.permalink !== "")
      ) {
        console.log(data.permalink);
        return data.permalink;
      }

      const segments = toSegments(splitParts(data.page.inputPath));
      let url = "/" + segments.join("/") + "/";
      url = url.replace(/\/+/g, "/");
      if (url === "//") url = "/";
      return url;
    },

    eleventyNavigation: (data) => {
      // Skip non-routing pages or explicit opt-out.
      if (data.permalink === false) return false;
      if (data.eleventyNavigation === false) return false;
      if (
        data.eleventyNavigation &&
        typeof data.eleventyNavigation === "object"
      ) {
        return data.eleventyNavigation;
      }

      // Build navigation purely from file structure (not from permalinks).
      const segments = toSegments(splitParts(data.page.inputPath));
      const label =
        data.title || makeLabel(segments.slice(-1)[0], data.page.fileSlug);

      const parentSegments = segments.slice(0, -1);
      let parent = parentSegments.length
        ? `/${parentSegments.join("/")}/`
        : undefined;

      const url = ("/" + segments.join("/") + "/").replace(/\/+/g, "/");
      const isHome = url === "/";
      if (!parent && !isHome) parent = "/"; // attach top-level items to home

      const nav = { key: url, url, title: label };
      if (parent) nav.parent = parent;
      if (data.order !== undefined) nav.order = data.order;
      return nav;
    },
  },
};

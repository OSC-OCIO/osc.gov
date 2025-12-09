/**
 * Shared computed data for every template in the /pages directory.
 * - Builds clean permalinks from the folder structure (strips the leading "pages/" and file extensions).
 * - Derives eleventyNavigation automatically from the same structure.
 * - Respects explicit front matter: `permalink` (including `false`), `eleventyNavigation`, and `order`.
 */

/**
 * Remove the leading "pages/" segment from an inputPath and split into parts.
 */
function splitPath(inputPath) {
  return inputPath
    .replace(/^\.?\/?pages\//, "")
    .split("/")
    .filter(Boolean);
}

/**
 * Turn path parts into URL segments (drop extensions, drop trailing index).
 */
function toSegments(parts) {
  const withoutExt = parts.map((p) => p.replace(/\.(md|njk|html)$/, ""));
  const isIndex = withoutExt[withoutExt.length - 1] === "index";
  return isIndex ? withoutExt.slice(0, -1) : withoutExt;
}

/**
 * Build a label from a segment or title.
 */
function makeLabel(segment, fallback) {
  return (segment || fallback || "Home")
    .replace(/^[0-9]+[-_]/, "") // strip numeric prefixes
    .replace(/[-_]+/g, " ")
    .replace(/(^|\s)(\w)/g, (_, s, c) => s + c.toUpperCase());
}

module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      // Respect explicit front matter: if permalink is set, use it (including false).
      if (Object.prototype.hasOwnProperty.call(data, "permalink")) {
        return data.permalink;
      }

      const parts = splitPath(data.page.inputPath);
      const segments = toSegments(parts);

      let url = "/" + segments.join("/") + "/";
      url = url.replace(/\/+/g, "/");
      if (url === "//") url = "/";
      return url;
    },

    eleventyNavigation: (data) => {
      // Skip non-routing pages.
      if (data.permalink === false) return false;

      // Honor explicit opt-out or explicit config.
      if (data.eleventyNavigation === false) return false;
      if (
        data.eleventyNavigation &&
        typeof data.eleventyNavigation === "object"
      ) {
        return data.eleventyNavigation;
      }

      const parts = splitPath(data.page.inputPath);
      const segments = toSegments(parts);

      const label =
        data.title || makeLabel(segments.slice(-1)[0], data.page.fileSlug);

      const parentSegments = segments.slice(0, -1);
      let parent = parentSegments.length
        ? `/${parentSegments.join("/")}/`
        : undefined;

      const url =
        (Object.prototype.hasOwnProperty.call(data, "permalink") &&
          typeof data.permalink === "string" &&
          data.permalink.length > 0)
          ? data.permalink
          : ("/" + segments.join("/") + "/").replace(/\/+/g, "/");
      const isHome = url === "/";
      if (!parent && !isHome) parent = "/"; // hang top-level items off home

      const nav = { key: url, url, title: label };
      if (parent) nav.parent = parent;
      if (data.order !== undefined) nav.order = data.order;
      return nav;
    },
  },
};

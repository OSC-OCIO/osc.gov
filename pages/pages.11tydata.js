/**
 * Shared computed data for everything under /pages.
 * - Builds clean permalinks from the folder structure (strips leading "pages/" and file extensions).
 * - Derives eleventyNavigation from the same structure.
 * - Honors explicit front matter: `permalink` (including false), `eleventyNavigation`, and `order`.
 */

const path = require("path");

// Strip /pages/ prefix and split into path parts
const splitParts = (inputPath) =>
  inputPath
    .replace(/^\.?\/?pages\//, "")
    .split("/")
    .filter(Boolean);

// Drop extensions and trailing index.* to form URL segments
const toSegments = (parts) => {
  const withoutExt = parts.map((p) => p.replace(/\.(md|njk|html)$/, ""));
  return withoutExt[withoutExt.length - 1] === "index"
    ? withoutExt.slice(0, -1)
    : withoutExt;
};

const humanLabel = (segment, fallback) =>
  (segment || fallback || "Home")
    .replace(/^[0-9]+[-_]/, "")
    .replace(/[-_]+/g, " ")
    .replace(/(^|\s)(\w)/g, (_, s, c) => s + c.toUpperCase());

module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      // Respect explicit settings, including false (e.g., 404).
      if (Object.prototype.hasOwnProperty.call(data, "permalink")) {
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

      const segments = toSegments(splitParts(data.page.inputPath));
      const label =
        data.title || humanLabel(segments.slice(-1)[0], data.page.fileSlug);

      const parentSegments = segments.slice(0, -1);
      let parent = parentSegments.length
        ? `/${parentSegments.join("/")}/`
        : undefined;

      const url =
        typeof data.permalink === "string" && data.permalink.length > 0
          ? data.permalink
          : ("/" + segments.join("/") + "/").replace(/\/+/g, "/");

      const isHome = url === "/";
      if (!parent && !isHome) parent = "/"; // attach top-level items to home

      const nav = { key: url, url, title: label };
      if (parent) nav.parent = parent;
      if (data.order !== undefined) nav.order = data.order;
      return nav;
    },
  },
};

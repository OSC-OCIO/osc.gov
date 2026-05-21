module.exports = async function (config) {
  const { default: studioPreset, normalizePathPrefix } = await import(
    "@studio/eleventy-preset"
  );
  const pathPrefix = normalizePathPrefix(process.env.BASEURL || "/");

  await config.addPlugin(studioPreset, {
    immediate: true,
    pathPrefix,
    passthroughCopy: [
      "admin",
      "uploads",
      "favicon.ico",
      "site.webmanifest",
      "img",
    ],
    watchTargets: ["styles", "js"],
    markdown: {
      breaks: false,
      markdownFilterName: "markdownify",
    },
    collections: {
      postsByYear: {
        tag: "press-release",
      },
    },
  });

  return {
    pathPrefix,
  };
};

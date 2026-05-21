module.exports = async function (config) {
  const { default: studioPreset } = await import(
    "@studio/eleventy-preset"
  );

  await studioPreset(config, {
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
};

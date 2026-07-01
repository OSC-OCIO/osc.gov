module.exports = async function (config) {
  const { formatNewsTagLabel } = require("./js/search/news-tag-labels");
  const { default: studioPreset } = await import(
    "@studio/eleventy-preset"
  );

  config.addFilter("newsTagLabel", formatNewsTagLabel);

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

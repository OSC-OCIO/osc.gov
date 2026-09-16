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

  config.addCollection("recentPressReleases", function (collectionApi) {
    const now = new Date();
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 18, 1);
    cutoff.setDate(
      Math.min(
        now.getDate(),
        new Date(cutoff.getFullYear(), cutoff.getMonth() + 1, 0).getDate(),
      ),
    );

    return collectionApi
      .getFilteredByTag("press-release")
      .filter(function (item) {
        return item.date >= cutoff;
      });
  });
};

module.exports = async function (config) {
  const { formatNewsTagLabel } = require("./js/search/news-tag-labels");
  const { default: studioPreset } = await import(
    "@studio/eleventy-preset"
  );

  config.addFilter("newsTagLabel", formatNewsTagLabel);

  // Browser folder saves can replace files rather than write them in place.
  // Poll for completed saves and reload the public preview after rebuilding.
  config.setChokidarConfig({
    usePolling: true,
    interval: 250,
    awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
  });
  config.setServerOptions({ liveReload: true, domDiff: false });

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

  // Keep the certified-agencies table editable as Markdown while retaining
  // USWDS responsive styling and accessible table labels on the public page.
  config.addTransform("certified-agencies-table", function (content) {
    if (this.page.url !== "/services/outreach/2302cert-status/") {
      return content;
    }

    return content.replace(/<table>[\s\S]*?<\/table>/, (table) => {
      const labels = [...table.matchAll(/<th>([\s\S]*?)<\/th>/g)].map(
        ([, label]) => label.replace(/<[^>]*>/g, "").replace(/"/g, "&quot;"),
      );
      return table
        .replace("<table>", '<table class="usa-table usa-table--compact usa-table--stacked width-full"><caption class="usa-sr-only">2302(c) certified agencies, points of contact, certification dates, and expiration dates</caption>')
        .replace(/<th>/g, '<th scope="col">')
        .replace(/<tbody>([\s\S]*?)<\/tbody>/, (_, body) =>
          `<tbody>${body.replace(/<tr>([\s\S]*?)<\/tr>/g, (_, row) => {
            let column = 0;
            return `<tr>${row.replace(/<td>([\s\S]*?)<\/td>/g, (_, cell) => {
              const index = column++;
              const tag = index === 0 ? "th" : "td";
              const scope = index === 0 ? ' scope="row"' : "";
              return `<${tag}${scope} data-label="${labels[index] || ""}">${cell}</${tag}>`;
            })}</tr>`;
          })}</tbody>`,
        );
    });
  });

  const { parseCardGroupYaml, renderUswdsCardGroup } = await import(
    "./js/cms/uswds-card-group.mjs"
  );
  const MarkdownIt = require("markdown-it");
  const cardMarkdown = new MarkdownIt({ html: false, linkify: true });
  config.addPairedShortcode("uswds_card_group", (body) =>
    renderUswdsCardGroup(parseCardGroupYaml(body), cardMarkdown),
  );

  const { parseSummaryBoxYaml, parseSummaryBoxAttributes, renderUswdsSummaryBox } =
    await import("./js/cms/uswds-summary-box.mjs");
  config.addLiquidTag("uswds_summary_box", (liquidEngine) => ({
    parse(tagToken, remainTokens) {
      this.attributes = tagToken.args;
      this.index = (tagToken.begin || 0) + 1;
      this.tokens = [];
      const stream = liquidEngine.parser.parseStream(remainTokens)
        .on("template", (template) => this.tokens.push(template.token))
        .on("tag:enduswds_summary_box", () => stream.stop())
        .on("end", () => { throw new Error("Unclosed uswds_summary_box tag"); });
      stream.start();
    },
    *render() {
      const body = this.tokens.map((token) => token.input.slice(token.begin, token.end)).join("");
      return renderUswdsSummaryBox({
        ...parseSummaryBoxYaml(body),
        ...parseSummaryBoxAttributes(this.attributes),
      }, cardMarkdown, { summaryBoxIndex: this.index });
    },
  }));

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

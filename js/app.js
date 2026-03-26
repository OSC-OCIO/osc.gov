require("@uswds/uswds");

const { initializeCaseSearch } = require("./search/case-search");
const { initializeResourceSearch } = require("./search/resource-search");

function initializeSearchFeatures() {
  initializeResourceSearch();
  initializeCaseSearch();

  const rawBaseHref = document.querySelector("base")?.getAttribute("href") || "/";
  let pathPrefix = "/";
  try {
    pathPrefix = new URL(rawBaseHref, window.location.origin).pathname;
  } catch (error) {
    pathPrefix = rawBaseHref;
  }

  if (!pathPrefix.startsWith("/")) {
    pathPrefix = `/${pathPrefix}`;
  }

  const normalizedPrefix = pathPrefix.replace(/\/+$/, "") || "/";
  const homePaths =
    normalizedPrefix === "/"
      ? ["/", "/index.html"]
      : [normalizedPrefix, `${normalizedPrefix}/`, `${normalizedPrefix}/index.html`];

  if (homePaths.includes(window.location.pathname)) {
    console.log("Everything you need to run your compliant government website: http://www.cloud.gov/pages/");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSearchFeatures);
} else {
  initializeSearchFeatures();
}

require("@uswds/uswds");

const { initializeCaseSearch } = require("./search/case-search");
const { initializeResourceSearch } = require("./search/resource-search");

function initializeSearchFeatures() {
  initializeResourceSearch();
  initializeCaseSearch();

  const rawBaseHref = document.querySelector("base")?.getAttribute("href");
  const appScriptPath =
    document
      .querySelector('script[src$="/assets/js/app.js"]')
      ?.getAttribute("src") || "";

  let pathPrefix = "/";
  if (rawBaseHref) {
    try {
      pathPrefix = new URL(rawBaseHref, window.location.origin).pathname;
    } catch (error) {
      pathPrefix = rawBaseHref;
    }
  } else if (appScriptPath) {
    try {
      const scriptPathname = new URL(appScriptPath, window.location.origin).pathname;
      pathPrefix = scriptPathname.replace(/\/assets\/js\/app\.js$/, "") || "/";
    } catch (error) {
      pathPrefix = appScriptPath.replace(/\/assets\/js\/app\.js$/, "") || "/";
    }
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

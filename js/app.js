require("@uswds/uswds");

const { initializeCaseSearch } = require("./search/case-search");
const { initializeResourceSearch } = require("./search/resource-search");

function initializeSearchFeatures() {
  initializeResourceSearch();
  initializeCaseSearch();

  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    console.log("Everything you need to run your compliant government website: http://www.cloud.gov/pages/");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSearchFeatures);
} else {
  initializeSearchFeatures();
}

require("@uswds/uswds");

const { initializeCaseSearch } = require("./search/case-search");
const { initializeResourceSearch } = require("./search/resource-search");

function initializeSearchFeatures() {
  initializeResourceSearch();
  initializeCaseSearch();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSearchFeatures);
} else {
  initializeSearchFeatures();
}

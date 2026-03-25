const { normalizePageUrl } = require("../../search-shared");
const {
  RESOURCE_FILTER_LABELS,
  populateFilterSelect,
  responseFilters,
  runPagefindSearch,
} = require("./common");
const { loadPagefind } = require("./pagefind");

function countMetaValues(docs, metaKey) {
  const counts = {};

  for (const doc of docs || []) {
    const rawValue = doc && doc.meta ? doc.meta[metaKey] : "";
    const value = String(rawValue || "").trim();
    if (!value) {
      continue;
    }

    counts[value] = (counts[value] || 0) + 1;
  }

  return counts;
}

function filterValues(response, docs, responseKey, metaKey) {
  const values = responseFilters(response)[responseKey];
  if (values && Object.keys(values).length) {
    return values;
  }

  return countMetaValues(docs, metaKey);
}

function collectResourceDom() {
  return {
    categories: Array.from(document.querySelectorAll(".resource-category")),
    items: Array.from(
      document.querySelectorAll(".resource-item[data-resource-key]"),
    ),
    sections: Array.from(document.querySelectorAll(".resource-section")),
  };
}

function allResourceKeys(resourceDom) {
  const keys = new Set();
  for (const item of resourceDom.items) {
    if (item.dataset.resourceKey) {
      keys.add(item.dataset.resourceKey);
    }
  }
  return keys;
}

function applyResourceVisibility(visibleKeys, resourceDom) {
  let visibleCount = 0;

  for (const item of resourceDom.items) {
    const key = item.dataset.resourceKey || "";
    const isVisible = visibleKeys.has(key);
    item.classList.toggle("display-none", !isVisible);
    if (isVisible) {
      visibleCount += 1;
    }
  }

  for (const section of resourceDom.sections) {
    const hasVisibleItem = Array.from(
      section.querySelectorAll(".resource-item[data-resource-key]"),
    ).some(function (item) {
      return !item.classList.contains("display-none");
    });

    section.classList.toggle("display-none", !hasVisibleItem);
  }

  for (const category of resourceDom.categories) {
    const hasVisibleSection = Array.from(
      category.querySelectorAll(".resource-section"),
    ).some(function (section) {
      return !section.classList.contains("display-none");
    });

    category.classList.toggle("display-none", !hasVisibleSection);
  }

  return visibleCount;
}

async function initializeResourceSearch() {
  const root = document.querySelector("#resource-search");
  if (!root) {
    return;
  }

  const form = document.querySelector("#resource-search-form");
  const status = document.querySelector("#resource-search-status");
  const clearButton = document.querySelector("#resource-search-clear");
  const parentSelect = document.querySelector("#resource-filter-parent");
  const topicSelect = document.querySelector("#resource-filter-topic");
  if (!form || !status || !clearButton || !topicSelect) {
    return;
  }

  let pagefind;
  try {
    pagefind = await loadPagefind();
  } catch (error) {
    status.textContent = "Filtering is temporarily unavailable.";
    return;
  }

  const resourceDom = collectResourceDom();
  const resourcePage = normalizePageUrl(root.dataset.resourcePage || "/");
  const pageFilters = { resource_page: [resourcePage] };
  let requestId = 0;
  let parentFilterValues = {};

  try {
    const bootstrapSearch = await runPagefindSearch(
      pagefind,
      null,
      { filters: pageFilters },
      true,
    );
    if (!bootstrapSearch.response.results.length) {
      applyResourceVisibility(allResourceKeys(resourceDom), resourceDom);
      status.textContent = "";
      return;
    }

    parentFilterValues = filterValues(
      bootstrapSearch.response,
      bootstrapSearch.docs,
      "resource_parent",
      "resource_parent",
    );
    const topicFilterValues = filterValues(
      bootstrapSearch.response,
      bootstrapSearch.docs,
      "resource_topic",
      "resource_topic",
    );

    if (parentSelect) {
      populateFilterSelect(
        parentSelect,
        "parent",
        parentFilterValues,
        parentSelect.value,
        RESOURCE_FILTER_LABELS,
      );
    }
    populateFilterSelect(
      topicSelect,
      "topic",
      topicFilterValues,
      topicSelect.value,
      RESOURCE_FILTER_LABELS,
    );
  } catch (error) {
    applyResourceVisibility(allResourceKeys(resourceDom), resourceDom);
    status.textContent = "Filtering is temporarily unavailable.";
    return;
  }

  const runFilterSearch = async function () {
    requestId += 1;
    const thisRequest = requestId;

    const selectedParent = parentSelect ? parentSelect.value : "";
    const selectedTopic = topicSelect.value;
    const hasActiveFilters = Boolean(selectedParent || selectedTopic);

    const topicFilters = { ...pageFilters };
    if (selectedParent) {
      topicFilters.resource_parent = [selectedParent];
    }

    try {
      const topicSearch = await runPagefindSearch(
        pagefind,
        null,
        { filters: topicFilters },
        true,
      );
      if (thisRequest !== requestId) {
        return;
      }

      if (parentSelect) {
        populateFilterSelect(
          parentSelect,
          "parent",
          parentFilterValues,
          selectedParent,
          RESOURCE_FILTER_LABELS,
        );
      }

      const topicValues = filterValues(
        topicSearch.response,
        topicSearch.docs,
        "resource_topic",
        "resource_topic",
      );
      populateFilterSelect(
        topicSelect,
        "topic",
        topicValues,
        selectedTopic,
        RESOURCE_FILTER_LABELS,
      );

      let resultDocs = topicSearch.docs || [];
      if (selectedTopic) {
        const resultFilters = {
          ...topicFilters,
          resource_topic: [selectedTopic],
        };
        const resultSearch = await runPagefindSearch(
          pagefind,
          null,
          { filters: resultFilters },
          true,
        );
        if (thisRequest !== requestId) {
          return;
        }

        resultDocs = resultSearch.docs || [];
      }

      const visibleKeys = new Set(
        resultDocs
          .map(function (doc) {
            return doc.meta && doc.meta.resource_key;
          })
          .filter(Boolean),
      );

      const visibleCount = applyResourceVisibility(visibleKeys, resourceDom);
      if (!hasActiveFilters && visibleCount > 0) {
        status.textContent = "";
        return;
      }

      if (visibleCount === 0) {
        status.textContent = "No matching resources found.";
        return;
      }

      status.textContent = `Showing ${visibleCount} matching resource${visibleCount === 1 ? "" : "s"}.`;
    } catch (error) {
      if (thisRequest !== requestId) {
        return;
      }
      status.textContent = "Filtering is temporarily unavailable.";
    }
  };

  clearButton.addEventListener("click", function () {
    if (parentSelect) {
      parentSelect.value = "";
    }
    topicSelect.value = "";
    runFilterSearch();
  });

  form.addEventListener("change", runFilterSearch);
  runFilterSearch();
}

module.exports = {
  initializeResourceSearch,
};

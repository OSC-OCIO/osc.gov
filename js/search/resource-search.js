const { RESOURCE_FILTER_LABELS, populateFilterSelect } = require("./common");

function collectResourceDom() {
  return {
    categories: Array.from(document.querySelectorAll(".resource-category")),
    items: Array.from(document.querySelectorAll(".resource-item")),
    sections: Array.from(document.querySelectorAll(".resource-section")),
  };
}

function countValues(items, key) {
  const counts = {};

  for (const item of items) {
    const value = String(item.dataset[key] || "").trim();
    if (!value) {
      continue;
    }

    counts[value] = (counts[value] || 0) + 1;
  }

  return counts;
}

function itemMatchesFilter(item, selectedParent, selectedTopic) {
  const parent = String(item.dataset.resourceParent || "").trim();
  const topic = String(item.dataset.resourceTopic || "").trim();

  if (selectedParent && parent !== selectedParent) {
    return false;
  }

  if (selectedTopic && topic !== selectedTopic) {
    return false;
  }

  return true;
}

function applyResourceVisibility(resourceDom, selectedParent, selectedTopic) {
  let visibleCount = 0;

  for (const item of resourceDom.items) {
    const isVisible = itemMatchesFilter(item, selectedParent, selectedTopic);
    item.classList.toggle("display-none", !isVisible);

    if (isVisible) {
      visibleCount += 1;
    }
  }

  for (const section of resourceDom.sections) {
    const hasVisibleItem = Array.from(
      section.querySelectorAll(".resource-item"),
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

function initializeResourceSearch() {
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

  const resourceDom = collectResourceDom();
  const parentValues = countValues(resourceDom.items, "resourceParent");

  const runFilterSearch = function () {
    const selectedParent = parentSelect ? parentSelect.value : "";
    const selectedTopic = topicSelect.value;
    const hasActiveFilters = Boolean(selectedParent || selectedTopic);

    if (parentSelect) {
      populateFilterSelect(
        parentSelect,
        "parent",
        parentValues,
        selectedParent,
        RESOURCE_FILTER_LABELS,
      );
    }

    const topicSourceItems = resourceDom.items.filter(function (item) {
      if (!selectedParent) {
        return true;
      }

      return String(item.dataset.resourceParent || "").trim() === selectedParent;
    });
    const topicValues = countValues(topicSourceItems, "resourceTopic");
    populateFilterSelect(
      topicSelect,
      "topic",
      topicValues,
      selectedTopic,
      RESOURCE_FILTER_LABELS,
    );

    const visibleCount = applyResourceVisibility(
      resourceDom,
      selectedParent,
      topicSelect.value,
    );

    if (!hasActiveFilters && visibleCount > 0) {
      status.textContent = "";
      return;
    }

    if (visibleCount === 0) {
      status.textContent = "No matching resources found.";
      return;
    }

    status.textContent = `Showing ${visibleCount} matching resource${visibleCount === 1 ? "" : "s"}.`;
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

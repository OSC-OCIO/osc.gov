const {
  normalizeLookupValue,
} = require("../../search-shared");
const {
  CASES_PER_PAGE,
  CASE_FILTER_LABELS,
  activeFilters,
  debounce,
  populateFilterSelect,
  responseFilters,
  runPagefindSearch,
} = require("./common");
const { loadPagefind } = require("./pagefind");
const CASE_SORT = { "date-iso": "desc" };

function exactCaseMatch(caseNumbers, caseNumber) {
  const expected = normalizeLookupValue(caseNumber);
  if (!expected) {
    return true;
  }

  const values = Array.isArray(caseNumbers)
    ? caseNumbers
    : String(caseNumbers || "").split("|");

  return values.some(function (value) {
    return normalizeLookupValue(value) === expected;
  });
}

function pageSequence(totalPages, currentPage) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, function (_, idx) {
      return idx + 1;
    });
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

function renderSearchPagination(container, totalItems, currentPage, onPageChange) {
  container.innerHTML = "";
  const totalPages = Math.ceil(totalItems / CASES_PER_PAGE);

  if (totalPages <= 1) {
    container.classList.add("display-none");
    return;
  }

  container.classList.remove("display-none");

  const nav = document.createElement("nav");
  nav.className = "usa-pagination padding-top-2";
  nav.setAttribute("aria-label", "Pagination");

  const list = document.createElement("ul");
  list.className = "usa-pagination__list";

  if (currentPage > 1) {
    const prevItem = document.createElement("li");
    prevItem.className = "usa-pagination__item usa-pagination__arrow";

    const prevLink = document.createElement("a");
    prevLink.href = "#";
    prevLink.className = "usa-pagination__link usa-pagination__previous-page";
    prevLink.setAttribute("aria-label", "Previous page");
    prevLink.innerHTML =
      '<span class="usa-pagination__link-text"> Previous </span>';
    prevLink.addEventListener("click", function (event) {
      event.preventDefault();
      onPageChange(currentPage - 1);
    });

    prevItem.appendChild(prevLink);
    list.appendChild(prevItem);
  }

  for (const page of pageSequence(totalPages, currentPage)) {
    if (page === "ellipsis") {
      const overflowItem = document.createElement("li");
      overflowItem.className = "usa-pagination__item usa-pagination__overflow";
      overflowItem.setAttribute("role", "presentation");
      overflowItem.textContent = " … ";
      list.appendChild(overflowItem);
      continue;
    }

    const pageItem = document.createElement("li");
    pageItem.className = "usa-pagination__item usa-pagination__page-no";

    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.className = `usa-pagination__button${page === currentPage ? " usa-current" : ""}`;
    pageLink.setAttribute("aria-label", `Page ${page}`);
    pageLink.textContent = String(page);
    pageLink.addEventListener("click", function (event) {
      event.preventDefault();
      onPageChange(page);
    });

    pageItem.appendChild(pageLink);
    list.appendChild(pageItem);
  }

  if (currentPage < totalPages) {
    const nextItem = document.createElement("li");
    nextItem.className = "usa-pagination__item usa-pagination__arrow";

    const nextLink = document.createElement("a");
    nextLink.href = "#";
    nextLink.className = "usa-pagination__link usa-pagination__next-page";
    nextLink.setAttribute("aria-label", "Next page");
    nextLink.innerHTML =
      '<span class="usa-pagination__link-text"> Next </span>';
    nextLink.addEventListener("click", function (event) {
      event.preventDefault();
      onPageChange(currentPage + 1);
    });

    nextItem.appendChild(nextLink);
    list.appendChild(nextItem);
  }

  nav.appendChild(list);
  container.appendChild(nav);
}

function createElement(tagName, options) {
  const element = document.createElement(tagName);
  const config = options || {};

  if (config.className) {
    element.className = config.className;
  }
  if (config.textContent) {
    element.textContent = config.textContent;
  }
  if (config.html) {
    element.innerHTML = config.html;
  }
  if (config.attributes) {
    for (const key of Object.keys(config.attributes)) {
      const value = config.attributes[key];
      if (value !== null && typeof value !== "undefined" && value !== "") {
        element.setAttribute(key, value);
      }
    }
  }

  return element;
}

function normalizeCaseRecord(record) {
  const files = Array.isArray(record.files) ? record.files : [];
  const results = Array.isArray(record.results) ? record.results : [];
  const caseNumbers = Array.isArray(record.caseNumbers) ? record.caseNumbers : [];

  return {
    agency: record.agency || "",
    caseNumbers,
    dateDisplay: record.dateDisplay || "",
    dateIso: record.dateIso || "",
    files,
    location: record.location || "",
    results,
    subagency: record.subagency || "",
    title: record.title || "",
    url: record.url || "",
  };
}

function parseJsonArray(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function normalizeLocationValue(value) {
  return String(value || "").replace(/^location:\s*/i, "").trim();
}

function buildCaseRecordFromDoc(doc) {
  const meta = doc.meta || {};
  return normalizeCaseRecord({
    agency: meta.agency,
    caseNumbers: String(meta["case-number"] || "")
      .split("|")
      .filter(Boolean),
    dateDisplay: meta.date,
    dateIso: meta["date-iso"] || "",
    files: parseJsonArray(meta["case-files-json"]).filter(function (file) {
      return file && file.href;
    }),
    location: normalizeLocationValue(meta["case-location"]),
    results: parseJsonArray(meta["case-results-json"]),
    subagency: meta.subagency,
    title: meta.title,
    url: doc.url,
  });
}

function renderCaseRecord(container, record) {
  const item = createElement("li", {
    className: "tablet:grid-col-6 usa-card",
  });
  const card = createElement("div", {
    className: "usa-card__container border-base-lightest shadow-3",
  });
  const header = createElement("header", { className: "usa-card__header" });
  const heading = createElement("h3", { className: "usa-card__heading" });
  heading.textContent = record.title;
  header.appendChild(heading);

  const body = createElement("div", { className: "usa-card__body" });
  const details = createElement("ul", {
    className: "usa-list usa-list--unstyled margin-top-0 margin-bottom-2",
    attributes: { "aria-label": "More information" },
  });

  if (record.agency || record.subagency) {
    const itemElement = document.createElement("li");
    const wrapper = createElement("span", {
      className: "display-block margin-bottom-2",
    });

    if (record.agency) {
      wrapper.appendChild(
        createElement("span", {
          className: "usa-tag",
          textContent: record.agency,
        }),
      );
    }

    if (record.subagency) {
      wrapper.appendChild(
        createElement("span", {
          className: "usa-tag margin-left-1",
          textContent: record.subagency,
        }),
      );
    }

    itemElement.appendChild(wrapper);
    details.appendChild(itemElement);
  }

  if (record.location) {
    const locationItem = document.createElement("li");
    locationItem.className = "margin-bottom-1";

    locationItem.appendChild(
      createElement("span", {
        className: "text-bold",
        textContent: "Location:",
      }),
    );
    locationItem.appendChild(document.createTextNode(` ${record.location}`));
    details.appendChild(locationItem);
  }

  if (record.dateDisplay || record.dateIso) {
    const dateItem = document.createElement("li");
    dateItem.className = "margin-bottom-2";
    dateItem.appendChild(
      createElement("span", {
        className: "text-bold",
        textContent: "Date closed:",
      }),
    );
    dateItem.appendChild(document.createTextNode(" "));
    dateItem.appendChild(
      createElement("time", {
        textContent: record.dateDisplay,
        attributes: {
          datetime: record.dateIso,
        },
      }),
    );
    details.appendChild(dateItem);
  }

  body.appendChild(details);

  if (record.results.length) {
    body.appendChild(
      createElement("h4", {
        className: "margin-top-0 margin-bottom-1",
        textContent: "Results:",
      }),
    );

    const resultList = document.createElement("ul");
    for (const result of record.results) {
      resultList.appendChild(
        createElement("li", {
          textContent: result,
        }),
      );
    }
    body.appendChild(resultList);
  }

  if (record.files.length) {
    body.appendChild(
      createElement("h4", {
        className: "margin-bottom-1",
        textContent: "Associated files:",
      }),
    );

    const fileList = createElement("ul", {
      className: "usa-icon-list",
    });
    for (const file of record.files) {
      const fileItem = createElement("li", {
        className: "usa-icon-list__item",
      });
      const fileIcon = createElement("div", {
        className: "usa-icon-list__icon",
        html: '<svg class="usa-icon" aria-hidden="true" role="img"><use xlink:href="#svg-file_present"></use></svg>',
      });
      const fileContent = createElement("div", {
        className: "usa-icon-list__content",
      });
      const fileLink = createElement("a", {
        textContent: file.label || file.href,
        attributes: {
          href: file.href,
        },
      });
      fileItem.appendChild(fileIcon);
      fileContent.appendChild(fileLink);
      fileItem.appendChild(fileContent);
      fileList.appendChild(fileItem);
    }
    body.appendChild(fileList);
  }

  card.appendChild(header);
  card.appendChild(body);
  item.appendChild(card);
  container.appendChild(item);
}

function renderCaseList(container, records) {
  container.innerHTML = "";
  for (const record of records) {
    renderCaseRecord(container, record);
  }
}

function parsePageNumber(value) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function focusResultsRegion() {
  const mainContent = document.querySelector("#main-content");
  if (!mainContent) {
    return;
  }

  if (!mainContent.hasAttribute("tabindex")) {
    mainContent.setAttribute("tabindex", "-1");
  }

  mainContent.scrollIntoView({ block: "start" });
  mainContent.focus();
}

async function initializeCaseSearch() {
  const root = document.querySelector("#case-search");
  if (!root) {
    return;
  }

  const queryInput = document.querySelector("#case-search-query");
  const form = document.querySelector("#case-search-form");
  const clearButton = document.querySelector("#case-search-clear");
  const status = document.querySelector("#case-search-status");
  const listContainer = document.querySelector(
    "#case-results .usa-card-group, #case-results .usa-collection",
  );
  const searchPagination = document.querySelector("#case-search-pagination");
  if (!listContainer || !queryInput || !form || !clearButton || !status) {
    return;
  }

  let browseRecords = [];
  const initialListMarkup = listContainer.innerHTML;
  const initialStatusText = status.textContent;
  const url = new URL(window.location.href);
  const initialParams = url.searchParams;

  const selects = {
    agency: document.querySelector("#case-filter-agency"),
    year: document.querySelector("#case-filter-year"),
  };
  let exactCaseNumber = initialParams.get("case") || "";

  queryInput.value = initialParams.get("query") || exactCaseNumber || "";
  for (const key of Object.keys(selects)) {
    if (initialParams.has(key) && selects[key]) {
      selects[key].value = initialParams.get(key) || "";
    }
  }

  let pagefind;
  try {
    pagefind = await loadPagefind();
  } catch (error) {
    status.textContent = "Search is temporarily unavailable.";
    return;
  }

  const hydrateFilters = async function () {
    let filters = {};
    try {
      filters = await pagefind.filters();
    } catch (error) {
      filters = {};
    }

    const hasAnyFilters = Object.keys(CASE_FILTER_LABELS).some(function (key) {
      return filters[key] && Object.keys(filters[key]).length;
    });

    if (!hasAnyFilters) {
      try {
        const bootstrapSearch = await runPagefindSearch(
          pagefind,
          null,
          { sort: CASE_SORT },
          false,
        );
        filters = responseFilters(bootstrapSearch.response);
      } catch (error) {
        filters = {};
      }
    }

    for (const key of Object.keys(selects)) {
      populateFilterSelect(
        selects[key],
        key,
        filters[key],
        selects[key] ? selects[key].value : "",
        CASE_FILTER_LABELS,
      );
    }
  };

  await hydrateFilters();

  try {
    const browseSearch = await runPagefindSearch(
      pagefind,
      null,
      { sort: CASE_SORT },
      true,
    );
    browseRecords = browseSearch.docs.map(buildCaseRecordFromDoc);
  } catch (error) {
    browseRecords = [];
  }

  let requestId = 0;
  let currentRecords = browseRecords;
  let currentPage = parsePageNumber(initialParams.get("page"));
  let searchModeActive = false;

  const syncSearchParams = function () {
    const nextUrl = new URL(window.location.href);
    const query = queryInput.value.trim();
    const filters = activeFilters(selects);

    if (query) {
      nextUrl.searchParams.set("query", query);
    } else {
      nextUrl.searchParams.delete("query");
    }

    for (const key of Object.keys(selects)) {
      if (filters[key] && filters[key][0]) {
        nextUrl.searchParams.set(key, filters[key][0]);
      } else {
        nextUrl.searchParams.delete(key);
      }
    }

    if (
      exactCaseNumber &&
      normalizeLookupValue(query) === normalizeLookupValue(exactCaseNumber)
    ) {
      nextUrl.searchParams.set("case", exactCaseNumber);
    } else {
      nextUrl.searchParams.delete("case");
      exactCaseNumber = "";
    }

    if (currentPage > 1) {
      nextUrl.searchParams.set("page", String(currentPage));
    } else {
      nextUrl.searchParams.delete("page");
    }

    const nextPath = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextPath !== currentPath) {
      window.history.replaceState({}, "", nextPath);
    }
  };

  const hasSearchCriteria = function () {
    const hasQuery = queryInput.value.trim().length > 0;
    const hasFilters = Object.keys(activeFilters(selects)).length > 0;
    return hasQuery || hasFilters;
  };

  const exitSearchMode = function () {
    if (!searchModeActive) {
      return;
    }

    searchModeActive = false;
    requestId += 1;
    currentRecords = browseRecords;
    currentPage = parsePageNumber(new URL(window.location.href).searchParams.get("page"));

    if (!currentRecords.length) {
      listContainer.innerHTML = initialListMarkup;
      status.textContent = initialStatusText;
      if (searchPagination) {
        searchPagination.classList.add("display-none");
        searchPagination.innerHTML = "";
      }
      return;
    }

    renderCurrentPage();
    hydrateFilters();
  };

  const renderCurrentPage = function (options) {
    const settings = options || {};
    const total = currentRecords.length;
    const totalPages = Math.max(Math.ceil(total / CASES_PER_PAGE), 1);
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);

    const startIndex = (currentPage - 1) * CASES_PER_PAGE;
    const visibleRecords = currentRecords.slice(
      startIndex,
      startIndex + CASES_PER_PAGE,
    );
    renderCaseList(listContainer, visibleRecords);

    if (!searchModeActive) {
      if (totalPages > 1) {
        status.textContent = `Showing ${total} cases. Page ${currentPage} of ${totalPages}.`;
      } else {
        status.textContent = initialStatusText;
      }
    } else if (total === 0) {
      status.textContent = "No matching cases found.";
    } else if (totalPages > 1) {
      status.textContent = `Showing ${total} matching cases. Page ${currentPage} of ${totalPages}.`;
    } else {
      status.textContent = `Showing ${total} matching cases.`;
    }

    syncSearchParams();

    if (searchPagination) {
      renderSearchPagination(
        searchPagination,
        total,
        currentPage,
        function (nextPage) {
          currentPage = nextPage;
          renderCurrentPage({ focusResults: true });
        },
      );
    }

    if (settings.focusResults) {
      focusResultsRegion();
    }
  };

  const runSearch = async function () {
    if (!hasSearchCriteria()) {
      exitSearchMode();
      return;
    }

    searchModeActive = true;
    requestId += 1;
    const thisRequest = requestId;

    const query = queryInput.value.trim() || null;
    const filters = activeFilters(selects);
    currentPage = 1;
    syncSearchParams();

    status.textContent = "Searching...";
    if (searchPagination) {
      searchPagination.classList.add("display-none");
    }

    let searchResult;
    try {
      searchResult = await runPagefindSearch(
        pagefind,
        query,
        {
          filters,
          sort: CASE_SORT,
        },
        true,
      );
    } catch (error) {
      if (thisRequest !== requestId) {
        return;
      }
      status.textContent = "Search is temporarily unavailable.";
      return;
    }

    if (thisRequest !== requestId) {
      return;
    }

    const filterValues = responseFilters(searchResult.response);
    for (const key of Object.keys(selects)) {
      populateFilterSelect(
        selects[key],
        key,
        filterValues[key],
        selects[key] ? selects[key].value : "",
        CASE_FILTER_LABELS,
      );
    }

    currentRecords = searchResult.docs
      .map(buildCaseRecordFromDoc)
      .filter(function (record) {
        if (!exactCaseNumber) {
          return true;
        }

        return exactCaseMatch(record.caseNumbers, exactCaseNumber);
      });
    currentPage = 1;
    renderCurrentPage();
  };

  const debouncedSearch = debounce(runSearch, 200);

  queryInput.addEventListener("input", debouncedSearch);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    debouncedSearch.cancel();
    runSearch();
  });
  form.addEventListener("change", function () {
    debouncedSearch.cancel();
    runSearch();
  });
  clearButton.addEventListener("click", function () {
    debouncedSearch.cancel();
    queryInput.value = "";
    exactCaseNumber = "";
    currentPage = 1;
    for (const key of Object.keys(selects)) {
      if (selects[key]) {
        selects[key].value = "";
      }
    }
    exitSearchMode();
  });

  if (hasSearchCriteria()) {
    runSearch();
  } else if (browseRecords.length) {
    renderCurrentPage();
  }
}

module.exports = {
  initializeCaseSearch,
};

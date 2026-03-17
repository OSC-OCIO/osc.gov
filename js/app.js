require("@uswds/uswds");

const CASES_PER_PAGE = 10;
const FILTER_LABELS = {
  agency: "All agencies",
  year: "All years",
};

function waitForPagefind() {
  if (window.casePagefind) {
    return Promise.resolve(window.casePagefind);
  }

  return new Promise(function (resolve) {
    window.addEventListener(
      "casePagefindReady",
      function () {
        resolve(window.casePagefind);
      },
      { once: true },
    );
  });
}

function sortFilterEntries(filterName, values) {
  const entries = Object.entries(values || {});
  if (filterName === "year") {
    return entries.sort(function (a, b) {
      return Number(b[0]) - Number(a[0]);
    });
  }

  return entries.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });
}

function populateFilterSelect(select, filterName, values, selectedValue) {
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = FILTER_LABELS[filterName];
  select.appendChild(defaultOption);

  const options = sortFilterEntries(filterName, values);
  for (const optionEntry of options) {
    const value = (optionEntry[0] || "").trim();
    const count = optionEntry[1];
    if (!value) {
      continue;
    }

    const option = document.createElement("option");
    option.value = value;
    option.textContent = `${value} (${count})`;
    if (selectedValue && selectedValue === value) {
      option.selected = true;
    }
    select.appendChild(option);
  }
}

function activeFilters(selects) {
  const filters = {};
  for (const key of Object.keys(selects)) {
    if (selects[key].value) {
      filters[key] = [selects[key].value];
    }
  }
  return filters;
}

function responseFilters(response) {
  if (!response) {
    return {};
  }

  return response.filters || response.totalFilters || {};
}

function normalizePath(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    let pathname = parsed.pathname || "/";
    pathname = pathname.replace(/\/index\.html$/i, "/");
    pathname = pathname.replace(/\/{2,}/g, "/");
    return pathname.endsWith("/") ? pathname : `${pathname}/`;
  } catch (error) {
    return String(url || "");
  }
}

function pathVariants(url) {
  const normalized = normalizePath(url);
  if (!normalized) {
    return [];
  }

  const variants = new Set([normalized, normalized.toLowerCase()]);

  if (normalized.endsWith("/")) {
    const withoutTrailingSlash = normalized.slice(0, -1);
    variants.add(withoutTrailingSlash);
    variants.add(withoutTrailingSlash.toLowerCase());
    variants.add(`${withoutTrailingSlash}/index.html`);
    variants.add(`${withoutTrailingSlash}/index.html`.toLowerCase());
  } else {
    variants.add(`${normalized}/`);
    variants.add(`${normalized}/`.toLowerCase());
  }

  return Array.from(variants);
}

function normalizeCaseLookupValue(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function exactCaseMatch(metaValue, caseNumber) {
  const expected = normalizeCaseLookupValue(caseNumber);
  if (!expected) {
    return true;
  }

  return String(metaValue || "")
    .split("|")
    .some(function (value) {
      return normalizeCaseLookupValue(value) === expected;
    });
}

function buildCaseLookupKey(title, date) {
  const normalizedTitle = normalizeCaseLookupValue(title);
  const normalizedDate = normalizeCaseLookupValue(date);
  return `${normalizedTitle}::${normalizedDate}`;
}

function buildCaseTemplateLookup() {
  const bank = document.querySelector("#case-template-bank");
  const lookup = {
    byTitleDate: new Map(),
    byTitle: new Map(),
  };
  if (!bank) {
    return lookup;
  }

  // Reuse server-rendered case cards so JS controls behavior, not presentation.
  const items = bank.querySelectorAll("li");
  for (const item of items) {
    const titleNode = item.querySelector('[data-pagefind-meta="title"]');
    const dateNode = item.querySelector('[data-pagefind-meta="date"]');
    const title = titleNode ? titleNode.textContent : "";
    const date = dateNode ? dateNode.textContent : "";
    const titleKey = normalizeCaseLookupValue(title);

    if (titleKey && !lookup.byTitle.has(titleKey)) {
      lookup.byTitle.set(titleKey, item);
    }

    if (titleKey && normalizeCaseLookupValue(date)) {
      lookup.byTitleDate.set(buildCaseLookupKey(title, date), item);
    }
  }

  return lookup;
}

function renderCaseList(container, docs, templateLookup) {
  container.innerHTML = "";

  for (const doc of docs) {
    const meta = doc.meta || {};
    const key = buildCaseLookupKey(meta.title, meta.date);
    const titleKey = normalizeCaseLookupValue(meta.title);
    const template =
      templateLookup.byTitleDate.get(key) || templateLookup.byTitle.get(titleKey);

    if (template) {
      container.appendChild(template.cloneNode(true));
    }
  }
}

function pageSequence(totalPages, currentPage) {
  // Mirror the condensed first/last + ellipsis pagination pattern.
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

function renderSearchPagination(
  container,
  totalItems,
  currentPage,
  onPageChange,
) {
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
  const pagination = document.querySelector(".usa-pagination");
  const searchPagination = document.querySelector("#case-search-pagination");
  const templateLookup = buildCaseTemplateLookup();
  if (!listContainer || !queryInput || !form || !clearButton || !status) {
    return;
  }
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
    pagefind = await waitForPagefind();
    const basePath = window.casePagefindBasePath || "/pagefind/";
    await pagefind.options({ basePath });
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

    const hasAnyFilters = Object.keys(FILTER_LABELS).some(function (key) {
      return filters[key] && Object.keys(filters[key]).length;
    });

    if (!hasAnyFilters) {
      try {
        const bootstrapResponse = await pagefind.search(null, {
          sort: { date: "desc" },
        });
        filters = responseFilters(bootstrapResponse);
      } catch (error) {
        filters = {};
      }
    }

    for (const key of Object.keys(selects)) {
      populateFilterSelect(selects[key], key, filters[key], selects[key].value);
    }
  };

  await hydrateFilters();

  let requestId = 0;
  let currentDocs = [];
  let currentPage = 1;
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
      normalizeCaseLookupValue(query) === normalizeCaseLookupValue(exactCaseNumber)
    ) {
      nextUrl.searchParams.set("case", exactCaseNumber);
    } else {
      nextUrl.searchParams.delete("case");
      exactCaseNumber = "";
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
    listContainer.innerHTML = initialListMarkup;
    status.textContent = initialStatusText;

    if (pagination) {
      pagination.classList.remove("display-none");
    }
    if (searchPagination) {
      searchPagination.classList.add("display-none");
      searchPagination.innerHTML = "";
    }

    hydrateFilters();
  };

  const renderCurrentPage = function () {
    // Client-side pagination over current Pagefind results.
    const total = currentDocs.length;
    const totalPages = Math.max(Math.ceil(total / CASES_PER_PAGE), 1);
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);

    const startIndex = (currentPage - 1) * CASES_PER_PAGE;
    const visibleDocs = currentDocs.slice(
      startIndex,
      startIndex + CASES_PER_PAGE,
    );
    renderCaseList(listContainer, visibleDocs, templateLookup);

    if (total === 0) {
      status.textContent = "No matching cases found.";
    } else if (totalPages > 1) {
      status.textContent = `Showing ${total} matching cases. Page ${currentPage} of ${totalPages}.`;
    } else {
      status.textContent = `Showing ${total} matching cases.`;
    }

    if (searchPagination) {
      renderSearchPagination(
        searchPagination,
        total,
        currentPage,
        function (nextPage) {
          currentPage = nextPage;
          renderCurrentPage();
        },
      );
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
    syncSearchParams();

    status.textContent = "Searching...";
    if (pagination) {
      pagination.classList.add("display-none");
    }
    if (searchPagination) {
      searchPagination.classList.add("display-none");
    }

    let response;
    try {
      response = await pagefind.search(query, {
        filters: filters,
        sort: { date: "desc" },
      });
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

    const filterValues = responseFilters(response);
    for (const key of Object.keys(selects)) {
      populateFilterSelect(
        selects[key],
        key,
        filterValues[key],
        selects[key].value,
      );
    }

    const docs = await Promise.all(
      response.results.map(function (result) {
        return result.data();
      }),
    );

    currentDocs = docs.filter(function (doc) {
      if (!exactCaseNumber) {
        return true;
      }

      return exactCaseMatch(doc.meta && doc.meta["case-number"], exactCaseNumber);
    });
    currentPage = 1;
    renderCurrentPage();
  };

  const debouncedSearch = function () {
    window.clearTimeout(debouncedSearch.timer);
    debouncedSearch.timer = window.setTimeout(runSearch, 200);
  };

  queryInput.addEventListener("input", debouncedSearch);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    runSearch();
  });
  form.addEventListener("change", runSearch);
  clearButton.addEventListener("click", function () {
    queryInput.value = "";
    exactCaseNumber = "";
    for (const key of Object.keys(selects)) {
      selects[key].value = "";
    }
    syncSearchParams();
    exitSearchMode();
  });

  if (hasSearchCriteria()) {
    runSearch();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeCaseSearch();
});

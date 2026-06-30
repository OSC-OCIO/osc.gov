const CASES_PER_PAGE = 10;
const NEWS_PER_PAGE = 10;
const CASE_FILTER_LABELS = {
  agency: "All agencies",
  year: "All years",
};
const NEWS_FILTER_LABELS = {
  year: "All years",
  tag: "All tags",
};
const RESOURCE_FILTER_LABELS = {
  parent: "All categories",
  topic: "All topics",
};

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

function populateFilterSelect(
  select,
  filterName,
  values,
  selectedValue,
  labelMap,
  formatLabel,
) {
  if (!select) {
    return;
  }

  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent =
    (labelMap && labelMap[filterName]) || "All options";
  select.appendChild(defaultOption);

  const options = sortFilterEntries(filterName, values);
  for (const optionEntry of options) {
    const value = (optionEntry[0] || "").trim();
    const count = optionEntry[1];
    if (!value) {
      continue;
    }

    const option = document.createElement("option");
    const label = formatLabel ? formatLabel(value, filterName) : value;
    option.value = value;
    option.textContent = `${label} (${count})`;
    option.selected = selectedValue === value;
    select.appendChild(option);
  }
}

function activeFilters(selects) {
  const filters = {};
  for (const key of Object.keys(selects)) {
    if (selects[key] && selects[key].value) {
      filters[key] = [selects[key].value];
    }
  }
  return filters;
}

function responseFilters(response) {
  if (!response) {
    return {};
  }

  const filtered = response.filters || {};
  const totals = response.totalFilters || {};
  return {
    ...totals,
    ...filtered,
  };
}

async function loadSearchDocuments(response) {
  return Promise.all(
    response.results.map(function (result) {
      return result.data();
    }),
  );
}

async function runPagefindSearch(pagefind, query, options, loadDocs) {
  const response = await pagefind.search(query, options || {});
  return {
    docs: loadDocs ? await loadSearchDocuments(response) : null,
    response,
  };
}

function debounce(fn, delay) {
  let timer;

  const wrapped = function () {
    const args = arguments;
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      fn.apply(null, args);
    }, delay);
  };

  wrapped.cancel = function () {
    window.clearTimeout(timer);
  };

  return wrapped;
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

function renderSearchPagination(
  container,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
) {
  container.innerHTML = "";
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

function withSitePathPrefix(rawHref) {
  const href = String(rawHref || "").trim();
  if (!href) {
    return "";
  }

  if (
    /^[a-z][a-z0-9+.-]*:/i.test(href) ||
    href.startsWith("//") ||
    href.startsWith("#")
  ) {
    return href;
  }

  const pagefindBasePath = String(window.sitePagefindBasePath || "").trim();
  const pathPrefix = pagefindBasePath
    ? pagefindBasePath.replace(/\/pagefind\/?$/, "/")
    : "/";

  if (!href.startsWith("/") || pathPrefix === "/") {
    return href;
  }

  const normalizedPrefix = pathPrefix.endsWith("/")
    ? pathPrefix.slice(0, -1)
    : pathPrefix;
  if (!normalizedPrefix || href.startsWith(`${normalizedPrefix}/`)) {
    return href;
  }

  return `${normalizedPrefix}${href}`;
}

module.exports = {
  CASES_PER_PAGE,
  CASE_FILTER_LABELS,
  NEWS_FILTER_LABELS,
  NEWS_PER_PAGE,
  RESOURCE_FILTER_LABELS,
  activeFilters,
  createElement,
  debounce,
  focusResultsRegion,
  parsePageNumber,
  populateFilterSelect,
  renderSearchPagination,
  responseFilters,
  runPagefindSearch,
  withSitePathPrefix,
};

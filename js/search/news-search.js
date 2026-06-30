const {
  NEWS_FILTER_LABELS,
  NEWS_PER_PAGE,
  activeFilters,
  createElement,
  focusResultsRegion,
  generateFilterOptionCounts,
  parsePageNumber,
  populateFilterSelect,
  renderSearchPagination,
  runPagefindSearch,
  withSitePathPrefix,
} = require("./common");
const { formatNewsTagLabel } = require("./news-tag-labels");
const { loadPagefind } = require("./pagefind");

const NEWS_SORT = { "date-iso": "desc" };
const NEWS_TYPE_FILTER_NAME = "content-type";
const NEWS_TYPE_FILTER_VALUE = "press-release";

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

function stripHtml(value) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(value || "");
  return wrapper.textContent.replace(/\s+/g, " ").trim();
}

function formatIsoDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function truncateWords(value, limit) {
  const words = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length <= limit) {
    return words.join(" ");
  }

  return `${words.slice(0, limit).join(" ")}...`;
}

function recordDateFromUrl(url) {
  const match = String(url || "").match(/\/news\/(\d{4}-\d{2}-\d{2})\//);
  return match ? match[1] : "";
}

function normalizeNewsRecord(doc) {
  const meta = doc.meta || {};
  const dateIso = meta["date-iso"] || recordDateFromUrl(doc.url);
  const tags = parseJsonArray(meta["tags-json"]).filter(function (tag) {
    return tag && tag !== NEWS_TYPE_FILTER_VALUE;
  });
  const summary = stripHtml(doc.excerpt) || stripHtml(doc.content);

  return {
    dateDisplay: meta.date || formatIsoDate(dateIso),
    dateIso,
    excerpt: truncateWords(summary, 30),
    tags,
    title: meta.title || doc.meta?.title || "Untitled press release",
    url: doc.url || "",
  };
}

function newsFilterValues(record, filterName) {
  if (filterName === "year") {
    return String(record.dateIso || "").slice(0, 4);
  }

  if (filterName === "tag") {
    return record.tags || [];
  }

  return "";
}

function renderNewsRecord(container, record) {
  const item = createElement("li", {
    className: "usa-collection__item",
    attributes: {
      "data-news-item": "true",
      "data-news-date": record.dateIso,
    },
  });
  const body = createElement("div", { className: "usa-collection__body" });
  const heading = createElement("h3", { className: "usa-collection__heading" });
  const link = createElement("a", {
    className: "usa-link",
    textContent: record.title,
    attributes: {
      "data-news-title": "true",
      href: withSitePathPrefix(record.url),
    },
  });

  heading.appendChild(link);
  body.appendChild(heading);

  if (record.excerpt) {
    body.appendChild(
      createElement("p", {
        className: "usa-collection__description",
        textContent: record.excerpt,
        attributes: {
          "data-news-description": "true",
        },
      }),
    );
  }

  const meta = createElement("ul", {
    className: "usa-collection__meta",
    attributes: { "aria-label": "More information" },
  });
  const dateItem = createElement("li", {
    className: "usa-collection__meta-item",
    html: '<span class="position-relative bottom-neg-2px margin-right-05"><svg class="usa-icon" aria-hidden="true" role="img"><use xlink:href="#svg-calendar_today"></use></svg></span>',
  });
  dateItem.appendChild(
    createElement("time", {
      textContent: record.dateDisplay,
      attributes: {
        datetime: record.dateIso,
        "data-news-date-display": "true",
      },
    }),
  );
  meta.appendChild(dateItem);
  body.appendChild(meta);

  if (record.tags.length) {
    const tags = createElement("div", {
      className: "margin-top-1",
      attributes: { "data-news-tags": "true" },
    });
    for (const tag of record.tags) {
      tags.appendChild(
        createElement("span", {
          className: "usa-tag margin-right-05",
          textContent: formatNewsTagLabel(tag),
          attributes: { "data-news-tag": "true" },
        }),
      );
    }
    body.appendChild(tags);
  }

  item.appendChild(body);
  container.appendChild(item);
}

function renderNewsList(container, records) {
  container.innerHTML = "";
  for (const record of records) {
    renderNewsRecord(container, record);
  }
}

function initializeNewsSearch() {
  const root = document.querySelector("#news-search");
  if (!root) {
    return;
  }

  const form = document.querySelector("#news-search-form");
  const clearButton = document.querySelector("#news-search-clear");
  const status = document.querySelector("#news-search-status");
  const listContainer = document.querySelector("#news-results .usa-collection");
  const searchPagination = document.querySelector("#news-search-pagination");
  const fallbackPagination = document.querySelector(
    "#news-fallback-pagination",
  );
  const selects = {
    year: document.querySelector("#news-filter-year"),
    tag: document.querySelector("#news-filter-tag"),
  };

  if (!form || !clearButton || !status || !listContainer || !searchPagination) {
    return;
  }

  const initialParams = new URL(window.location.href).searchParams;
  const initialSelected = {};
  for (const key of Object.keys(selects)) {
    initialSelected[key] = initialParams.get(key) || "";
  }

  let pagefind;
  let allRecords = [];
  let currentRecords = [];
  let currentPage = parsePageNumber(initialParams.get("page"));
  let requestId = 0;

  const selectedFilterValues = function () {
    const selected = activeFilters(selects);
    for (const key of Object.keys(selects)) {
      if (initialSelected[key] && !selected[key]) {
        selected[key] = [initialSelected[key]];
      }
    }
    return selected;
  };

  const hydrateFilters = function () {
    const filters = generateFilterOptionCounts(
      allRecords,
      selectedFilterValues(),
      Object.keys(selects),
      newsFilterValues,
    );
    for (const key of Object.keys(selects)) {
      populateFilterSelect(
        selects[key],
        key,
        filters[key],
        initialSelected[key] || (selects[key] ? selects[key].value : ""),
        NEWS_FILTER_LABELS,
        key === "tag" ? formatNewsTagLabel : null,
      );
      initialSelected[key] = "";
    }
  };

  const hasActiveFilters = function () {
    return Object.keys(activeFilters(selects)).length > 0;
  };

  const syncSearchParams = function () {
    const nextUrl = new URL(window.location.href);
    const filters = activeFilters(selects);

    for (const key of Object.keys(selects)) {
      if (filters[key] && filters[key][0]) {
        nextUrl.searchParams.set(key, filters[key][0]);
      } else {
        nextUrl.searchParams.delete(key);
      }
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

  const renderCurrentPage = function (options) {
    const settings = options || {};
    const total = currentRecords.length;
    const totalPages = Math.max(Math.ceil(total / NEWS_PER_PAGE), 1);
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);

    const startIndex = (currentPage - 1) * NEWS_PER_PAGE;
    const visibleRecords = currentRecords.slice(
      startIndex,
      startIndex + NEWS_PER_PAGE,
    );
    renderNewsList(listContainer, visibleRecords);

    if (total === 0) {
      status.textContent = "No matching press releases found.";
    } else if (hasActiveFilters()) {
      status.textContent =
        totalPages > 1
          ? `Showing ${total} matching press releases. Page ${currentPage} of ${totalPages}.`
          : `Showing ${total} matching press release${total === 1 ? "" : "s"}.`;
    } else {
      status.textContent =
        totalPages > 1
          ? `Showing ${total} press releases. Page ${currentPage} of ${totalPages}.`
          : `Showing ${total} press release${total === 1 ? "" : "s"}.`;
    }

    syncSearchParams();
    renderSearchPagination(
      searchPagination,
      total,
      currentPage,
      NEWS_PER_PAGE,
      function (nextPage) {
        currentPage = nextPage;
        renderCurrentPage({ focusResults: true });
      },
    );

    if (settings.focusResults) {
      focusResultsRegion();
    }
  };

  const runSearch = async function (options) {
    const settings = options || {};
    requestId += 1;
    const thisRequest = requestId;

    if (settings.resetPage) {
      currentPage = 1;
    }

    let searchResult;
    const filters = {
      ...selectedFilterValues(),
      [NEWS_TYPE_FILTER_NAME]: [NEWS_TYPE_FILTER_VALUE],
    };

    try {
      searchResult = await runPagefindSearch(
        pagefind,
        null,
        {
          filters,
          sort: NEWS_SORT,
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

    currentRecords = searchResult.docs.map(normalizeNewsRecord);
    hydrateFilters();
    renderCurrentPage(settings);
  };

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    runSearch({ resetPage: true });
  });
  form.addEventListener("change", function () {
    runSearch({ resetPage: true });
  });
  clearButton.addEventListener("click", function () {
    for (const key of Object.keys(selects)) {
      if (selects[key]) {
        selects[key].value = "";
      }
    }
    runSearch({ resetPage: true });
  });

  (async function () {
    try {
      pagefind = await loadPagefind();
    } catch (error) {
      status.textContent = "Search is temporarily unavailable.";
      return;
    }

    try {
      const allSearch = await runPagefindSearch(
        pagefind,
        null,
        {
          filters: {
            [NEWS_TYPE_FILTER_NAME]: [NEWS_TYPE_FILTER_VALUE],
          },
          sort: NEWS_SORT,
        },
        true,
      );
      allRecords = allSearch.docs.map(normalizeNewsRecord);
    } catch (error) {
      status.textContent = "Search is temporarily unavailable.";
      return;
    }

    if (fallbackPagination) {
      fallbackPagination.classList.add("display-none");
      fallbackPagination.setAttribute("hidden", "");
    }

    await runSearch();
  })();
}

module.exports = {
  initializeNewsSearch,
};

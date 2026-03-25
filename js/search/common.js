const CASES_PER_PAGE = 10;
const CASE_FILTER_LABELS = {
  agency: "All agencies",
  year: "All years",
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
    option.value = value;
    option.textContent = `${value} (${count})`;
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

module.exports = {
  CASES_PER_PAGE,
  CASE_FILTER_LABELS,
  RESOURCE_FILTER_LABELS,
  activeFilters,
  debounce,
  populateFilterSelect,
  responseFilters,
  runPagefindSearch,
};

require('@uswds/uswds');

const DEFAULT_CASES_QUERY = 'DI-';
const CASES_PER_PAGE = 10;
const FILTER_LABELS = {
  agency: 'All agencies',
  year: 'All years',
};

function waitForPagefind() {
  if (window.casePagefind) {
    return Promise.resolve(window.casePagefind);
  }

  return new Promise(function (resolve) {
    window.addEventListener(
      'casePagefindReady',
      function () {
        resolve(window.casePagefind);
      },
      { once: true },
    );
  });
}

function sortFilterEntries(filterName, values) {
  const entries = Object.entries(values || {});
  if (filterName === 'year') {
    return entries.sort(function (a, b) {
      return Number(b[0]) - Number(a[0]);
    });
  }

  return entries.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });
}

function populateFilterSelect(select, filterName, values, selectedValue) {
  select.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = FILTER_LABELS[filterName];
  select.appendChild(defaultOption);

  const options = sortFilterEntries(filterName, values);
  for (const optionEntry of options) {
    const value = (optionEntry[0] || '').trim();
    const count = optionEntry[1];
    if (!value) {
      continue;
    }

    const option = document.createElement('option');
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
    const pathname = parsed.pathname || '/';
    return pathname.endsWith('/') ? pathname : `${pathname}/`;
  } catch (error) {
    return url;
  }
}

function buildCaseTemplateLookup() {
  const bank = document.querySelector('#case-template-bank');
  const map = new Map();
  if (!bank) {
    return map;
  }

  // Reuse server-rendered case cards so JS controls behavior, not presentation.
  const items = bank.querySelectorAll('li');
  for (const item of items) {
    const link = item.querySelector('a.usa-link');
    if (!link || !link.getAttribute('href')) {
      continue;
    }

    map.set(normalizePath(link.getAttribute('href')), item);
  }

  return map;
}

function renderCaseList(container, docs, templateLookup) {
  container.innerHTML = '';

  for (const doc of docs) {
    const template = templateLookup.get(normalizePath(doc.url));
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
    return [1, 2, 3, 4, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
}

function renderSearchPagination(container, totalItems, currentPage, onPageChange) {
  container.innerHTML = '';
  const totalPages = Math.ceil(totalItems / CASES_PER_PAGE);

  if (totalPages <= 1) {
    container.classList.add('display-none');
    return;
  }

  container.classList.remove('display-none');

  const nav = document.createElement('nav');
  nav.className = 'usa-pagination padding-top-2';
  nav.setAttribute('aria-label', 'Pagination');

  const list = document.createElement('ul');
  list.className = 'usa-pagination__list';

  if (currentPage > 1) {
    const prevItem = document.createElement('li');
    prevItem.className = 'usa-pagination__item usa-pagination__arrow';
    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.className = 'usa-pagination__link usa-pagination__previous-page';
    prevLink.setAttribute('aria-label', 'Previous page');
    prevLink.innerHTML = '<span class="usa-pagination__link-text"> Previous </span>';
    prevLink.addEventListener('click', function (event) {
      event.preventDefault();
      onPageChange(currentPage - 1);
    });
    prevItem.appendChild(prevLink);
    list.appendChild(prevItem);
  }

  for (const page of pageSequence(totalPages, currentPage)) {
    if (page === 'ellipsis') {
      const overflowItem = document.createElement('li');
      overflowItem.className = 'usa-pagination__item usa-pagination__overflow';
      overflowItem.setAttribute('role', 'presentation');
      overflowItem.textContent = ' … ';
      list.appendChild(overflowItem);
      continue;
    }

    const pageItem = document.createElement('li');
    pageItem.className = 'usa-pagination__item usa-pagination__page-no';

    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.className = `usa-pagination__button${page === currentPage ? ' usa-current' : ''}`;
    pageLink.setAttribute('aria-label', `Page ${page}`);
    pageLink.textContent = String(page);
    pageLink.addEventListener('click', function (event) {
      event.preventDefault();
      onPageChange(page);
    });

    pageItem.appendChild(pageLink);
    list.appendChild(pageItem);
  }

  if (currentPage < totalPages) {
    const nextItem = document.createElement('li');
    nextItem.className = 'usa-pagination__item usa-pagination__arrow';
    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.className = 'usa-pagination__link usa-pagination__next-page';
    nextLink.setAttribute('aria-label', 'Next page');
    nextLink.innerHTML = '<span class="usa-pagination__link-text"> Next </span>';
    nextLink.addEventListener('click', function (event) {
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
  const root = document.querySelector('#case-search');
  if (!root) {
    return;
  }

  const queryInput = document.querySelector('#case-search-query');
  const form = document.querySelector('#case-search-form');
  const clearButton = document.querySelector('#case-search-clear');
  const status = document.querySelector('#case-search-status');
  const listContainer = document.querySelector('#case-results .usa-card-group, #case-results .usa-collection');
  const pagination = document.querySelector('.usa-pagination');
  const searchPagination = document.querySelector('#case-search-pagination');
  const templateLookup = buildCaseTemplateLookup();
  if (!listContainer || !queryInput || !form || !clearButton || !status) {
    return;
  }

  const selects = {
    agency: document.querySelector('#case-filter-agency'),
    year: document.querySelector('#case-filter-year'),
  };

  let pagefind;
  try {
    pagefind = await waitForPagefind();
    await pagefind.options({ basePath: '/pagefind/' });
  } catch (error) {
    status.textContent = 'Search is temporarily unavailable.';
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
        const bootstrapResponse = await pagefind.search(DEFAULT_CASES_QUERY, {
          sort: { date: 'desc' },
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

  const renderCurrentPage = function () {
    // Client-side pagination over current Pagefind results.
    const total = currentDocs.length;
    const totalPages = Math.max(Math.ceil(total / CASES_PER_PAGE), 1);
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);

    const startIndex = (currentPage - 1) * CASES_PER_PAGE;
    const visibleDocs = currentDocs.slice(startIndex, startIndex + CASES_PER_PAGE);
    renderCaseList(listContainer, visibleDocs, templateLookup);

    if (total === 0) {
      status.textContent = 'No matching cases found.';
    } else if (totalPages > 1) {
      status.textContent = `Showing ${total} matching cases. Page ${currentPage} of ${totalPages}.`;
    } else {
      status.textContent = `Showing ${total} matching cases.`;
    }

    if (searchPagination) {
      renderSearchPagination(searchPagination, total, currentPage, function (nextPage) {
        currentPage = nextPage;
        renderCurrentPage();
      });
    }
  };

  const runSearch = async function () {
    requestId += 1;
    const thisRequest = requestId;

    const query = queryInput.value.trim() || DEFAULT_CASES_QUERY;
    const filters = activeFilters(selects);

    status.textContent = 'Searching...';
    if (pagination) {
      pagination.classList.add('display-none');
    }
    if (searchPagination) {
      searchPagination.classList.add('display-none');
    }

    let response;
    try {
      response = await pagefind.search(query, {
        filters: filters,
        sort: { date: 'desc' },
      });
    } catch (error) {
      if (thisRequest !== requestId) {
        return;
      }
      status.textContent = 'Search is temporarily unavailable.';
      return;
    }

    if (thisRequest !== requestId) {
      return;
    }

    const filterValues = responseFilters(response);
    for (const key of Object.keys(selects)) {
      populateFilterSelect(selects[key], key, filterValues[key], selects[key].value);
    }

    const docs = await Promise.all(
      response.results.map(function (result) {
        return result.data();
      }),
    );

    currentDocs = docs;
    currentPage = 1;
    renderCurrentPage();
  };

  const debouncedSearch = function () {
    window.clearTimeout(debouncedSearch.timer);
    debouncedSearch.timer = window.setTimeout(runSearch, 200);
  };

  queryInput.addEventListener('input', debouncedSearch);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    runSearch();
  });
  form.addEventListener('change', runSearch);
  clearButton.addEventListener('click', function () {
    queryInput.value = '';
    for (const key of Object.keys(selects)) {
      selects[key].value = '';
    }
    runSearch();
  });

  runSearch();
}

document.addEventListener('DOMContentLoaded', function () {
  initializeCaseSearch();
});

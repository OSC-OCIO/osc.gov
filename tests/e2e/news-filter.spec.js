const { test, expect } = require('@playwright/test');

async function waitForNewsSearchReady(page) {
  await expect
    .poll(async function () {
      return page.locator('#news-filter-year option').count();
    })
    .toBeGreaterThan(1);
  await expect
    .poll(async function () {
      return page.locator('#news-filter-tag option').count();
    })
    .toBeGreaterThan(1);
  await expect(page.locator('#news-search-status')).toContainText('Showing');
}

async function optionValues(page, selector) {
  return page.locator(`${selector} option`).evaluateAll(function (options) {
    return options
      .map(function (option) {
        return option.value;
      })
      .filter(Boolean);
  });
}

function isDescendingNumeric(values) {
  for (let idx = 1; idx < values.length; idx += 1) {
    if (Number(values[idx - 1]) < Number(values[idx])) {
      return false;
    }
  }

  return true;
}

function isAlphabetical(values) {
  for (let idx = 1; idx < values.length; idx += 1) {
    if (values[idx - 1].localeCompare(values[idx]) > 0) {
      return false;
    }
  }

  return true;
}

function archiveCutoffIso() {
  const date = new Date();
  const cutoff = new Date(date.getFullYear(), date.getMonth() - 18, 1);
  const lastDayOfMonth = new Date(
    cutoff.getFullYear(),
    cutoff.getMonth() + 1,
    0,
  ).getDate();
  cutoff.setDate(Math.min(date.getDate(), lastDayOfMonth));

  return [
    cutoff.getFullYear(),
    String(cutoff.getMonth() + 1).padStart(2, '0'),
    String(cutoff.getDate()).padStart(2, '0'),
  ].join('-');
}

test('populates year and tag dropdowns in the expected order', async ({
  page,
}) => {
  await page.goto('/news/');
  await waitForNewsSearchReady(page);

  const cutoffIso = archiveCutoffIso();
  const defaultDates = await page
    .locator('[data-news-date]')
    .evaluateAll(function (items) {
      return items.map(function (item) {
        return item.getAttribute('data-news-date');
      });
    });
  expect(defaultDates.every((date) => date >= cutoffIso)).toBe(true);

  await expect(page.locator('#news-filter-year option:checked')).toHaveText(
    /All recent \(\d+\)/,
  );

  const years = await optionValues(page, '#news-filter-year');
  const tags = await optionValues(page, '#news-filter-tag');

  expect(years.length).toBeGreaterThan(1);
  expect(tags.length).toBeGreaterThan(1);
  expect(years.at(-1)).toBe('archived');
  expect(isDescendingNumeric(years.slice(0, -1))).toBe(true);
  expect(isAlphabetical(tags)).toBe(true);
});

test('builds press release excerpts from the content body', async ({ page }) => {
  await page.goto('/news/');
  await waitForNewsSearchReady(page);

  const firstResult = page.locator('[data-news-item]').first();
  const excerpt = await firstResult
    .locator('[data-news-description]')
    .textContent();
  const displayedDate = await firstResult
    .locator('[data-news-date-display]')
    .textContent();

  expect(excerpt.trim().startsWith(displayedDate.trim())).toBe(false);
});

test('filters archived press releases by tag', async ({ page }) => {
  await page.goto('/news/');
  await waitForNewsSearchReady(page);

  const initialYearOptionCount = await page
    .locator('#news-filter-year option')
    .count();
  const recentYear = await page
    .locator('#news-filter-year option:not([value=""]):not([value="archived"])')
    .first()
    .getAttribute('value');
  expect(recentYear).toMatch(/^\d{4}$/);

  await page.locator('#news-filter-year').selectOption('archived');
  await expect(page.locator('#news-search-status')).toContainText(
    'matching press releases',
  );
  await expect(page.locator('#news-filter-year option:checked')).toHaveText(
    /Archived \(\d+\)/,
  );
  await expect(page.locator('#news-filter-year option')).toHaveCount(
    initialYearOptionCount,
  );
  await expect(
    page.locator(`#news-filter-year option[value="${recentYear}"]`),
  ).toContainText(new RegExp(`${recentYear} \\([1-9]\\d*\\)`));
  await expect(
    page.locator(`#news-filter-year option[value="${recentYear}"]`),
  ).not.toBeDisabled();

  await page.locator('#news-filter-tag').selectOption('hatch act');
  await expect(page.locator('#news-search-status')).toContainText(
    'matching press releases',
  );
  await expect(page.locator('#news-filter-tag option:checked')).toHaveText(
    /Hatch Act \(\d+\)/,
  );

  await expect
    .poll(async function () {
      return page.locator('[data-news-item]').count();
    })
    .toBeGreaterThan(0);

  const archiveCutoff = archiveCutoffIso();
  const archiveDates = await page
    .locator('[data-news-date]')
    .evaluateAll(function (items) {
      return items.map(function (item) {
        return item.getAttribute('data-news-date');
      });
    });
  expect(
    archiveDates.every(function (date) {
      return date < archiveCutoff;
    }),
  ).toBe(true);

  const tagSets = await page
    .locator('[data-news-tags]')
    .evaluateAll(function (items) {
      return items.map(function (item) {
        return Array.from(item.querySelectorAll('[data-news-tag]')).map(
          function (tag) {
            return tag.textContent.trim();
          },
        );
      });
    });
  expect(
    tagSets.every(function (tags) {
      return tags.includes('Hatch Act');
    }),
  ).toBe(true);
});

test('preserves archived releases when filtering by the cutoff year', async ({
  page,
}) => {
  const cutoff = archiveCutoffIso();
  const cutoffYear = cutoff.slice(0, 4);
  await page.goto(`/news/?year=${cutoffYear}&page=999`);
  await waitForNewsSearchReady(page);

  await expect(page.locator('#news-filter-year')).toHaveValue(cutoffYear);

  const dates = await page
    .locator('[data-news-date]')
    .evaluateAll(function (items) {
      return items.map(function (item) {
        return item.getAttribute('data-news-date');
      });
    });
  expect(dates.length).toBeGreaterThan(0);
  expect(
    dates.every(function (date) {
      return date.startsWith(cutoffYear);
    }),
  ).toBe(true);
  expect(
    dates.some(function (date) {
      return date < cutoff;
    }),
  ).toBe(true);
});

test('keeps same-filter tag options visible with contextual counts', async ({
  page,
}) => {
  await page.goto('/news/');
  await waitForNewsSearchReady(page);

  const initialTagOptionCount = await page
    .locator('#news-filter-tag option')
    .count();
  await page.locator('#news-filter-tag').selectOption('general');
  await expect(page.locator('#news-search-status')).toContainText(
    'matching press releases',
  );
  await expect(page.locator('#news-filter-tag option:checked')).toHaveText(
    /General \(\d+\)/,
  );
  await expect(page.locator('#news-filter-tag option')).toHaveCount(
    initialTagOptionCount,
  );
  await expect(
    page.locator('#news-filter-tag option[value="disclosure of wrongdoing"]'),
  ).toContainText(/Disclosure of wrongdoing \([1-9]\d*\)/);
  await expect(
    page.locator('#news-filter-tag option[value="disclosure of wrongdoing"]'),
  ).not.toBeDisabled();
});

test('hydrates filters from URL query params', async ({ page }) => {
  await page.goto('/news/?year=archived&tag=hatch%20act');
  await waitForNewsSearchReady(page);

  await expect(page.locator('#news-filter-year')).toHaveValue('archived');
  await expect(page.locator('#news-filter-tag')).toHaveValue('hatch act');
  await expect(
    page.locator('#news-filter-tag option[value="hatch act"]'),
  ).toContainText('Hatch Act');
});

test('clear resets filters and URL state', async ({ page }) => {
  await page.goto('/news/?year=archived&tag=hatch%20act&page=2');
  await waitForNewsSearchReady(page);

  await page.locator('#news-search-clear').click();
  await expect(page.locator('#news-filter-year')).toHaveValue('');
  await expect(page.locator('#news-filter-tag')).toHaveValue('');
  await expect(page.locator('#news-search-status')).toContainText(
    'press releases. Page 1 of',
  );

  const url = new URL(page.url());
  expect(url.searchParams.has('year')).toBe(false);
  expect(url.searchParams.has('tag')).toBe(false);
  expect(url.searchParams.has('page')).toBe(false);
});

test('paginates unfiltered dynamic results with detail page links', async ({
  page,
}) => {
  await page.goto('/news/');
  await waitForNewsSearchReady(page);

  const firstPageTitles = await page
    .locator('[data-news-title]')
    .evaluateAll(function (links) {
      return links.map(function (link) {
        return link.textContent.trim();
      });
    });
  await expect(page.locator('[data-news-item]')).toHaveCount(10);

  const hrefs = await page
    .locator('[data-news-title]')
    .evaluateAll(function (links) {
      return links.map(function (link) {
        return new URL(link.getAttribute('href'), 'http://127.0.0.1:4173')
          .pathname;
      });
    });
  expect(
    hrefs.every(function (href) {
      return /^\/news\/\d{4}-\d{2}-\d{2}\/[^/]+\/$/.test(href);
    }),
  ).toBe(true);

  await page
    .locator('#news-search-pagination')
    .getByRole('link', { name: 'Next page' })
    .click();
  await expect(
    page.locator('#news-search-pagination .usa-pagination__button.usa-current'),
  ).toHaveText('2');
  expect(new URL(page.url()).searchParams.get('page')).toBe('2');

  const secondPageTitles = await page
    .locator('[data-news-title]')
    .evaluateAll(function (links) {
      return links.map(function (link) {
        return link.textContent.trim();
      });
    });
  expect(secondPageTitles).not.toEqual(firstPageTitles);
});

test('press release detail pages do not render the section sidenav', async ({
  page,
}) => {
  await page.goto(
    '/news/2018-02-12/osc-issues-hatch-act-social-media-guidance-in-user-friendly-format-announces-postal-service-employee-hatch-act-violation-over-social-media-use-at-work/',
  );

  await expect(page.locator('#section-nav')).toHaveCount(0);
});

test('old year archive pages point to the filtered news index', async ({
  page,
}) => {
  const response = await page.request.get('/news/2018/');
  const archiveHtml = await response.text();
  expect(archiveHtml).toMatch(
    /<link rel="canonical" href="[^"]*\/news\/\?year=2018">/,
  );
  expect(archiveHtml).toContain(
    '<meta http-equiv="refresh" content="0;url=/news/?year=2018">',
  );

  await page.goto('/news/2018/', { waitUntil: 'domcontentloaded' });
  await expect
    .poll(function () {
      return new URL(page.url()).pathname;
    })
    .toBe('/news/');
  await waitForNewsSearchReady(page);

  expect(new URL(page.url()).searchParams.get('year')).toBe('archived');
  await expect(page.locator('#news-filter-year')).toHaveValue('archived');
});

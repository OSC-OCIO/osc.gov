const { test, expect } = require('@playwright/test');

const EXPECTED_SOCIAL_MEDIA_TITLE = /Social Media Guidance/i;

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

test('populates year and tag dropdowns in the expected order', async ({
  page,
}) => {
  await page.goto('/news/');
  await waitForNewsSearchReady(page);

  await expect(page.locator('#news-filter-year option:checked')).toHaveText(
    /All years \(\d+\)/,
  );

  const years = await optionValues(page, '#news-filter-year');
  const tags = await optionValues(page, '#news-filter-tag');

  expect(years.length).toBeGreaterThan(1);
  expect(tags.length).toBeGreaterThan(1);
  expect(isDescendingNumeric(years)).toBe(true);
  expect(isAlphabetical(tags)).toBe(true);
});

test('filters press releases by year and tag', async ({ page }) => {
  await page.goto('/news/');
  await waitForNewsSearchReady(page);

  const initialYearOptionCount = await page
    .locator('#news-filter-year option')
    .count();
  await page.locator('#news-filter-year').selectOption('2018');
  await expect(page.locator('#news-search-status')).toContainText(
    'Showing 41 matching press releases',
  );
  await expect(page.locator('#news-filter-year option:checked')).toHaveText(
    /2018 \(\d+\)/,
  );
  await expect(page.locator('#news-filter-year option')).toHaveCount(
    initialYearOptionCount,
  );
  await expect(
    page.locator('#news-filter-year option[value="2026"]'),
  ).toContainText(/2026 \([1-9]\d*\)/);
  await expect(
    page.locator('#news-filter-year option[value="2026"]'),
  ).not.toBeDisabled();

  await page.locator('#news-filter-tag').selectOption('hatch act');
  await expect(page.locator('#news-search-status')).toContainText(
    'Showing 8 matching press releases',
  );
  await expect(page.locator('#news-filter-tag option:checked')).toHaveText(
    /Hatch Act \(\d+\)/,
  );

  await expect
    .poll(async function () {
      return page.locator('[data-news-item]').count();
    })
    .toBeGreaterThan(0);

  const years = await page
    .locator('[data-news-date]')
    .evaluateAll(function (items) {
      return items.map(function (item) {
        return item.getAttribute('data-news-date').slice(0, 4);
      });
    });
  expect(new Set(years)).toEqual(new Set(['2018']));

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

  await expect(
    page
      .locator('[data-news-title]')
      .filter({ hasText: EXPECTED_SOCIAL_MEDIA_TITLE }),
  ).toBeVisible();
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
  await page.goto('/news/?year=2018&tag=hatch%20act');
  await waitForNewsSearchReady(page);

  await expect(page.locator('#news-filter-year')).toHaveValue('2018');
  await expect(page.locator('#news-filter-tag')).toHaveValue('hatch act');
  await expect(
    page.locator('#news-filter-tag option[value="hatch act"]'),
  ).toContainText('Hatch Act');
  await expect(
    page
      .locator('[data-news-title]')
      .filter({ hasText: EXPECTED_SOCIAL_MEDIA_TITLE }),
  ).toBeVisible();
});

test('clear resets filters and URL state', async ({ page }) => {
  await page.goto('/news/?year=2018&tag=hatch%20act&page=2');
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
  await page.goto('/news/2018/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);

  if (new URL(page.url()).pathname === '/news/') {
    expect(new URL(page.url()).searchParams.get('year')).toBe('2018');
    await waitForNewsSearchReady(page);
    await expect(page.locator('#news-filter-year')).toHaveValue('2018');
    return;
  }

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/news\/\?year=2018$/,
  );
  await expect(page.locator('meta[http-equiv="refresh"]')).toHaveAttribute(
    'content',
    '0;url=/news/?year=2018',
  );
  await expect(page.locator('#section-nav')).toHaveCount(0);
  await expect(page.locator('ul.usa-collection')).toHaveCount(0);
});

const { test, expect } = require('@playwright/test');
const { CASES_PER_PAGE, loadCaseFixtures } = require('./helpers/case-fixtures');

const fixtures = loadCaseFixtures();

function caseCard(page, caseNumber) {
  return page.locator(`[data-case-card][data-case-number="${caseNumber}"]`).first();
}

function isDescending(dateStrings) {
  for (let idx = 1; idx < dateStrings.length; idx += 1) {
    if (new Date(dateStrings[idx - 1]).getTime() < new Date(dateStrings[idx]).getTime()) {
      return false;
    }
  }

  return true;
}

async function waitForCaseSearchReady(page) {
  await expect.poll(async function () {
    return page.locator('#case-filter-agency option').count();
  }).toBeGreaterThan(1);
  await expect(page.locator('#case-search-status')).not.toContainText('Searching...');
}

test('populates results on initial page load', async ({ page }) => {
  await page.goto('/cases/');
  await waitForCaseSearchReady(page);

  await expect(page.locator('[data-case-card]')).toHaveCount(CASES_PER_PAGE);
  await expect(page.locator('#case-search-status')).toContainText('Showing');
});

test('populates results when using pagination and preserves chronological order', async ({ page }) => {
  await page.goto('/cases/');
  await waitForCaseSearchReady(page);

  const firstPageCaseNumbers = await page.locator('[data-case-card]').evaluateAll(function (cards) {
    return cards.map(function (card) {
      return card.getAttribute('data-case-number');
    });
  });
  expect(firstPageCaseNumbers).toHaveLength(CASES_PER_PAGE);

  const firstPageDates = await page.locator('[data-case-date]').evaluateAll(function (dates) {
    return dates.map(function (item) {
      return item.textContent.trim();
    });
  });
  expect(isDescending(firstPageDates)).toBe(true);

  await page.getByRole('link', { name: 'Next page' }).click();
  await expect(page.locator('.usa-pagination__button.usa-current')).toHaveText('2');

  const secondPageCaseNumbers = await page.locator('[data-case-card]').evaluateAll(function (cards) {
    return cards.map(function (card) {
      return card.getAttribute('data-case-number');
    });
  });
  expect(secondPageCaseNumbers).toHaveLength(CASES_PER_PAGE);
  expect(secondPageCaseNumbers).not.toEqual(firstPageCaseNumbers);

  const secondPageDates = await page.locator('[data-case-date]').evaluateAll(function (dates) {
    return dates.map(function (item) {
      return item.textContent.trim();
    });
  });
  expect(isDescending(secondPageDates)).toBe(true);
});

test('populates results when using keyword search', async ({ page }) => {
  const record = fixtures.richRecord;

  await page.goto('/cases/');
  await waitForCaseSearchReady(page);

  await page.locator('#case-search-query').fill(record.caseNumbers[0]);
  await page.locator('#case-search-query').press('Enter');

  await expect(page.locator('#case-search-status')).toContainText('matching cases');
  await expect(page.locator('[data-case-card]')).toHaveCount(1);
  await expect(caseCard(page, record.caseNumbers[0]).locator('[data-case-title]')).toHaveText(record.title);
});

test('populates results when using dropdown filtering', async ({ page }) => {
  const record = fixtures.filterRecord;

  await page.goto('/cases/');
  await waitForCaseSearchReady(page);

  await page.locator('#case-filter-agency').selectOption(record.agency);
  await page.locator('#case-filter-year').selectOption(record.year);

  await expect(page.locator('#case-search-status')).toContainText('matching cases');
  await expect.poll(async function () {
    return page.locator('[data-case-card]').count();
  }).toBeGreaterThan(0);

  const agencies = await page.locator('[data-case-agency]').evaluateAll(function (items) {
    return items.map(function (item) {
      return item.textContent.trim();
    });
  });
  expect(new Set(agencies)).toEqual(new Set([record.agency]));

  const years = await page.locator('[data-case-date]').evaluateAll(function (items) {
    return items.map(function (item) {
      return item.textContent.trim().slice(-4);
    });
  });
  expect(new Set(years)).toEqual(new Set([record.year]));
});

test('individual case cards render the expected data', async ({ page }) => {
  const record = fixtures.richRecord;
  const cardUrl = `/cases/?case=${encodeURIComponent(record.caseNumbers[0])}&query=${encodeURIComponent(record.caseNumbers[0])}`;

  await page.goto(cardUrl);
  await waitForCaseSearchReady(page);

  const card = caseCard(page, record.caseNumbers[0]);

  await expect(page.locator('[data-case-card]')).toHaveCount(1);
  await expect(card.locator('[data-case-title]')).toHaveText(record.title);
  await expect(card.locator('[data-case-agency]')).toHaveText(record.agency);
  await expect(card.locator('[data-case-location]')).toContainText(record.locations[0]);
  await expect(card.locator('[data-case-date]')).toHaveText(record.dateDisplay);

  const renderedResults = await card.locator('[data-case-result]').evaluateAll(function (items) {
    return items.map(function (item) {
      return item.textContent.trim();
    });
  });
  expect(renderedResults).toEqual(record.results);

  const renderedFiles = await card.locator('[data-case-file-link]').evaluateAll(function (items) {
    return items.map(function (item) {
      return {
        href: new URL(item.getAttribute('href'), 'http://127.0.0.1:4173').pathname,
        label: item.textContent.trim(),
      };
    });
  });
  expect(renderedFiles).toEqual(
    record.files.map(function (file) {
      return {
        href: file.href,
        label: file.label,
      };
    }),
  );
});

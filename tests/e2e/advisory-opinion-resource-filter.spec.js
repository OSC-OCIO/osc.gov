const { test, expect } = require('@playwright/test');

async function waitForResourceFiltersReady(page) {
  await expect.poll(async function () {
    return page.locator('#resource-filter-parent option').count();
  }).toBeGreaterThan(1);

  await expect.poll(async function () {
    return page.locator('#resource-filter-topic option').count();
  }).toBeGreaterThan(1);
}

test('populates category and topic dropdowns with resource values', async ({ page }) => {
  await page.goto('/services/hatch-act/advisoryopinion/');
  await waitForResourceFiltersReady(page);

  const parentOptions = await page.locator('#resource-filter-parent option').evaluateAll(function (options) {
    return options
      .map(function (option) {
        return option.value.trim();
      })
      .filter(Boolean)
      .sort();
  });

  const expectedParents = await page.locator('.resource-item[data-resource-parent]').evaluateAll(function (items) {
    return Array.from(
      new Set(
        items
          .map(function (item) {
            return (item.getAttribute('data-resource-parent') || '').trim();
          })
          .filter(Boolean),
      ),
    ).sort();
  });

  expect(parentOptions).toEqual(expectedParents);

  const topicOptions = await page.locator('#resource-filter-topic option').evaluateAll(function (options) {
    return options
      .map(function (option) {
        return option.value.trim();
      })
      .filter(Boolean)
      .sort();
  });

  const expectedTopics = await page.locator('.resource-item[data-resource-topic]').evaluateAll(function (items) {
    return Array.from(
      new Set(
        items
          .map(function (item) {
            return (item.getAttribute('data-resource-topic') || '').trim();
          })
          .filter(Boolean),
      ),
    ).sort();
  });

  expect(topicOptions).toEqual(expectedTopics);
});

test('shows only resources matching selected category and topic', async ({ page }) => {
  await page.goto('/services/hatch-act/advisoryopinion/');
  await waitForResourceFiltersReady(page);

  const selectedFilters = await page.evaluate(function () {
    const counts = {};
    const items = Array.from(document.querySelectorAll('.resource-item'));

    for (const item of items) {
      const parent = String(item.getAttribute('data-resource-parent') || '').trim();
      const topic = String(item.getAttribute('data-resource-topic') || '').trim();
      if (!parent || !topic) {
        continue;
      }

      const key = `${parent}|||${topic}`;
      counts[key] = (counts[key] || 0) + 1;
    }

    const key = Object.keys(counts).sort(function (a, b) {
      return counts[b] - counts[a];
    })[0];

    const parts = key.split('|||');

    return {
      parent: parts[0],
      topic: parts[1],
      expectedCount: counts[key],
    };
  });

  await page.locator('#resource-filter-parent').selectOption(selectedFilters.parent);
  await page.locator('#resource-filter-topic').selectOption(selectedFilters.topic);

  await expect
    .poll(async function () {
      return page.locator('.resource-item:not(.display-none)').count();
    })
    .toBe(selectedFilters.expectedCount);

  const visibleItems = page.locator('.resource-item:not(.display-none)');

  await expect(visibleItems).toHaveCount(selectedFilters.expectedCount);

  const visibleParents = await visibleItems.evaluateAll(function (items) {
    return Array.from(
      new Set(
        items
          .map(function (item) {
            return (item.getAttribute('data-resource-parent') || '').trim();
          })
          .filter(Boolean),
      ),
    );
  });
  expect(visibleParents).toEqual([selectedFilters.parent]);

  const visibleTopics = await visibleItems.evaluateAll(function (items) {
    return Array.from(
      new Set(
        items
          .map(function (item) {
            return (item.getAttribute('data-resource-topic') || '').trim();
          })
          .filter(Boolean),
      ),
    );
  });
  expect(visibleTopics).toEqual([selectedFilters.topic]);

  await expect(page.locator('#resource-search-status')).toContainText(
    `Showing ${selectedFilters.expectedCount} matching resource`,
  );
});

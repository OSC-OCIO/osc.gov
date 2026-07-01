---
title: Press Releases
layout: layouts/case-index
permalink: "/news{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
eleventyNavigation:
  key: news
  order: 5
  hideChildrenFromTopNav: true
pagination:
  data: collections.press-release
  size: 10
  alias: posts
  reverse: true
---

<section id="news-search" class="margin-y-4">
  <form id="news-search-form" class="usa-form maxw-none">
    <div class="grid-row grid-gap">
      <div class="tablet:grid-col-5">
        <label class="usa-label margin-top-0" for="news-filter-year">Year</label>
        <select class="usa-select" id="news-filter-year" name="year">
          <option value="">All years</option>
        </select>
      </div>
      <div class="tablet:grid-col-5">
        <label class="usa-label margin-top-0" for="news-filter-tag">Tag</label>
        <select class="usa-select" id="news-filter-tag" name="tag">
          <option value="">All tags</option>
        </select>
      </div>
      <div class="tablet:grid-col-2 display-flex flex-align-end">
        <button type="button" class="usa-button usa-button--outline width-full" id="news-search-clear">
          Clear
        </button>
      </div>
    </div>
  </form>
</section>

<p id="news-search-status" class="margin-top-2 text-base-darkest" aria-live="polite"></p>

<section id="news-results">
  <ul class="usa-collection">
    {%- for post in posts -%}
      {%- include 'collection-item.html', post: post -%}
    {%- endfor -%}
  </ul>
</section>
<div id="news-search-pagination" class="display-none"></div>
<div id="news-fallback-pagination">
  {%- include 'pagination-links.html' -%}
</div>

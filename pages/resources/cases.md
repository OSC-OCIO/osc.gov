---
layout: layouts/case-index
title: Public Files
sidenav: false
permalink: "/resources/cases{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
pagination:
  data: collections.case
  size: 10
  alias: posts
  reverse: true
lead: ​OSC receives and reviews [disclosures of wrongdoing](/Services/Pages/DU.aspx) from federal whistleblowers. OSC publishes the reports in cases referred for investigation under 5 U.S.C. 1213(c) in its public file. The redacted reports, whistleblower comments, and letter referring the allegations to the agency are posted in chronological order as they are transmitted to the President. ​
---

<section id="case-search" class="margin-y-4">
  <form id="case-search-form" class="usa-form maxw-none" role="search">
    <div class="grid-row grid-gap">
      <div class="tablet:grid-col-4">
        <label class="usa-label margin-top-0" for="case-search-query">Search public files</label>
        <input
          class="usa-input"
          id="case-search-query"
          name="query"
          placeholder="Case number, agency, keyword..."
          autocomplete="off"
        >
      </div>
      <div class="tablet:grid-col-3">
        <label class="usa-label margin-top-0" for="case-filter-agency">Agency</label>
        <select class="usa-select" id="case-filter-agency" name="agency">
          <option value="">All agencies</option>
        </select>
      </div>
      <div class="tablet:grid-col-3">
        <label class="usa-label margin-top-0" for="case-filter-year">Year</label>
        <select class="usa-select" id="case-filter-year" name="year">
          <option value="">All years</option>
        </select>
      </div>
      <div class="tablet:grid-col-2 display-flex flex-align-end">
        <button type="button" class="usa-button usa-button--outline width-full" id="case-search-clear">
          Clear
        </button>
      </div>
    </div>
  </form>
</section>

<p id="case-search-status" class="margin-top-2 text-base-darkest" aria-live="polite"></p>

<section id="case-results">
  <ul class="usa-card-group">
{%- for post in posts -%}
{%- include 'case-item.html', post: post, pagefind_ignore: true -%}
{%- endfor -%}
  </ul>
</section>
<div id="case-search-pagination" class="display-none"></div>

<section class="display-none" aria-hidden="true">
  <ul id="case-template-bank" class="usa-card-group">
{%- for post in collections.case -%}
{%- include 'case-item.html', post: post, pagefind_ignore: true -%}
{%- endfor -%}
  </ul>
</section>

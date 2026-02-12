---
layout: layouts/post-index
title: Public Files
sidenav: true
permalink: "/resources/cases{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
pagination:
  data: collections.case
  size: 10
  alias: posts
  reverse: true
---

## Whistleblower Cases

​OSC receives and reviews [disclosures of wrongdoing](/Services/Pages/DU.aspx) from federal whistleblowers. OSC publishes the reports in cases referred for investigation under 5 U.S.C. 1213(c) in its public file. The redacted reports, whistleblower comments, and letter referring the allegations to the agency are posted in chronological order as they are transmitted to the President. ​

<p id="case-search-status" class="margin-top-2 text-base-darkest" aria-live="polite"></p>

<section id="case-results">
  <ul class="usa-collection">
{%- for post in posts -%}
{%- include 'case-item.html', post: post, pagefind_ignore: true -%}
{%- endfor -%}
  </ul>
</section>
<div id="case-search-pagination" class="display-none"></div>

<section class="display-none" aria-hidden="true">
  <ul id="case-template-bank" class="usa-collection">
{%- for post in collections.case -%}
{%- include 'case-item.html', post: post, pagefind_ignore: true -%}
{%- endfor -%}
  </ul>
</section>

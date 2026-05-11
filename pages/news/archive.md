---
layout: layouts/default
pagination:
  data: collections.postsByYear
  size: 1
  alias: year
  addAllPagesToCollections: true
eleventyComputed:
  title: "Press Releases: {{ year[0] }}"
  permalink: "news/{{ year[0] | slug }}/"
  eleventyNavigation:
    key: news-{{year[0]}}
    parent: news
    title: "{{ year[0] }}"
---

<ul class="usa-collection">
  {%- for post in year[1] | reverse -%}
    {%- include 'collection-item.html', post: post -%}
  {%- endfor -%}
</ul>

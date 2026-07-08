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
    key: news-{{ year[0] }}
    parent: news
    title: "{{ year[0] }}"
  canonical_url: "/news/?year={{ year[0] }}"
  meta_refresh: "0;url=/news/?year={{ year[0] }}"
  robots: "noindex"
---

<p>
  Press releases from {{ year[0] }} are available on the
  <a href="/news/?year={{ year[0] }}">Press Releases index</a>.
</p>

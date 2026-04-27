---
title: Press Releases
layout: layouts/post-index
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

{%- for post in posts -%}
{%- include 'collection-item.html', post: post -%}
{%- endfor -%}

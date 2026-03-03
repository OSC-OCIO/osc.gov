---
title: Press Releases
layout: layouts/post-index
permalink: "/PressReleases{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
eleventyNavigation:
  key: press-release
  parent: news
  title: Press Releases
  order: 5
  hideChildrenFromTopNav: true
pagination:
  data: collections.press-release
  size: 10
  alias: posts
  reverse: true
cms: false
---

{%- for post in posts -%}
{%- include 'collection-item.html', post: post -%}
{%- endfor -%}

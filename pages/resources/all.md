---
title: All Resources
layout: layouts/resource-index
permalink: "/resources/all{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
pagination:
  data: resources
  size: 50
  alias: paged_resources
eleventyNavigation:
  order: 0
---

---
title: Search results
layout: layouts/search
eleventyNavigation: false
sidenav: false
---

{% if site.searchgov %}

  <ol id="search-results"></ol>
{% else %}
  <script>
    window.location = "/";
  </script>
{% endif %}

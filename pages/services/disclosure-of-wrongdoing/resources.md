---
title: Additional Resources for Disclosure of Wrongdoing
layout: layouts/resource-index
eleventyNavigation:
  order: 7
  title: Additional resources
reports:
  - heading: "DU Posters, Handouts, & Training Materials"
    items:
      - name: "Agency Monitoring Policies and Whistleblower Disclosures, February 1, 2018"
        url: "/~assets/docs/agency-monitoring-policies-and-whistleblower-disclosures-february-1-2018.pdf"
      - name: "OSC Monetary Policy re Whistleblowers 5.20.25"
        url: "/~assets/docs/osc-monetary-policy-re-whistleblowers-52025.pdf"
      - name: "1213(c) Appendix May 2025"
        url: "/~assets/docs/1213c-appendix-may-2025.pdf"
  - heading: "Other Disclosure of Wrongdoing Resources"
    items:
      - name: "Agency Monitoring Policies and Whistleblower Disclosures, February 1, 2018"
        url: "/~assets/docs/agency-monitoring-policies-and-whistleblower-disclosures-february-1-2018.pdf"
      - name: "OSC Monetary Policy re Whistleblowers 5.20.25"
        url: "/~assets/docs/osc-monetary-policy-re-whistleblowers-52025.pdf"
      - name: "1213(c) Appendix May 2025"
        url: "/~assets/docs/1213c-appendix-may-2025.pdf"
---

<div class="video-grid">
<div>{% youtube "https://www.youtube.com/watch?v=TMQE21TMFFU" %}</div>
</div>

<ul class="usa-list margin-top-2">
  {%- for section in reports -%}
    <li>
      <a href="#{{- section.heading | slugify -}}">{{- section.heading -}}</a>
    </li>
  {%- endfor -%}
</ul>

{%- for section in reports -%}

  <h2 id="{{- section.heading | slugify -}}">{{- section.heading -}}</h2>
  <ul class="usa-icon-list">
    {%- for item in section.items -%}
      {%- include 'resource-item.html' -%}
    {%- endfor -%}
  </ul>
{%- endfor -%}

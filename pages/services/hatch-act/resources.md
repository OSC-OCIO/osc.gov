---
title: Additional Resources for Hatch Act
layout: layouts/resource-index
eleventyNavigation:
  order: 9
reports:
  - heading: "Hatch Act Reports"
    items:
      - name: "Report of Prohibited Political Activity, Carlos Del Toro (HA-24-000104)"
        url: "/~assets/docs/report-of-prohibited-political-activity-carlos-del-toro-ha-24-000104.pdf"
      - name: "Report of Prohibited Political Activity, Rachael Rollins (HA-22-000173)"
        url: "/~assets/docs/report-of-prohibited-political-activity-rachael-rollins-ha-22-000173.pdf"
      - name: "Report of Prohibited Political Activity, Xavier Becerra (HA-22-000223)"
        url: "/~assets/docs/report-of-prohibited-political-activity-xavier-becerra-ha-22-000223.pdf"
      - name: "Investigation of Political Activities by Senior Trump Administration Officials During the 2020 Presidential Election"
        url: "/~assets/docs/investigation-of-political-activities-by-senior-trump-administratio-136ab295.pdf"
      - name: "Report of Prohibited Political Activity, Carla Sands, HA-20-000091"
        url: "/~assets/docs/report-of-prohibited-political-activity-carla-sands-ha-20-000091.pdf"
      - name: "Report of Prohibited Political Activity, Dr. Peter Navarro (HA-20-000279)"
        url: "/~assets/docs/report-of-prohibited-political-activity-dr-peter-navarro-ha-20-000279.pdf"
      - name: "Report of Prohibited Political Activity, Kellyanne Conway (HA-19-0631 & HA-19-3395)"
        url: "/~assets/docs/report-of-prohibited-political-activity-kellyanne-conway-ha-19-06-a8748ac5.pdf"
      - name: "Report of Prohibited Political Activity, Kellyanne Conway (HA-18-0966)"
        url: "/~assets/docs/report-of-prohibited-political-activity-kellyanne-conway-ha-18-0966.pdf"
      - name: "Report of Prohibited Political Activity, Facilitating Labor Union's Political Activity Through Use of Union Official Leave Without Pay (HA-17-0610)"
        url: "/~assets/docs/report-of-prohibited-political-activity-facilitating-labor-unions-6535f18d.pdf"
      - name: "Report of Prohibited Political Activity, Julián Castro (HA-16-3113)"
        url: "/~assets/docs/report-of-prohibited-political-activity-julian-castro-ha-16-3113.pdf"
      - name: "Response, Julián Castro (HA-16-3113)"
        url: "/~assets/docs/response-julian-castro-ha-16-3113.pdf"
      - name: "Report of Prohibited Political Activity, Kathleen Sebelius (HA-12-1989)"
        url: "/~assets/docs/report-of-prohibited-political-activity-kathleen-sebelius-ha-12-1989.pdf"
      - name: "Response, Kathleen Sebelius (HA-12-1989)"
        url: "/~assets/docs/response-kathleen-sebelius-ha-12-1989.pdf"
  - heading: "Hatch Act Posters, Handouts, and Training Materials"
    items:
      - name: "The Hatch Act and Further Restricted Employees Poster"
        url: "/~assets/docs/the-hatch-act-and-further-restricted-employees-poster.pdf"
      - name: "The Hatch Act and State, D.C., and Local Employees Poster"
        url: "/~assets/docs/the-hatch-act-and-state-dc-and-local-employees-poster.pdf"
      - name: "Hatch Act Agencies and Social Media FAQs"
        url: "/~assets/docs/hatch-act-agencies-and-social-media-faqs.pdf"
      - name: "Hatch Act social media handout"
        url: "/~assets/docs/hatch-act-social-media-handout.pdf"
      - name: "Social Media Quick Guide"
        url: "/~assets/docs/social-media-quick-guide.pdf"
      - name: "A Guide to the Hatch Act for Federal Employees"
        url: "/~assets/docs/a-guide-to-the-hatch-act-for-federal-employees.pdf"
      - name: "Hatch Act Social Media Handout"
        url: "/~assets/docs/hatch-act-social-media-handout-1.pdf"
      - name: "The Hatch Act and Most Federal Employees Poster"
        url: "/~assets/docs/the-hatch-act-and-most-federal-employees-poster.pdf"
---
<h2 class="font-heading-xl padding-top-1">Hatch Act Videos</h2>

<div class="video-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem;">
  <div>{% youtube "https://www.youtube.com/watch?v=S0nMe1fGwNg&t=1s" %}</div>
  <div>{% youtube "https://www.youtube.com/watch?v=0Czxhg6xYkM&t=1s" %}</div>
  <div>{% youtube "https://www.youtube.com/watch?v=89WXjhMixpM" %}</div>
  <div>{% youtube "https://www.youtube.com/watch?v=hYOeYXnfV4o" %}</div>
  <div>{% youtube "https://www.youtube.com/watch?v=JdozmUcbK6E" %}</div>
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

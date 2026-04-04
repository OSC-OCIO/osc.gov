---
title: All FAQs
eleventyNavigation:
  order: 1
items:
  - links:
      - name: Prohibited Personnel Practices FAQs
        url: /services/prohibited-personnel-practices/faq
        icon: help
      - name: Disclosure of Wrongdoing FAQs
        url: /services/disclosure-of-wrongdoing/faq
        icon: help
      - name: Hatch Act FAQs
        url: /services/hatch-act/faq
        icon: help
      - name: USERRA FAQs
        url: /services/userra/faq
        icon: help
      - name: Alternative Dispute Resolution FAQs
        url: /services/alternative-dispute-resolution/faq
        icon: help
      - name: Outreach, Training, & Certification FAQs
        url: /services/outreach/faq
        icon: help
---

<ul class="usa-icon-list">
  {%- for section in items -%}
    {%- assign section_links = section.links | default: section.items -%}
    {%- if section_links and section_links.size > 0 -%}
      {%- for item in section_links -%}
        {%- include 'resource-item.html' -%}
      {%- endfor -%}
    {%- elsif section.name and section.url -%}
      {%- include 'resource-item.html', item: section -%}
    {%- endif -%}
  {%- endfor -%}
</ul>

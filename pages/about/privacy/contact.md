---
title: Contact Us About Privacy
eleventyNavigation:
  order: 7
units:
  - name: Mahala Dar
    contacts:
      - phone1: (202) 804-7000
      - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
  - name: Ammar Ahmad
    contacts:
      - phone1: (202) 804-7000
      - address: 1730 M Street, N.W., Suite 218, Washington, D.C,, 20036-4505
---

The Office of the Clerk implements the agency's privacy program. The Clerk is the Senior Agency Official for Privacy (SAOP). The Clerk's contact information:

<ul class="usa-card-group padding-top-4">
  {%- for unit in units -%}  
  {%- include 'contactcard.html' -%}
  {%- endfor -%}
</ul>

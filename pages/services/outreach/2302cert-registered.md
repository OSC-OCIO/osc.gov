---
cms_editable: true
title: 2302(c) Registered Agencies
eleventyNavigation:
  order: 5
  title: 2302(c) Registered Agencies List
layout: layouts/default
body_text: >-
  The following agencies have registered for the 2302(c) Certification Program:
agencies:
  - name: "AmeriCorps OIG"
    registration_date: April 2025
  - name: "Department of Justice, Foreign Claims Settlement Commission"
    registration_date: September 2026
  - name: "Department of Justice, National Security Division"
    registration_date: September 2026
  - name: "Department of Justice, Office of Community Oriented Policing Services"
    registration_date: September 2026
  - name: "Department of Justice, Office of Legal Counsel"
    registration_date: September 2026
  - name: "Department of Justice, Office of Legal Policy"
    registration_date: September 2026
  - name: "Department of Justice, Office of the Associate Attorney General"
    registration_date: September 2026
  - name: "Department of Justice, Office of the Attorney General"
    registration_date: September 2026
  - name: "Department of Justice, Office of the Pardon Attorney"
    registration_date: September 2026
  - name: "Department of Justice, Office of the Solicitor"
    registration_date: September 2026
  - name: "Department of Justice, Office of Violence Against Women"
    registration_date: September 2026
  - name: "Department of Justice, Professional Responsibility Advisory Office"
    registration_date: September 2026
  - name: "Department of Justice, U.S. Trustee Program"
    registration_date: September 2026
  - name: "Department of Transportation, Office of the Secretary"
    registration_date: February 2024
  - name: "Election Assistance Commission, OIG"
    registration_date: May 2026
  - name: "General Services Administration, OIG"
    registration_date: April 2025
  - name: "Housing and Urban Development, OIG"
    registration_date: August 2026
  - name: "National Council on Disability"
    registration_date: January 2026
  - name: "Securities and Exchange Commission"
    registration_date: August 2025
---
{{ body_text | markdownify }}

<div class="usa-table-container--scroll" tabindex="0" role="region" aria-label="Registered agencies">
<table class="usa-table width-full">
    <caption class="usa-sr-only">2302(c) registered agencies and registration dates</caption>
    <thead class="border-bottom-1px">
      <tr class="border-bottom-1px">
        <th scope="col" class="border-bottom-1px">Agency</th>
        <th scope="col" class="border-bottom-1px">Registration Date</th>
      </tr>
    </thead>
    <tbody>
      {% for agency in agencies %}
        <tr>
          <td>{{ agency.name | escape }}</td>
          <td>{{ agency.registration_date | escape }}</td>
        </tr>
      {% endfor %}
    </tbody>
</table>
</div>

---
title: OSC Services Overview
eleventyNavigation:
  order: 0
pages:
  - name: Prohibited Personnel Practices
    url: /services/prohibited-personnel-practices/overview
    icon: verified_user
    icon_bg_class: bg-primary-light
    description: Protecting federal employees from improper personnel actions, including retaliation for whistleblowing
  - name: Disclosure of Wrongdoing
    url: /services/disclosure-of-wrongdoing/overview
    icon: campaign
    icon_bg_class: bg-secondary
    description: Providing a safe channel for federal employees to disclose wrongdoing
  - name: Hatch Act
    url: /services/hatch-act/overview
    icon: flag
    icon_bg_class: bg-accent-cool-light
    description: Protecting integrity of federal government and certain state and local agencies from prohibited political activity
  - name: USERRA
    url: /services/userra/overview
    icon: military_tech
    icon_bg_class: bg-primary
    description: Protecting the employment and reemployment rights of veterans, guardsmen, and reservists
  - name: Alternative Dispute Resolution
    url: /services/alternative-dispute-resolution/overview
    icon: forum
    icon_bg_class: bg-secondary-dark
    description: Offering mediation to complainants and agencies in selected cases
  - name: Outreach, Training, & Certification
    url: /services/outreach/overview
    icon: school
    icon_bg_class: bg-accent-cool
    description: Offering speakers, educational materials and trainings to agencies
---

The U.S. Office of Special Counsel (OSC) is an independent federal investigative and prosecutorial agency. Our basic authorities come from four federal statutes: the Civil Service Reform Act, the Whistleblower Protection Act, the Hatch Act, and the Uniformed Services Employment & Reemployment Rights Act (USERRA).

<ul class="usa-card-group">
  {%- for page in pages -%}
    <li class="usa-card usa-card--flag width-full">
      <a
        href="{{- page.url -}}"
        class="usa-card__container border-white bg-base-lightest hover:bg-base-lighter display-block text-no-underline"
        aria-label="Go to {{ page.name }}"
      >
        <div class="usa-card__header">
          <h4 class="usa-card__heading display-flex flex-align-center">{%- uswds_icon page.icon "margin-right-1 tablet:display-none" -%}{{- page.name -}}</h4>
        </div>
        <div class="usa-card__media display-none tablet:display-block">
         <div class="usa-card__img {{ page.icon_bg_class -}}">
          <span
            class="display-flex flex-align-center flex-justify-center radius-pill width-15 height-15"
            aria-hidden="true"
          >
            {%- uswds_icon page.icon "text-white width-6 height-6" -%}
          </span>
        </div>
         </div>
        <div class="usa-card__body">
          <p class="font-body-xs">{{- page.description -}}</p>
        </div>
      </a>
    </li>
  {%- endfor -%}
</ul>

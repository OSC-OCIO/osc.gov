---
title: OSC Services Overview
eleventyNavigation:
  order: 0
pages:
  - title: Prohibited Personnel Practices
    url:
    image: /img/PPP.png
    description: Protecting federal employees from improper personnel actions, including retaliation for whistleblowing
  - title: Disclosure of Wrongdoing
    url:
    image: /img/DOW.png
    description: Providing a safe channel for federal employees to disclose wrongdoing
  - title: Hatch Act
    url:
    image: /img/HA.png
    description: Protecting integrity of federal government and certain state and local agencies from prohibited political activity
  - title: USERRA
    url:
    image: /img/USERRA.png
    description: Protecting the employment and reemployment rights of veterans, guardsmen, and reservists
  - title: Alternative Dispute Resolution
    url:
    image: /img/ADR.png
    description: Offering mediation to complainants and agencies in selected cases
  - title: Outreach, Training, & Certification
    url:
    image: /img/OTC.png
    description: Offering speakers, educational materials and trainings to agencies

---

​The U.S. Office of Special Counsel (OSC) is an independent federal investigative and prosecutorial agency. Our basic authorities come from four federal statutes: the Civil Service Reform Act, the Whistleblower Protection Act, the Hatch Act, and the Uniformed Services Employment & Reemployment Rights Act (USERRA).​​​​


<ul class="usa-card-group padding-top-4">
  {%- for page in pages -%}
  <li class="usa-card usa-card--flag">
    <div class="usa-card__container border-white bg-base-lightest">
      <div class="usa-card__header">
        <h4 class="usa-card__heading">{{- page.title -}}</h4>
      </div>
      <div class="usa-card__media">
        <div class="usa-card__img">
          <img
            src="{{- page.image -}}"
            alt="A placeholder image"
          />
        </div>
      </div>
      <div class="usa-card__body">
        <p>{{- page.description -}}</p>
      </div>
    </div>
  </li>
  {%- endfor -%}
</ul>
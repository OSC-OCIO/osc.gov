---
cms_editable: true
permalink: /
layout: layouts/wide
title: Home
eleventyNavigation:
  key: /
  title: Home
  order: 0
hero:
  header: Welcome to OSC.gov
  body: The U.S. Office of Special Counsel (OSC) safeguards the merit system in
    federal employment by protecting whistleblowers, enforcing the Hatch Act,
    and providing secure channels for disclosures of wrongdoing.
  button_left:
    text: File a Complaint
    link: /file-complaint
  button_right:
    text: Explore Services
    link: /services/services/
  hero_image:
    image: /img/osc-logo.svg
    alt_text: Seal of the U.S. Office of Special Counsel
highlights:
  - title: Protecting Whistleblowers
    alt: American flag
    image: /img/whistleblower.jpg
    body: Learn what protections are available when federal employees disclose
      wrongdoing, safety hazards, or abuse of authority.
    cta_text: Explore Whistleblower Protections
    cta_url: /services/disclosure-of-wrongdoing/overview/
  - title: Hatch Act Guidance
    alt: Gavel
    image: /img/hatchact.jpg
    body: Review practical Hatch Act rules, guidance, and recent enforcement
      resources for federal employees and agencies.
    cta_text: Read Hatch Act Resources
    cta_url: /services/hatch-act/overview/
  - title: Agency Certification and Training
    alt: Person using laptop
    image: /img/training.jpg
    body:
      Find outreach tools, training options, and 2302(c) certification resources
      to help agencies strengthen compliance.
    cta_text: View Outreach Services
    cta_url: /services/outreach/overview/
video:
  header: Featured Video
  title: Introduction to Prohibited Personnel Practices
  body: Learn about common prohibited personnel practices and how OSC helps
    protect federal employees and applicants.
  url: "https://www.youtube.com/watch?v=-zibQh-A4KY"
  button_text: View More Videos
  button_url: "https://www.youtube.com/channel/UCx5trnGvaEc-tuytqNwafpA"
---

<section class="hero bg-primary-darker text-white">
  <div class="grid-container padding-y-8">
    <div class="grid-row grid-gap-lg flex-align-center">
      <div class="tablet:grid-col-8 desktop:grid-col-7">
        <h1 class="font-sans-xl margin-top-0 margin-bottom-2">{{ hero.header }}</h1>
        <p class="font-sans-md line-height-sans-5 margin-top-0 margin-bottom-4 maxw-tablet">
          {{ hero.body }}
        </p>
        <ul class="usa-button-group margin-top-0 margin-bottom-2">
          <li class="usa-button-group__item">
            <a class="usa-button usa-button--accent-cool" href="{{ hero.button_left.link }}">
              <span class="margin-right-1px">{% uswds_icon "report" "usa-icon--size-3" %}</span>
              <span>{{ hero.button_left.text }}</span>
            </a>
          </li>
          <li class="usa-button-group__item">
            <a class="usa-button usa-button--outline usa-button--inverse outline-white" href="{{ hero.button_right.link }}"
              >{{ hero.button_right.text }}</a
            >
          </li>
        </ul>
      </div>
      <div class="display-none tablet:display-block tablet:grid-col-4 desktop:grid-col-5">
        <div class="border border-base radius-lg padding-4 bg-primary shadow-3">
          <img
            class="display-block margin-x-auto"
            src="{{ hero.hero_image.image }}"
            eleventy:ignore
            alt="{{ hero.hero_image.alt_text }}"
            width="220"
            height="220"
          >
        </div>
      </div>
    </div>
  </div>
</section>
<section class="usa-section bg-base-lightest border-top border-base-lighter">
  <div class="grid-container">
    <div class="grid-row grid-gap-lg">
      <div class="tablet:grid-col-8">
        {%- assign featured_card = highlights[0] -%}
        {%- assign remaining_cards = highlights | slice: 1, highlights.size -%}

        {%- if featured_card -%}
          {%- assign card_image = featured_card.image | default: '/img/home-card-default.png' -%}
          {%- assign card_alt = featured_card.alt
            | default: featured_card.title
            | default: 'U.S. Office of Special Counsel visual'
          -%}
          <h2 class="font-heading-lg margin-top-0">Agency Highlights</h2>
          <ul class="usa-card-group margin-bottom-1">
            <li class="tablet:grid-col-12 usa-card">
              <div class="usa-card__container shadow-2 border-base-lighter">
                <div class="usa-card__media">
                  <div class="usa-card__img height-mobile">
                    <img src="{{ card_image }}" alt="{{ card_alt }}" loading="lazy" decoding="async">
                  </div>
                </div>
                <div class="usa-card__header">
                  <h3 class="usa-card__heading">{{ featured_card.title }}</h3>
                </div>
                <div class="usa-card__body">
                  <p class="margin-top-0">{{ featured_card.body }}</p>
                </div>
                <div class="usa-card__footer">
                  <a class="usa-button usa-button--outline" href="{{ featured_card.cta_url }}">
                    {{- featured_card.cta_text -}}
                  </a>
                </div>
              </div>
            </li>
          </ul>
        {%- endif -%}

        {%- if remaining_cards and remaining_cards.size > 0 -%}
          <ul class="usa-card-group">
            {%- for card in remaining_cards -%}
              {%- assign card_image = card.image | default: '/img/home-card-default.png' -%}
              {%- assign card_alt = card.alt
                | default: card.title
                | default: 'U.S. Office of Special Counsel visual'
              -%}
              <li class="tablet:grid-col-6 usa-card">
                <div class="usa-card__container shadow-2 border-base-lighter">
                  <div class="usa-card__media">
                    <div class="usa-card__img height-card">
                      <img src="{{ card_image }}" alt="{{ card_alt }}" loading="lazy" decoding="async">
                    </div>
                  </div>
                  <div class="usa-card__header">
                    <h3 class="usa-card__heading">{{ card.title }}</h3>
                  </div>
                  <div class="usa-card__body">
                    <p class="margin-top-0">{{ card.body }}</p>
                  </div>
                  <div class="usa-card__footer">
                    <a class="usa-button usa-button--outline" href="{{ card.cta_url }}">{{ card.cta_text }}</a>
                  </div>
                </div>
              </li>
            {%- endfor -%}
          </ul>
        {%- endif -%}
      </div>
      <div class="tablet:grid-col-4">
        <h2 class="font-heading-lg margin-y-0">Recent Press Releases</h2>
        {%- assign recent_press_releases = collections.all
          | where_exp: 'item', "item.inputPath contains 'collections/press-release/'"
          | sort: 'date'
          | reverse
          | slice: 0, 8
        -%}
        <ul class="usa-collection">
          {%- for post in recent_press_releases -%}
            <li class="usa-collection__item">
              <div class="usa-collection__body">
                <h3 class="usa-collection__heading margin-top-0">
                  <a class="usa-link" href="{{ post.url }}">{{ post.data.title }}</a>
                </h3>
                <ul class="usa-collection__meta" aria-label="Metadata">
                  <li class="usa-collection__meta-item">
                    {%- uswds_icon "calendar_today" "position-relative bottom-neg-2px margin-right-05" -%}
                    <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: '%B %d, %Y' }}</time>
                  </li>
                </ul>
              </div>
            </li>
          {%- endfor -%}
          <a class="usa-button usa-button--outline" href="/news/">View More News</a>
        </ul>
      </div>
    </div>

  </div>
</section>
<section class="usa-section">
  <div class="grid-container">
    <div class="grid-row grid-gap-lg flex-align-center">
      <div class="tablet:grid-col-5">
        <h2 class="font-heading-lg margin-top-0 margin-bottom-2">{{ video.header }}</h2>
        <p class="margin-top-0 margin-bottom-2 text-bold">{{ video.title }}</p>
        <p class="margin-top-0 margin-bottom-3">
          {{ video.body }}
        </p>
        <a class="usa-button usa-button--outline" href="{{ video.button_url }}"
          >{{ video.button_text }}</a
        >
      </div>
      <div class="tablet:grid-col-7">
        {% youtube video.url video.title %}
      </div>
    </div>
  </div>
</section>

# 11ty-uswds-template

## Why this project

This is an [11ty](https://www.11ty.dev/) static site generator (SSG) template using [U.S. Web Design System v 3.0 (USWDS)](https://designsystem.digital.gov/) and is focused on providing developers a starter template and reference implementation for Federalist/Cloud.gov Pages websites.

This project strives to be compliant with requirements set by [21st Century IDEA Act](https://www.meritalk.com/articles/senate-passes-idea-act/). The standards require that a website or digital service:

- is accessible to individuals with disabilities;
- has a consistent appearance;
- does not duplicate any legacy websites (the legislation also requires agencies to ensure that legacy websites are regularly reviewed, removed, and consolidated);
- has a search function;
- uses an industry standard secure connection;
- “is designed around user needs with data-driven analysis influencing management and development decisions, using qualitative and quantitative data to determine user goals, needs, and behaviors, and continually test the website, web-based form, web-based application, or digital service to ensure that user needs are addressed;”
- allows for user customization; and
- is mobile-friendly.

## Key Functionality

This repository contains the following examples and functionality:

✅ Publish blog posts, press releases, announcements, etc. To modify this code, check out `blog/index.html`, which manages how the posts are listed. You should then check out `_includes/layouts/post.html` to see how individual posts are structured.

✅ Publish single one-off pages. Instead of creating lots of folders throughout the root directory, you should put single pages in `pages` folder and change the `permalink` at the top of each page. Use sub-folders only when you really need to.

✅ There are two different kinds of `pages`, one does not have a side bar navigation, and the other uses `_includes/sidenav.html`. You can enable this option by adding `sidenav: true` to your page front matter.

```
---
title: Document with Sidenav
layout: layout/page
sidenav: true
permalink: /document-with-sidenav
---
```

✅ [Search.gov](https://search.gov) integration - Once you have registered and configured Search.gov for your site by following [these instructions](https://federalist.18f.gov/documentation/search/), add your "affiliate" and "access key" to `_data/site.yml`. Ex.

```
searchgov:

  # You should not change this.
  endpoint: https://search.usa.gov

  # replace this with your search.gov account
  affiliate: federalist-uswds-example

  # replace with your access key
  access_key: xX1gtb2RcnLbIYkHAcB6IaTRr4ZfN-p16ofcyUebeko=

  # this renders the results within the page instead of sending to user to search.gov
  inline: true
```

The logic for using Search.gov can be found in `_includes/searchgov/form.html` and supports displaying the results inline or sending the user to Search.gov the view the results. This setting defaults to "inline" but can be changed by setting

```
searchgov:
  inline: false
```

in `_data/site.yml`.

✅ [Digital Analytics Program (DAP)](https://digital.gov/services/dap/) integration - Once you have registered your site with DAP add your "agency" and optionally, `subagency` to `_data/site.yml` and uncomment the appropriate lines. Ex.

```
dap:
  # agency: your-agency

  # Optional
  # subagency: your-subagency
```

✅ [Google Analytics](https://analytics.google.com/analytics/web/) integration - If you have a Google Analytics account to use, add your "ua" to `_data/site.yml` and uncomment the appropriate lines. Ex.

```
ga:
  # ua: your-ua
```

## Getting Started

### Installing Dependencies

`npm install`

TODO

### Running a Dev Instance

`npm run dev`

TODO

## Sveltia CMS trial

This branch loads [Sveltia CMS](https://sveltiacms.app/) at `/admin/` using its
hosted JavaScript bundle. Collections and fields remain in
[`admin/config.yml`](./admin/config.yml). The shared Eleventy preset still depends
on Decap CMS, but the admin page no longer loads or initializes it. The local
`js/cms/` modules adapt the shared preset’s USWDS Card Group and Summary Box components for Sveltia
and retain its paired-shortcode content format. Try it in **Pages → cms-test**.

### Running locally

1. Run `npm run dev`.
2. Open `/admin/` on the localhost URL printed by the dev server in Chrome or Edge.
3. Choose **Work with Local Repository**, select this repository's root folder
   (`osc.gov`, not `_site`), and allow file access when prompted.
4. Edit and save content, then preview it on the local site. Review changes with
   `git diff` and commit them when ready.

Keep the page you’re editing open in a second tab on the same localhost port
as the dev server (for example, `/cms-test/`). Local saves trigger an Eleventy
rebuild and a full-page refresh. The watcher polls for completed file saves to
handle browser-based folder writes reliably. Restart `npm run dev` after changing
the Eleventy configuration. GitHub-backed saves do not update the local checkout.

No CMS proxy server, GitHub login, or configuration changes are required for
local editing. Saves write directly to your local files. Safari and Firefox do
not support Sveltia's local folder workflow. See the
[local workflow documentation](https://sveltiacms.app/en/docs/workflows/local).

### Remote editing

The GitHub backend targets `OSC-OCIO/osc.gov` on **`sveltia-demo`** for this trial
and retains the existing cloud.gov Pages OAuth endpoint. Push this branch before
trying remote editing. Remote saves target the configured branch, regardless of
which deployed preview you open. Change `backend.branch` deliberately if the
trial moves to another branch.

The existing `editorial_workflow` setting is retained. Verify cloud.gov sign-in
and draft/publish behavior in a deployed preview before relying on remote editing;
these require an authenticated browser session and are not checked by the build.

## How To

### Adding Collections

TODO

### Adding Static Data

TODO

### Creating links

For preview links generated on the platform, we automatically set the `pathPrefix` in the [`.eleventy.js`](/.eleventy.js) file base on the `BASEURL` environment variable. We use the built-in 11ty filter for `url` to properly append the prefix path for the linked page. When adding new links, use the following syntax:

```liquid
<a href="/myDir/">Link to My Dir</a>
```

See the [11ty docs](https://www.11ty.dev/docs/filters/url/)

### Referencing USWDS Sprite Icons

USWDS has sprite icons available for use. Here is the [list of icons](https://designsystem.digital.gov/components/icon/) available when using the sprite shortcode `uswds_icon` in the template. The following example is how you can reference the icon in a template.

```
{% uswds_icon "<USWDS sprite name>" %}
```

### Expanding SCSS Styles

CSS and SASS can be added or imported into the `styles/styles.scss`. You can also use [USWDS Design Tokens](https://designsystem.digital.gov/design-tokens/) in the `styles/themes` files to update colors, fonts, and layout to fit your site's branding. This template uses [esbuild](https://esbuild.github.io/)and [autoprefixer](https://github.com/postcss/autoprefixer) to bundle your SASS/CSS and fingerprint the files in the site build.

### Adding custom Javascript

Site Javascript can be added or imported in `js/app.js`. Sveltia CMS is loaded directly by `admin/index.html`; `js/admin.js` registers Sveltia editor components and initializes the CMS. This template uses [esbuild](https://esbuild.github.io/) to bundle your javascript and fingerprint the files in the site build.

### Customizing 11ty

TODO

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

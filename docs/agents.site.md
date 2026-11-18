# Site guidance

## Paths

- `.eleventy.js` uses the installed preset defaults and adds `newsTagLabel` and `recentPressReleases`. Eleventy reads from the repository root and writes to `_site/`. The preset passes through `admin/`, `uploads/`, `img/`, `favicon.ico`, and `site.webmanifest` and watches `styles/` and `js/`.
- `styles/styles.scss` contains the USWDS theme settings and site styles. Browser entries are `js/app.js` and `js/uswds-init.js`. The Decap CMS entry is `admin/index.html`, which loads the bundle from `js/admin.js` and the schema in `admin/config.yml`. The preset bundles CSS and JS under `_site/assets/` and copies USWDS fonts and images under `_site/assets/uswds/`. Sass references those files relative to the stylesheet.
- Layouts live in `_includes/layouts/`, with shared markup in `_includes/`. `layouts/base` assembles the shared shell, including `meta.html` and `scripts.html`. Content lives in `pages/`, `collections/case/`, and `collections/press-release/`. Shared site, contacts, and resources data live in `_data/`.

## Commands and URLs

- Use Node.js 22 or later. Run `npm ci` to install from the lockfile. `npm run build` runs the preset build and then `npm run search:index`. `npm run pages` calls the same build. The preset defaults `ELEVENTY_ENV` to `production` for builds.
- `npm run dev` serves and watches with `ELEVENTY_ENV` defaulting to `development`. The dev script has no Pagefind indexing step. Use a full build to test generated search.
- For rendered tests, the CI sequence is `npx playwright install --with-deps chromium`, `npm run build` with `BASEURL` unset, then `npm run test:e2e`. Playwright starts `npm run serve:test`, which uses Python 3 to serve `_site/` on port 4173. Use `npm run format:content:check` to check Markdown and YAML and `npm run format:content` to write formatting. `.prettierrc` sets `proseWrap` to `never`.
- The production origin is `https://www.osc.gov` in `_data/site.yaml`. The default mount is `/`. Set `BASEURL` to a path such as `/preview` for a Cloud.gov Pages preview build. Keep source permalinks and same-site HTML links rooted at the site without the deployment prefix. The preset applies the prefix through Eleventy's HTML Base transform. For the inline Pagefind module and bundle path, follow the existing `url` filter usage in `_includes/scripts.html`.
- Case documents use `/~assets/cases/` URLs. The local Python server serves only `_site/`. The CI link check maps `/~assets/` links to the production origin.

## Content and CMS contracts

- Put standalone content under `pages/`. `pages/pages.json` defaults to `layouts/default` with `sidenav: true`. `pages/pages.11tydata.js` derives clean, trailing-slash URLs from file paths and honors explicit `permalink` values, including `false`. Navigation opts in through `eleventyNavigation: true` or an object. Its default keys and parent relationships follow the file tree.
- The default layout renders `title` as the page h1, optional Markdown `lead`, and the body. CMS folder collections that use the editable filter show pages with `cms_editable: true`. The FAQ layout uses `faqs` with `question` and `answer` or a `heading` with nested `items`. The resource layout uses `items` with `heading`, `links` (`name`, `url`, optional `icon`), or nested `sections` with their own headings and links. It also renders optional Markdown `footnote`.
- `admin/config.yml` configures the GitHub backend for `OSC-OCIO/osc.gov` on `main` through Cloud.gov Pages, with editorial workflow and `img/` as the media folder.
- Cases use `date` (date closed), `cases` (case numbers), `source.agency`, optional `source.subagency`, `locations`, `results`, and `files` entries with `label` and `href`. `collections/case/case.11tydata.js` derives the title and uses the first case number for the Public Files redirect. Press releases use `title`, `date`, Markdown body, and topic `tags` from the CMS schema. Directory data supplies the `press-release` collection tag and dated news permalink. The news listing defaults to the last 18 months through `recentPressReleases`, and the year archive uses `postsByYear`.

## Search

- `search-index.js` indexes `_site/case/**/*.html` and `_site/news/????-??-??/**/*.html` into `_site/pagefind/`. `pages/cases.md` and `pages/news/index.md` use `layouts/case-index` for their listings. `_includes/scripts.html` loads Pagefind there, including on paginated news listings, and `js/search/pagefind.js` configures the bundle base path.
- For Public Files, `_includes/layouts/case.html` uses `_includes/case-item.html` to emit `content-type:case`, `agency` and `year` filters, and the `date-iso` sort. Keep the `js/search/case-search.js` result renderer aligned with `title`, `agency`, `subagency`, `date`, `date-iso`, pipe-delimited `case-number`, `case-location`, `case-results-json`, and `case-files-json`. The renderer applies the site prefix to local file URLs read from metadata.
- For news, `_includes/layouts/post.html` emits `content-type:press-release`, `year` and `tag` filters, the `date-iso` sort, and `title`, `date`, `date-iso`, and `tags-json` metadata. Keep those keys aligned with `js/search/news-search.js`, which applies the site prefix to result URLs through `js/search/common.js`. `js/search/news-tag-labels.js` provides shared labels for the browser and the Eleventy filter.
- Resource pages with `resource_filtering` use `js/search/resource-search.js` to filter rendered markup by `data-resource-parent` and `data-resource-topic`. Site-wide search uses Search.gov via `pages/search.md`, `_includes/layouts/search.html`, and `_includes/searchgov/form.html`, with settings in `_data/site.yaml`.

function formatCaseTitle(cases) {
  const values = Array.isArray(cases)
    ? cases.map((value) => String(value || "").trim()).filter(Boolean)
    : [];

  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

function getPrimaryCaseNumber(data) {
  const values = Array.isArray(data?.cases)
    ? data.cases.map((value) => String(value || "").trim()).filter(Boolean)
    : [];

  if (values.length > 0) {
    return values[0];
  }

  return String(data?.page?.fileSlug || "").trim();
}

function buildCaseRedirectUrl(data) {
  const caseNumber = getPrimaryCaseNumber(data);
  const params = new URLSearchParams();

  if (caseNumber) {
    params.set("case", caseNumber);
    params.set("query", caseNumber);
  }

  const query = params.toString();
  return query ? `/cases/?${query}` : "/cases/";
}

module.exports = {
  permalink: "/case/{{ page.fileSlug }}/",
  layout: "layouts/case",
  tags: ["case"],
  eleventyExcludeFromSitemap: true,
  robots: "noindex,follow",
  eleventyComputed: {
    title: (data) => formatCaseTitle(data.cases),
    case_number: (data) => getPrimaryCaseNumber(data),
    case_redirect_url: (data) => buildCaseRedirectUrl(data),
    canonical_url: (data) => buildCaseRedirectUrl(data),
    meta_refresh: (data) => `0;url=${buildCaseRedirectUrl(data)}`,
  },
};

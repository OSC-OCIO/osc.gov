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

module.exports = {
  permalink: "/case/{{ page.fileSlug }}/",
  layout: "layouts/case",
  tags: ["case"],
  eleventyComputed: {
    title: (data) => formatCaseTitle(data.cases),
  },
};

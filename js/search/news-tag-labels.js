const NEWS_TAG_LABEL_OVERRIDES = {
  "hatch act": "Hatch Act",
  userra: "USERRA",
};

function sentenceCase(value) {
  const label = String(value || "").trim().toLocaleLowerCase("en-US");
  if (!label) {
    return "";
  }

  return `${label.charAt(0).toLocaleUpperCase("en-US")}${label.slice(1)}`;
}

function formatNewsTagLabel(value) {
  const tag = String(value || "").trim();
  return NEWS_TAG_LABEL_OVERRIDES[tag] || sentenceCase(tag);
}

module.exports = {
  NEWS_TAG_LABEL_OVERRIDES,
  formatNewsTagLabel,
};

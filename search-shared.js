function stringValue(value) {
  return String(value || "").trim();
}

function normalizePageUrl(url) {
  const value = stringValue(url);
  if (!value) {
    return "/";
  }

  let normalized = value.replace(/\\/g, "/");
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  normalized = normalized.replace(/\/index\.html$/i, "/");
  normalized = normalized.replace(/\/{2,}/g, "/");

  if (!normalized.endsWith("/") && !normalized.endsWith(".html")) {
    normalized = `${normalized}/`;
  }

  return normalized.toLowerCase();
}

function normalizeLookupValue(value) {
  return stringValue(value).replace(/\s+/g, " ").toLowerCase();
}

function buildResourceRecordKey(pageUrl) {
  const segments = Array.prototype.slice.call(arguments, 1).filter(function (
    segment,
  ) {
    return segment !== null && typeof segment !== "undefined" && segment !== "";
  });

  return [normalizePageUrl(pageUrl)]
    .concat(
      segments.map(function (segment) {
        return String(segment);
      }),
    )
    .join("::");
}

module.exports = {
  buildResourceRecordKey,
  normalizeLookupValue,
  normalizePageUrl,
  stringValue,
};

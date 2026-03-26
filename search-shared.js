function stringValue(value) {
  return String(value || "").trim();
}

function normalizePageUrl(url) {
  const value = stringValue(url);
  if (!value) {
    return "/";
  }

  let normalized = value.replace(/\\/g, "/");
  try {
    const baseOrigin =
      typeof window !== "undefined" && window.location
        ? window.location.origin
        : "https://example.com";
    normalized = new URL(normalized, baseOrigin).pathname || "/";
  } catch {
    normalized = normalized.split("#")[0].split("?")[0];
  }

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

module.exports = {
  normalizeLookupValue,
  normalizePageUrl,
  stringValue,
};

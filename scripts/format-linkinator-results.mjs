import {appendFileSync, readFileSync, writeFileSync} from 'node:fs';
import process from 'node:process';

function normalizeLinks(payload) {
  if (!payload) return [];
  if (Array.isArray(payload.links)) return payload.links;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload)) return payload;
  return [];
}

function getStatusCode(link) {
  const candidates = [
    link?.statusCode,
    link?.status,
    link?.response?.status,
    link?.response?.statusCode,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'number') return candidate;
    if (typeof candidate === 'string' && /^\d+$/.test(candidate)) {
      return Number(candidate);
    }
  }

  return null;
}

function getUrl(link) {
  return link?.url || link?.link || link?.target || 'Unknown URL';
}

function getParent(link) {
  return (
    link?.parent ||
    link?.source ||
    link?.origin ||
    link?.referrer ||
    link?.page ||
    'Unknown source'
  );
}

function escapeMarkdownCell(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

function normalizeReportedUrl(url) {
  return String(url).replace(
    /^(?:_site\/|\/)?~assets\//,
    'https://www.osc.gov/~assets/'
  );
}

function formatTableRows(links) {
  return links
    .map((link) => {
      const status = getStatusCode(link) ?? 'unknown';
      const url = escapeMarkdownCell(normalizeReportedUrl(getUrl(link)));
      const parent = escapeMarkdownCell(getParent(link));
      return `| ${status} | ${url} | ${parent} |`;
    })
    .join('\n');
}

function writeSummary(lines) {
  const body = `${lines.join('\n')}\n`;
  if (process.env.GITHUB_STEP_SUMMARY) {
    process.stdout.write(body);
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, body);
  }

  if (process.env.LINK_CHECK_REPORT_FILE) {
    writeFileSync(process.env.LINK_CHECK_REPORT_FILE, body, 'utf8');
  }

  if (!process.env.GITHUB_STEP_SUMMARY) {
    process.stdout.write(body);
  }
}

let payload;
try {
  const rawResults = process.env.LINKINATOR_RESULTS_FILE
    ? readFileSync(process.env.LINKINATOR_RESULTS_FILE, 'utf8')
    : process.env.LINKINATOR_RESULTS || '{}';
  payload = JSON.parse(rawResults);
} catch (error) {
  writeSummary([
    '## Link Check',
    '',
    `Unable to parse Linkinator results: ${error.message}`,
  ]);
  process.exit(0);
}

const links = normalizeLinks(payload);
const failingLinks = links
  .filter((link) => {
    const status = getStatusCode(link);
    return status === 404;
  })
  .sort((a, b) => {
    const aStatus = getStatusCode(a) ?? 0;
    const bStatus = getStatusCode(b) ?? 0;
    if (aStatus !== bStatus) return aStatus - bStatus;
    return getUrl(a).localeCompare(getUrl(b));
  });

const heading = `## Link Check (${process.env.GITHUB_EVENT_NAME || 'manual'}:${process.env.GITHUB_REF_NAME || 'unknown'})`;

if (!failingLinks.length) {
  writeSummary([heading, '', 'No HTTP 404 links found.']);
  process.exit(0);
}

const limit = 100;
const displayedLinks = failingLinks.slice(0, limit);

const lines = [
  heading,
  '',
  `Found ${failingLinks.length} checked link(s) returning HTTP 404.`,
  '',
  '| Status | URL | Found On |',
  '| --- | --- | --- |',
  formatTableRows(displayedLinks),
];

if (failingLinks.length > limit) {
  lines.push('');
  lines.push(`Showing first ${limit} results.`);
}

writeSummary(lines);
process.exit(0);

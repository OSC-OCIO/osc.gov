const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CASES_DIR = path.resolve(__dirname, '../../../collections/case');
const CASES_PER_PAGE = 10;

function parseFrontMatter(contents) {
  const match = contents.match(/^---\n([\s\S]*?)\n---/);
  return match ? yaml.load(match[1]) || {} : {};
}

function formatDateDisplay(dateInput) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(dateInput));
}

function formatCaseTitle(caseNumbers) {
  if (caseNumbers.length === 0) {
    return '';
  }

  if (caseNumbers.length === 1) {
    return caseNumbers[0];
  }

  if (caseNumbers.length === 2) {
    return `${caseNumbers[0]} and ${caseNumbers[1]}`;
  }

  return `${caseNumbers.slice(0, -1).join(', ')}, and ${caseNumbers[caseNumbers.length - 1]}`;
}

function loadCaseFixtures() {
  const records = fs
    .readdirSync(CASES_DIR)
    .filter(function (fileName) {
      return fileName.endsWith('.md');
    })
    .map(function (fileName) {
      const contents = fs.readFileSync(path.join(CASES_DIR, fileName), 'utf8');
      const data = parseFrontMatter(contents);
      const caseNumbers = Array.isArray(data.cases)
        ? data.cases.map(function (value) {
            return String(value || '').trim();
          }).filter(Boolean)
        : [];
      const agency = data.source && data.source.agency ? String(data.source.agency).trim() : '';
      const subagency = data.source && data.source.subagency ? String(data.source.subagency).trim() : '';
      const date = new Date(data.date);

      return {
        agency,
        caseNumbers,
        date,
        dateDisplay: formatDateDisplay(data.date),
        files: Array.isArray(data.files) ? data.files : [],
        locations: Array.isArray(data.locations) ? data.locations : [],
        results: Array.isArray(data.results) ? data.results : [],
        subagency,
        title: formatCaseTitle(caseNumbers),
        year: String(date.getUTCFullYear()),
      };
    })
    .sort(function (left, right) {
      return right.date - left.date;
    });

  const browsePages = [];
  for (let idx = 0; idx < records.length; idx += CASES_PER_PAGE) {
    browsePages.push(records.slice(idx, idx + CASES_PER_PAGE));
  }

  const richRecord = records.find(function (record) {
    return (
      record.caseNumbers[0] &&
      record.agency &&
      record.locations[0] &&
      record.results.length >= 3 &&
      record.files.length >= 4
    );
  });

  if (!richRecord) {
    throw new Error('Unable to find a case record with rich metadata for E2E assertions.');
  }

  const filterRecord = records.find(function (record) {
    return record.agency && record.year;
  });

  if (!filterRecord) {
    throw new Error('Unable to find a case record with agency and year filters.');
  }

  return {
    browsePages,
    filterRecord,
    richRecord,
  };
}

module.exports = {
  CASES_PER_PAGE,
  loadCaseFixtures,
};

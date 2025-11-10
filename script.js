const storageKey = 'opportunity-tracker-entries';
const fieldIds = [
  'addedOn',
  'link',
  'title',
  'organization',
  'opportunityType',
  'tags',
  'location',
  'remote',
  'deadline',
  'programDates',
  'duration',
  'compensation',
  'eligibility',
  'materials',
  'applyLink',
  'contactEmail',
  'source',
  'notes',
  'status',
  'priority',
  'nextAction',
  'nextActionDate'
];

const form = document.getElementById('opportunity-form');
const fetchButton = document.getElementById('fetch-details');
const clearAllButton = document.getElementById('clear-all');
const statusMessage = document.getElementById('fetch-status');
const tableBody = document.querySelector('#opportunity-table tbody');

let entries = loadEntries();
renderEntries();

fetchButton.addEventListener('click', handleFetchDetails);
form.addEventListener('submit', handleSubmit);
clearAllButton.addEventListener('click', handleClearAll);
tableBody.addEventListener('click', handleTableClick);

function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const entry = {};
  fieldIds.forEach((id) => {
    let value = formData.get(id) || '';
    if (id === 'addedOn' && !value) {
      value = new Date().toISOString().slice(0, 10);
    }
    if ((id === 'link' || id === 'applyLink') && value) {
      value = normalizeUrl(value);
    }
    entry[id] = value.trim ? value.trim() : value;
  });

  entries.unshift(entry);
  saveEntries();
  renderEntries();
  form.reset();
  setStatus('Opportunity added to your list.', 'text-success');
}

async function handleFetchDetails() {
  const rawUrl = form.link.value.trim();
  if (!rawUrl) {
    setStatus('Enter a link to fetch details.', 'text-danger');
    return;
  }

  let normalizedUrl = rawUrl;
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  setStatus('Fetching details…', 'text-secondary');

  try {
    const proxiedUrl = `https://r.jina.ai/${normalizedUrl}`;
    const response = await fetch(proxiedUrl, { headers: { 'Accept': 'text/html' } });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const metadata = extractMetadata(doc, normalizedUrl);
    applyMetadata(metadata);

    if (!form.addedOn.value) {
      form.addedOn.value = new Date().toISOString().slice(0, 10);
    }

    setStatus('Details fetched. Review and update anything that needs polishing.', 'text-success');
  } catch (error) {
    console.error('Unable to fetch opportunity details:', error);
    setStatus('Unable to fetch details automatically. You can fill out the fields manually.', 'text-danger');
  }
}

function applyMetadata(metadata) {
  Object.entries(metadata).forEach(([key, value]) => {
    if (!value) return;
    const field = form.elements[key];
    if (!field) return;

    if (field.tagName === 'SELECT') {
      for (const option of field.options) {
        if (option.value.toLowerCase() === String(value).toLowerCase()) {
          field.value = option.value;
          return;
        }
      }
    }

    if (!field.value) {
      field.value = value;
    }
  });
}

function setStatus(message, className) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message small mt-1 ${className}`.trim();
}

function handleClearAll() {
  if (!entries.length) return;
  const confirmation = confirm('Remove all saved opportunities? This cannot be undone.');
  if (!confirmation) return;

  entries = [];
  saveEntries();
  renderEntries();
  setStatus('All opportunities removed.', 'text-secondary');
}

function handleTableClick(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const index = Number(button.dataset.index);
  if (Number.isNaN(index)) return;

  if (button.dataset.action === 'delete') {
    entries.splice(index, 1);
    saveEntries();
    renderEntries();
  }
}

function renderEntries() {
  tableBody.innerHTML = '';
  entries.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(entry.addedOn)}</td>
      <td>${renderLink(entry.link)}</td>
      <td>${escapeHtml(entry.title)}</td>
      <td>${escapeHtml(entry.organization)}</td>
      <td>${escapeHtml(entry.opportunityType)}</td>
      <td>${escapeHtml(entry.tags)}</td>
      <td>${escapeHtml(entry.location)}</td>
      <td>${escapeHtml(entry.remote)}</td>
      <td>${escapeHtml(entry.deadline)}</td>
      <td>${escapeHtml(entry.programDates)}</td>
      <td>${escapeHtml(entry.duration)}</td>
      <td>${escapeHtml(entry.compensation)}</td>
      <td>${escapeHtml(entry.eligibility)}</td>
      <td>${escapeHtml(entry.materials)}</td>
      <td>${renderLink(entry.applyLink)}</td>
      <td>${escapeHtml(entry.contactEmail)}</td>
      <td>${escapeHtml(entry.source)}</td>
      <td>${formatMultiline(entry.notes)}</td>
      <td><span class="badge bg-light text-dark border">${escapeHtml(entry.status)}</span></td>
      <td><span class="badge ${priorityClass(entry.priority)}">${escapeHtml(entry.priority)}</span></td>
      <td>${escapeHtml(entry.nextAction)}</td>
      <td>${formatDate(entry.nextActionDate)}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-index="${index}">Remove</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}


function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return `https://${trimmed}`;
}

function priorityClass(priority) {
  switch ((priority || '').toLowerCase()) {
    case 'high':
      return 'bg-danger-subtle text-danger border-0';
    case 'low':
      return 'bg-secondary-subtle text-secondary border-0';
    default:
      return 'bg-primary-subtle text-primary border-0';
  }
}

function renderLink(url) {
  if (!url) return '';
  const safeUrl = escapeHtml(url);
  const display = escapeHtml(url.replace(/^https?:\/\//, ''));
  return `<a href="${safeUrl}" target="_blank" rel="noopener">${display}</a>`;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return escapeHtml(value);
  }
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatMultiline(value) {
  if (!value) return '';
  return escapeHtml(value).replace(/\n/g, '<br>');
}

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function saveEntries() {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function loadEntries() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to load saved opportunities from localStorage:', error);
    return [];
  }
}

function extractMetadata(doc, url) {
  const metadata = {};
  const textContent = doc.body ? doc.body.textContent : '';
  const condensedText = textContent ? textContent.replace(/\s+/g, ' ').toLowerCase() : '';
  const meta = (selector, attribute = 'content') => {
    const element = doc.querySelector(selector);
    return element ? element.getAttribute(attribute) : '';
  };

  metadata.title = meta('meta[property="og:title"]') || doc.querySelector('title')?.textContent?.trim() || '';
  metadata.organization = meta('meta[property="og:site_name"]') || deriveOrganization(url);
  metadata.opportunityType = deriveOpportunityType(condensedText, meta('meta[property="og:type"]'));
  metadata.tags = meta('meta[name="keywords"]');
  metadata.location = deriveLocation(doc, condensedText);
  metadata.remote = deriveRemote(condensedText);
  metadata.deadline = deriveDeadline(textContent);
  metadata.programDates = deriveProgramDates(textContent);
  metadata.duration = deriveDuration(textContent);
  metadata.compensation = deriveCompensation(textContent);
  metadata.eligibility = deriveEligibility(textContent);
  metadata.materials = deriveMaterials(textContent);
  metadata.applyLink = deriveApplyLink(doc, url) || url;
  metadata.contactEmail = deriveContactEmail(textContent);
  metadata.source = new URL(url).hostname.replace(/^www\./, '');
  metadata.notes = meta('meta[name="description"]');

  return metadata;
}

function deriveOrganization(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    const segments = hostname.split('.');
    if (segments.length > 2) {
      return capitalizeWords(segments.slice(0, -2).join(' '));
    }
    return capitalizeWords(segments[0].replace(/[-_]/g, ' '));
  } catch (error) {
    return '';
  }
}

function deriveOpportunityType(text, ogType) {
  if (ogType) {
    const formatted = mapOpportunityType(ogType);
    if (formatted) return formatted;
  }
  if (!text) return '';
  const checks = [
    { regex: /intern(ship)?/, value: 'Internship' },
    { regex: /fellow(ship)?/, value: 'Fellowship' },
    { regex: /scholarship|grant/, value: 'Scholarship' },
    { regex: /apprentice/, value: 'Apprenticeship' },
    { regex: /bootcamp|program/, value: 'Program' },
    { regex: /competition|challenge/, value: 'Competition' },
    { regex: /conference|summit/, value: 'Conference' },
    { regex: /job|opening|position/, value: 'Job' }
  ];
  for (const { regex, value } of checks) {
    if (regex.test(text)) return value;
  }
  return '';
}

function mapOpportunityType(raw) {
  const value = raw.toLowerCase();
  if (value.includes('intern')) return 'Internship';
  if (value.includes('fellow')) return 'Fellowship';
  if (value.includes('scholar')) return 'Scholarship';
  if (value.includes('job')) return 'Job';
  if (value.includes('event')) return 'Event';
  if (value.includes('article')) return '';
  return raw;
}

function deriveLocation(doc, text) {
  const locationMeta = doc.querySelector('meta[name="geo.placename"], meta[property="place:location:locality"]');
  if (locationMeta?.content) return locationMeta.content;

  if (!text) return '';
  const locationMatch = text.match(/based in ([a-z ,.-]+)/i) || text.match(/located in ([a-z ,.-]+)/i);
  if (locationMatch) return capitalizeWords(locationMatch[1]);
  return '';
}

function deriveRemote(text) {
  if (!text) return '';
  if (text.includes('remote')) return 'Yes';
  if (text.includes('hybrid')) return 'Hybrid';
  if (text.includes('on-site') || text.includes('on site')) return 'No';
  return '';
}


function deriveDeadline(text) {
  if (!text) return '';
  const deadlineMatch = text.match(/deadline[:\s]*([a-z]{3,9} \d{1,2},? \d{4})/i) ||
    text.match(/apply by[:\s]*([a-z]{3,9} \d{1,2},? \d{4})/i);
  return deadlineMatch ? deadlineMatch[1].trim() : '';
}

function deriveProgramDates(text) {
  if (!text) return '';
  const programMatch = text.match(/program dates?[:\s]*([a-z0-9 ,\-–]+)/i);
  if (programMatch) return programMatch[1].trim();
  const seasonMatch = text.match(/(?:summer|fall|spring|winter)\s+\d{4}/i);
  return seasonMatch ? seasonMatch[0] : '';
}

function deriveDuration(text) {
  if (!text) return '';
  const durationMatch = text.match(/(?:duration|lasts|length)[:\s]*([0-9]+\s*(?:weeks?|months?|days?))/i);
  if (durationMatch) return durationMatch[1].trim();
  const weeksMatch = text.match(/([0-9]+)\s*week/);
  return weeksMatch ? `${weeksMatch[1]} weeks` : '';
}

function deriveCompensation(text) {
  if (!text) return '';
  const compensationMatch = text.match(/(?:stipend|salary|compensation|pay)[:\s]*([$€£]\s?[0-9,]+\s?(?:per\s*(?:hour|week|month|year))?)/i);
  if (compensationMatch) return compensationMatch[0].replace(/\s+/g, ' ').trim();
  if (/paid position/.test(text)) return 'Paid';
  if (/unpaid/.test(text)) return 'Unpaid';
  return '';
}

function deriveEligibility(text) {
  if (!text) return '';
  const eligibilityMatch = text.match(/eligib(?:ility|le)[^:]*[:\s]+([^\.]+\.)/i);
  if (eligibilityMatch) return eligibilityMatch[1].trim();
  if (/high school/.test(text)) return 'High school students';
  if (/undergraduate/.test(text)) return 'Undergraduate students';
  if (/graduate/.test(text)) return 'Graduate students';
  return '';
}

function deriveMaterials(text) {
  if (!text) return '';
  const materialsMatch = text.match(/materials? required[:\s]*([^\.]+\.)/i);
  if (materialsMatch) return materialsMatch[1].replace(/\.$/, '').trim();
  const materials = [];
  if (/resume/.test(text)) materials.push('Resume');
  if (/cover letter/.test(text)) materials.push('Cover Letter');
  if (/transcript/.test(text)) materials.push('Transcript');
  if (/recommendation/.test(text)) materials.push('Recommendation');
  return materials.join(', ');
}

function deriveApplyLink(doc, baseUrl) {
  const anchor = Array.from(doc.querySelectorAll('a[href]')).find((a) => /apply/i.test(a.textContent) || /apply/i.test(a.getAttribute('href')));
  if (!anchor) return '';
  try {
    return new URL(anchor.getAttribute('href'), baseUrl).href;
  } catch (error) {
    return anchor.getAttribute('href');
  }
}

function deriveContactEmail(text) {
  if (!text) return '';
  const emailMatch = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return emailMatch ? emailMatch[0] : '';
}

function capitalizeWords(value) {
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const storageKey = 'opportunity-tracker-entries';
const profileStorageKey = 'opportunity-tracker-profile';
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

const profileFieldIds = [
  'fullName',
  'educationLevel',
  'gradYear',
  'gpa',
  'citizenship',
  'majors',
  'skills',
  'courses',
  'resumeHighlights'
];

const form = document.getElementById('opportunity-form');
const fetchButton = document.getElementById('fetch-details');
const clearAllButton = document.getElementById('clear-all');
const statusMessage = document.getElementById('fetch-status');
const tableBody = document.querySelector('#opportunity-table tbody');
const eligibilityPreview = document.getElementById('eligibility-preview');

const profileForm = document.getElementById('profile-form');
const clearProfileButton = document.getElementById('clear-profile');
const profileLastUpdated = document.getElementById('profile-last-updated');

const metricsElements = {
  total: document.getElementById('metric-total'),
  dueSoon: document.getElementById('metric-due-soon'),
  overdue: document.getElementById('metric-overdue'),
  highPriority: document.getElementById('metric-high-priority')
};

const nextActionsList = document.getElementById('next-actions-list');
const eligibilityWatchlist = document.getElementById('eligibility-watchlist');
const deadlineRadar = document.getElementById('deadline-radar');

let profile = loadProfile();
let entries = loadEntries().map(upgradeEntry);

renderEntries();
populateProfileForm();
updateProfileSummary();
updateEligibilityPreview();

fetchButton.addEventListener('click', handleFetchDetails);
form.addEventListener('submit', handleSubmit);
form.addEventListener('input', (event) => {
  if (event.target.name === 'eligibility' || event.target.name === 'tags') {
    updateEligibilityPreview();
  }
});
clearAllButton.addEventListener('click', handleClearAll);
tableBody.addEventListener('click', handleTableClick);

profileForm.addEventListener('submit', handleProfileSubmit);
clearProfileButton.addEventListener('click', handleProfileClear);
profileForm.addEventListener('input', (event) => {
  if (['skills', 'courses', 'resumeHighlights', 'educationLevel', 'gpa', 'citizenship', 'majors'].includes(event.target.name)) {
    updateEligibilityPreview();
  }
});


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

  entry.eligibilityAssessment = evaluateEligibility(entry);

  entries.unshift(entry);
  saveEntries();
  renderEntries();
  form.reset();
  updateEligibilityPreview();
  setStatus('Opportunity added to your dashboard.', 'text-success');
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
    const response = await fetch(proxiedUrl, { headers: { Accept: 'text/html' } });
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

    updateEligibilityPreview();
    setStatus('Details fetched. Review eligibility and finalize before saving.', 'text-success');
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
    const assessment = entry.eligibilityAssessment || evaluateEligibility(entry);
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
      <td>${renderUrgency(entry)}</td>
      <td>${escapeHtml(entry.programDates)}</td>
      <td>${escapeHtml(entry.duration)}</td>
      <td>${escapeHtml(entry.compensation)}</td>
      <td>${escapeHtml(entry.eligibility)}</td>
      <td>${renderEligibilityIndicator(assessment)}</td>
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

  updateDashboard();
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
  const parsed = parseFlexibleDate(value);
  if (!parsed) {
    return escapeHtml(value);
  }
  return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
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
  const serialized = entries.map(({ eligibilityAssessment, ...rest }) => rest);
  localStorage.setItem(storageKey, JSON.stringify(serialized));
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

function loadProfile() {
  try {
    const stored = localStorage.getItem(profileStorageKey);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('Unable to load profile from localStorage:', error);
    return {};
  }
}

function saveProfile() {
  localStorage.setItem(profileStorageKey, JSON.stringify(profile));
}

function populateProfileForm() {
  profileFieldIds.forEach((id) => {
    const field = profileForm.elements[id];
    if (!field) return;
    field.value = profile[id] || '';
  });
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const formData = new FormData(profileForm);
  const updatedProfile = {};

  profileFieldIds.forEach((id) => {
    const value = formData.get(id) || '';
    updatedProfile[id] = value.trim ? value.trim() : value;
  });

  updatedProfile.lastUpdated = new Date().toISOString();
  profile = updatedProfile;
  saveProfile();
  updateProfileSummary();
  entries = entries.map(upgradeEntry);
  saveEntries();
  renderEntries();
  updateEligibilityPreview();
}

function handleProfileClear() {
  if (!Object.keys(profile).length) {
    profileForm.reset();
    updateEligibilityPreview();
    return;
  }

  const confirmation = confirm('Clear your stored profile details? Eligibility comparisons will reset.');
  if (!confirmation) return;

  profile = {};
  localStorage.removeItem(profileStorageKey);
  profileForm.reset();
  updateProfileSummary();
  entries = entries.map(upgradeEntry);
  saveEntries();
  renderEntries();
  updateEligibilityPreview();
}

function updateProfileSummary() {
  if (profile.lastUpdated) {
    const date = new Date(profile.lastUpdated);
    profileLastUpdated.textContent = `Last updated ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
  } else {
    profileLastUpdated.textContent = 'Profile not saved yet.';
  }
}

function updateEligibilityPreview() {
  if (!eligibilityPreview) return;
  const tempEntry = {};
  fieldIds.forEach((id) => {
    const field = form.elements[id];
    if (!field) return;
    tempEntry[id] = field.value || '';
  });
  const assessment = evaluateEligibility(tempEntry);
  renderEligibilityPreview(assessment);
}

function renderEligibilityPreview(assessment) {
  if (!assessment || (!assessment.summary && assessment.status === 'unknown')) {
    eligibilityPreview.classList.add('d-none');
    eligibilityPreview.innerHTML = '';
    return;
  }

  const statusClass = {
    strong: 'eligibility-strong',
    review: 'eligibility-review',
    gap: 'eligibility-gap',
    unknown: 'eligibility-unknown'
  }[assessment.status] || 'eligibility-unknown';

  const matchesList = assessment.matches.length
    ? `<p class="mb-1 fw-semibold text-success">You match:</p><ul class="mb-2">${assessment.matches.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '';
  const gapsList = assessment.gaps.length
    ? `<p class="mb-1 fw-semibold text-danger">Needs attention:</p><ul class="mb-0">${assessment.gaps.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '';

  eligibilityPreview.className = `eligibility-feedback ${statusClass}`;
  eligibilityPreview.innerHTML = `
    <strong>${escapeHtml(assessment.summary)}</strong>
    ${assessment.detail ? `<p class="mb-2">${escapeHtml(assessment.detail)}</p>` : ''}
    ${matchesList}
    ${gapsList}
  `;
  eligibilityPreview.classList.remove('d-none');
}

function extractMetadata(doc, url) {
  const metadata = {};
  const textContent = doc.body ? doc.body.textContent || '' : '';
  const condensedText = textContent ? textContent.replace(/\s+/g, ' ').toLowerCase() : '';

  const meta = (selector, attribute = 'content') => {
    const element = doc.querySelector(selector);
    return element ? element.getAttribute(attribute) : '';
  };

  const titleTag = doc.querySelector('title')?.textContent?.trim() || '';

  metadata.title = meta('meta[property="og:title"]') || meta('meta[name="og:title"]') || titleTag;
  metadata.organization = chooseOrganization(doc, url, textContent) || deriveOrganizationFromDomain(url);
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
  metadata.source = safeHostname(url);
  metadata.notes = meta('meta[name="description"]');

  return metadata;
}

function chooseOrganization(doc, url, textContent) {
  const candidates = new Set();
  const addCandidate = (value) => {
    if (!value) return;
    const cleaned = value
      .replace(/\s+/g, ' ')
      .replace(/[|»·–-]{2,}/g, ' ')
      .replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '')
      .trim();
    if (cleaned && cleaned.length <= 80) {
      candidates.add(cleaned);
    }
  };

  const metaSelectors = [
    'meta[property="og:site_name"]',
    'meta[name="og:site_name"]',
    'meta[name="application-name"]',
    'meta[name="author"]',
    'meta[name="publisher"]',
    'meta[property="article:publisher"]',
    'meta[name="twitter:site"]',
    'meta[name="twitter:creator"]'
  ];
  metaSelectors.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((el) => {
      let value = el.getAttribute('content') || el.getAttribute('value');
      if (!value) return;
      if (value.startsWith('@')) value = value.slice(1);
      addCandidate(value);
    });
  });

  const titleTag = doc.querySelector('title')?.textContent || '';
  if (titleTag.includes('|')) {
    titleTag.split('|').forEach((part) => addCandidate(part));
  }
  if (/\bat\b/i.test(titleTag)) {
    const segments = titleTag.split(/ at /i);
    if (segments.length > 1) {
      addCandidate(segments[segments.length - 1]);
    }
  }

  const logoSelectors = [
    '[class*="logo"] img[alt]',
    'header img[alt]',
    'header [aria-label]',
    '[data-testid*="logo" i]',
    '[data-test*="logo" i]'
  ];
  logoSelectors.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((el) => {
      const value = el.getAttribute('alt') || el.getAttribute('aria-label');
      addCandidate(value);
    });
  });

  const jsonLdScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
  jsonLdScripts.forEach((script) => {
    try {
      const json = JSON.parse(script.textContent || '{}');
      collectOrganizationNames(json, addCandidate);
    } catch (error) {
      // ignore malformed JSON
    }
  });

  const domainCandidate = deriveOrganizationFromDomain(url);
  addCandidate(domainCandidate);

  let bestName = '';
  let bestScore = -Infinity;
  const text = (textContent || '').toLowerCase();
  const domainCore = domainCandidate.toLowerCase();

  candidates.forEach((candidate) => {
    const score = scoreOrganizationCandidate(candidate, text, domainCore);
    if (score > bestScore) {
      bestScore = score;
      bestName = candidate;
    }
  });

  if (!bestName) {
    return domainCandidate;
  }

  return capitalizeWords(bestName);
}

function collectOrganizationNames(node, addCandidate) {
  if (!node) return;
  if (Array.isArray(node)) {
    node.forEach((item) => collectOrganizationNames(item, addCandidate));
    return;
  }
  if (typeof node !== 'object') return;

  if (node.name) {
    addCandidate(node.name);
  }
  if (node.publisher && typeof node.publisher === 'object') {
    if (node.publisher.name) addCandidate(node.publisher.name);
    if (node.publisher.organization && node.publisher.organization.name) {
      addCandidate(node.publisher.organization.name);
    }
  }
  if (node.brand && typeof node.brand === 'object') {
    if (node.brand.name) addCandidate(node.brand.name);
  }
  Object.values(node).forEach((value) => collectOrganizationNames(value, addCandidate));
}

function scoreOrganizationCandidate(candidate, text, domainCore) {
  const normalized = candidate.toLowerCase();
  let score = 0;

  if (normalized.includes(domainCore) && domainCore) score += 3;
  if (/[a-z]{3,}\s+[a-z]{2,}/i.test(candidate)) score += 2;
  if (/(inc\.?|llc|corp|university|college|institute|labs|company|group|foundation)/i.test(candidate)) score += 1.5;
  if (/(career|jobs?|login|apply|portal|auth)/i.test(candidate)) score -= 4;
  if (text && normalized.length > 3) {
    const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) score += 3;
  }
  if (candidate.length > 45) score -= 2;
  return score;
}

function deriveOrganizationFromDomain(url) {
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
  const deadlineMatch = text.match(/deadline[:\s]*([a-z]{3,9} \d{1,2}(?:st|nd|rd|th)?,? \d{4})/i) ||
    text.match(/apply by[:\s]*([a-z]{3,9} \d{1,2}(?:st|nd|rd|th)?,? \d{4})/i) ||
    text.match(/due[:\s]*([a-z]{3,9} \d{1,2}(?:st|nd|rd|th)?,? \d{4})/i);
  return deadlineMatch ? cleanupDate(deadlineMatch[1]) : '';

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

function safeHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (error) {
    return '';
  }
}

function parseFlexibleDate(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const cleaned = cleanupDate(value);
  const parsed = new Date(cleaned);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const alt = Date.parse(cleaned.replace(/-/g, '/'));
  if (!Number.isNaN(alt)) return new Date(alt);

  const match = cleaned.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (match) {
    const [, month, day, year] = match;
    const normalizedYear = year.length === 2 ? Number(`20${year}`) : Number(year);
    const monthNum = Number(month);
    const dayNum = Number(day);
    if (!Number.isNaN(normalizedYear) && !Number.isNaN(monthNum) && !Number.isNaN(dayNum)) {
      return new Date(normalizedYear, monthNum - 1, dayNum);
    }
  }
  return null;
}

function cleanupDate(value) {
  return String(value).replace(/(\d+)(st|nd|rd|th)/gi, '$1').trim();
}

function renderUrgency(entry) {
  const deadlineDate = parseFlexibleDate(entry.deadline);
  if (!deadlineDate) return '';

  const today = startOfDay(new Date());
  const deadlineDay = startOfDay(deadlineDate);
  const diffMs = deadlineDay.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / 86400000);

  if (diffDays < 0) {
    return `<span class="deadline-chip">Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}</span>`;
  }
  if (diffDays === 0) {
    return '<span class="deadline-chip deadline-soon">Due today</span>';
  }
  if (diffDays <= 7) {
    return `<span class="deadline-chip deadline-soon">Due in ${diffDays} day${diffDays === 1 ? '' : 's'}</span>`;
  }
  return `<span class="deadline-chip deadline-clear">In ${diffDays} day${diffDays === 1 ? '' : 's'}</span>`;
}

function renderEligibilityIndicator(assessment) {
  if (!assessment) return '';
  const statusClass = {
    strong: 'eligibility-strong',
    review: 'eligibility-review',
    gap: 'eligibility-gap',
    unknown: 'eligibility-unknown'
  }[assessment.status] || 'eligibility-unknown';

  const detail = assessment.gaps.length ? assessment.gaps[0] : assessment.detail;
  const tooltip = detail ? ` title="${escapeHtml(detail)}"` : '';

  return `<span class="eligibility-pill ${statusClass}"${tooltip}>${escapeHtml(assessment.summary)}</span>`;
}

function evaluateEligibility(entry) {
  const eligibilityText = (entry.eligibility || '').toLowerCase();
  const matches = [];
  const gaps = [];
  const detailNotes = [];

  if (!Object.keys(profile).length) {
    return {
      status: 'unknown',
      summary: 'Add profile details for personalized checks',
      matches,
      gaps,
      detail: ''
    };
  }

  if (!eligibilityText.trim()) {
    return {
      status: 'unknown',
      summary: 'No eligibility requirements listed',
      matches,
      gaps,
      detail: ''
    };
  }

  const educationLevel = (profile.educationLevel || '').toLowerCase();
  if (/high school/.test(eligibilityText)) {
    if (educationLevel.includes('high school')) {
      matches.push('Matches high school requirement');
    } else {
      gaps.push('Requires high school status');
    }
  }
  if (/undergraduate|bachelor/.test(eligibilityText)) {
    if (educationLevel.includes('undergraduate') || educationLevel.includes('professional')) {
      matches.push('Undergraduate standing confirmed');
    } else {
      gaps.push('Requires undergraduate status');
    }
  }
  if (/graduate|master|phd/.test(eligibilityText)) {
    if (educationLevel.includes('graduate') || educationLevel.includes('professional')) {
      matches.push('Graduate standing confirmed');
    } else {
      gaps.push('Requires graduate-level status');
    }
  }

  if (/citizen|permanent resident/.test(eligibilityText) && profile.citizenship) {
    if (eligibilityText.includes(profile.citizenship.toLowerCase())) {
      matches.push(`Citizenship requirement matches (${profile.citizenship})`);
    } else if (/u\.?s\.? citizen/.test(eligibilityText) && /u\.?s\.?/i.test(profile.citizenship)) {
      matches.push('Citizenship requirement matches (U.S.)');
    } else {
      gaps.push(`Citizenship requirement differs from profile (${profile.citizenship || 'unspecified'})`);
    }
  }

  if (/gpa/i.test(eligibilityText) && profile.gpa) {
    const gpaMatch = eligibilityText.match(/gpa[^0-9]*([0-4]\.?[0-9]{0,2})/i);
    if (gpaMatch) {
      const required = parseFloat(gpaMatch[1]);
      const actual = parseFloat(profile.gpa);
      if (!Number.isNaN(required) && !Number.isNaN(actual)) {
        if (actual >= required) {
          matches.push(`GPA requirement met (${actual.toFixed(2)} ≥ ${required.toFixed(2)})`);
        } else {
          gaps.push(`GPA requirement short (${actual.toFixed(2)} < ${required.toFixed(2)})`);
        }
      }
    }
  }

  const profileKeywordSet = buildProfileKeywordSet(profile);
  const requiredKeywords = extractEligibilityKeywords(eligibilityText, entry.tags || '');

  requiredKeywords.forEach((keyword) => {
    if (profileKeywordSet.has(keyword)) {
      matches.push(`Has ${keyword}`);
    } else {
      gaps.push(`Add experience or coursework in ${keyword}`);
    }
  });

  if (entry.tags) {
    entry.tags.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean).forEach((tag) => {
      if (profileKeywordSet.has(tag)) {
        matches.push(`Tag matches profile strength (${tag})`);
      }
    });
  }

  let status = 'strong';
  let summary = 'Likely eligible';

  if (gaps.length) {
    status = 'gap';
    summary = 'Eligibility gaps detected';
  } else if (!matches.length) {
    status = 'review';
    summary = 'Needs manual review';
  }

  if (!gaps.length && matches.length && status === 'strong') {
    detailNotes.push('All detected requirements align with your profile.');
  }
  if (gaps.length && matches.length) {
    status = 'review';
    summary = 'Partially eligible — address gaps';
  }

  return {
    status,
    summary,
    matches: dedupeList(matches),
    gaps: dedupeList(gaps),
    detail: detailNotes.join(' ')
  };
}

function buildProfileKeywordSet(profileData) {
  const keywords = [];
  ['skills', 'courses', 'majors', 'resumeHighlights'].forEach((key) => {
    const value = profileData[key];
    if (!value) return;
    value.split(/[,\n]/).map((item) => item.trim().toLowerCase()).filter(Boolean).forEach((item) => {
      keywords.push(item);
      const normalized = item.replace(/[^a-z0-9 ]/g, '').trim();
      if (normalized && normalized !== item) keywords.push(normalized);
    });
  });
  return new Set(keywords);
}

function extractEligibilityKeywords(text, tags) {
  const library = [
    'python', 'java', 'javascript', 'c++', 'c', 'go', 'rust', 'sql', 'excel', 'power bi', 'tableau',
    'machine learning', 'data science', 'ai', 'deep learning', 'cloud', 'aws', 'azure', 'gcp',
    'cybersecurity', 'robotics', 'biology', 'chemistry', 'physics', 'matlab', 'r', 'statistics',
    'calculus', 'linear algebra', 'data structures', 'algorithms', 'economics', 'finance', 'marketing',
    'public policy', 'communications', 'design', 'ux', 'ui', 'product management'
  ];

  const combined = `${text} ${tags.toLowerCase()}`;
  const detected = new Set();

  library.forEach((keyword) => {
    if (combined.includes(keyword)) {
      detected.add(keyword);
    }
  });

  return Array.from(detected);
}

function dedupeList(list) {
  return Array.from(new Set(list));
}

function upgradeEntry(entry) {
  const upgraded = { ...entry };
  upgraded.eligibilityAssessment = evaluateEligibility(upgraded);
  return upgraded;
}

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function updateDashboard() {
  renderMetrics();
  renderNextActions();
  renderEligibilityWatchlist();
  renderDeadlineRadar();
}

function renderMetrics() {
  metricsElements.total.textContent = entries.length;

  const today = startOfDay(new Date());
  const soonThreshold = new Date(today);
  soonThreshold.setDate(soonThreshold.getDate() + 7);

  let dueSoon = 0;
  let overdue = 0;
  let highPriority = 0;

  entries.forEach((entry) => {
    const deadlineDate = parseFlexibleDate(entry.deadline);
    if (deadlineDate) {
      const day = startOfDay(deadlineDate);
      if (day < today) overdue += 1;
      if (day >= today && day <= soonThreshold) dueSoon += 1;
    }
    if ((entry.priority || '').toLowerCase() === 'high') highPriority += 1;
  });

  metricsElements.dueSoon.textContent = dueSoon;
  metricsElements.overdue.textContent = overdue;
  metricsElements.highPriority.textContent = highPriority;
}

function renderNextActions() {
  const items = entries
    .map((entry) => ({
      entry,
      date: parseFlexibleDate(entry.nextActionDate)
    }))
    .filter((item) => item.date)
    .sort((a, b) => a.date - b.date)
    .slice(0, 6);

  if (!items.length) {
    nextActionsList.innerHTML = '<li class="empty-state">No next actions scheduled yet. Add opportunities and set next steps to see them here.</li>';
    return;
  }

  nextActionsList.innerHTML = items
    .map(({ entry, date }) => {
      const title = escapeHtml(entry.title || 'Untitled Opportunity');
      const org = escapeHtml(entry.organization || 'Unknown organization');
      const action = escapeHtml(entry.nextAction || 'Review opportunity');
      const relative = formatRelativeDate(date);
      return `
        <li>
          <div class="d-flex justify-content-between align-items-start gap-3">
            <div>
              <div class="fw-semibold">${title}</div>
              <div class="text-secondary small">${org}</div>
              <div class="mt-1 small">${action}</div>
            </div>
            <div class="text-end small text-nowrap">${relative}</div>
          </div>
        </li>
      `;
    })
    .join('');
}

function renderEligibilityWatchlist() {
  const items = entries
    .map((entry) => ({ entry, assessment: entry.eligibilityAssessment || evaluateEligibility(entry) }))
    .filter(({ assessment }) => assessment.status === 'gap' || assessment.status === 'review')
    .slice(0, 6);

  if (!items.length) {
    eligibilityWatchlist.innerHTML = '<li class="empty-state">You\'re all set—no eligibility concerns detected.</li>';
    return;
  }

  eligibilityWatchlist.innerHTML = items
    .map(({ entry, assessment }) => {
      const title = escapeHtml(entry.title || 'Untitled Opportunity');
      const org = escapeHtml(entry.organization || 'Unknown organization');
      const gap = assessment.gaps[0] ? escapeHtml(assessment.gaps[0]) : 'Needs additional review';
      return `
        <li>
          <div class="fw-semibold mb-1">${title}</div>
          <div class="text-secondary small mb-1">${org}</div>
          <span class="eligibility-pill ${assessment.status === 'gap' ? 'eligibility-gap' : 'eligibility-review'}">${escapeHtml(assessment.summary)}</span>
          <div class="small mt-2">${gap}</div>
        </li>
      `;
    })
    .join('');
}

function renderDeadlineRadar() {
  const today = startOfDay(new Date());
  const items = entries
    .map((entry) => ({ entry, deadline: parseFlexibleDate(entry.deadline) }))
    .filter(({ deadline }) => deadline)
    .sort((a, b) => a.deadline - b.deadline)
    .slice(0, 6);

  if (!items.length) {
    deadlineRadar.innerHTML = '<li class="empty-state">No deadlines yet. Add opportunities to populate this radar.</li>';
    return;
  }

  deadlineRadar.innerHTML = items
    .map(({ entry, deadline }) => {
      const title = escapeHtml(entry.title || 'Untitled Opportunity');
      const org = escapeHtml(entry.organization || 'Unknown organization');
      const diffDays = Math.round((startOfDay(deadline) - today) / 86400000);
      const urgencyClass = diffDays < 0 ? '' : diffDays <= 7 ? 'deadline-soon' : 'deadline-clear';
      const label = diffDays < 0
        ? `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`
        : diffDays === 0
          ? 'Due today'
          : `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
      return `
        <li>
          <div class="d-flex justify-content-between align-items-start gap-3">
            <div>
              <div class="fw-semibold">${title}</div>
              <div class="text-secondary small">${org}</div>
            </div>
            <span class="deadline-chip ${urgencyClass}">${label}</span>
          </div>
        </li>
      `;
    })
    .join('');
}

function formatRelativeDate(date) {
  if (!date) return '';
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((target - today) / 86400000);

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`;
  }
  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Tomorrow';
  }
  return `In ${diffDays} days`;
}

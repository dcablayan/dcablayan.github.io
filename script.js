const STORAGE_PREFIX = 'opportunity-tracker';
const ENTRIES_KEY_BASE = `${STORAGE_PREFIX}-entries`;
const PROFILE_KEY_BASE = `${STORAGE_PREFIX}-profile`;
const AUTH_STATE_KEY = `${STORAGE_PREFIX}-auth-state`;
const PASSKEY_STORE_KEY = `${STORAGE_PREFIX}-passkeys`;

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
const authModal = document.getElementById('auth-modal');
const authModalClose = document.getElementById('auth-modal-close');
const authOpeners = document.querySelectorAll('[data-open-auth]');
const authSignedOut = document.getElementById('auth-signed-out');
const authSignedIn = document.getElementById('auth-signed-in');
const authAvatar = document.getElementById('auth-avatar');
const authUserName = document.getElementById('auth-user-name');
const authUserEmail = document.getElementById('auth-user-email');
const authProviderBadge = document.getElementById('auth-provider-badge');
const authCallout = document.getElementById('auth-callout');
const signOutButton = document.getElementById('sign-out-button');
const authGuards = document.querySelectorAll('[data-auth-guard]');
const googleSignInButtonContainer = document.getElementById('google-signin-button');
const googleSignInPlaceholder = document.getElementById('google-signin-placeholder');
const passkeyRegisterToggle = document.getElementById('passkey-register-toggle');
const passkeyRegisterForm = document.getElementById('passkey-register-form');
const passkeySignInButton = document.getElementById('passkey-sign-in');
const passkeyStatus = document.getElementById('passkey-status');
const passkeyNameInput = document.getElementById('passkey-name');
const passkeyEmailInput = document.getElementById('passkey-email');

const googleClientId = (document.body?.dataset?.googleClientId || '').trim() || (window.AUTH_CONFIG?.googleClientId || '');

let passkeyRegistry = loadPasskeyRegistry();
let passkeySupported = null;

let currentUser = loadCurrentUser();
let profile = {};
let entries = [];

initializeApp();

function initializeApp() {
  setupEventListeners();
  detectPasskeySupport();
  initializeGoogleSignIn();
  reloadUserScopedState();
  updateAuthUi();
  enforceAuthLocks();
  if (!currentUser) {
    setStatus('Sign in to fetch details and add opportunities.', 'text-secondary');
  }
}

function setupEventListeners() {
  if (fetchButton) {
    fetchButton.addEventListener('click', handleFetchDetails);
  }
  if (form) {
    form.addEventListener('submit', handleSubmit);
    form.addEventListener('input', (event) => {
      if (event.target.name === 'eligibility' || event.target.name === 'tags') {
        updateEligibilityPreview();
      }
    });
  }
  if (clearAllButton) {
    clearAllButton.addEventListener('click', handleClearAll);
  }
  if (tableBody) {
    tableBody.addEventListener('click', handleTableClick);
  }
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSubmit);
    profileForm.addEventListener('input', (event) => {
      if (['skills', 'courses', 'resumeHighlights', 'educationLevel', 'gpa', 'citizenship', 'majors'].includes(event.target.name)) {
        updateEligibilityPreview();
      }
    });
  }
  if (clearProfileButton) {
    clearProfileButton.addEventListener('click', handleProfileClear);
  }

  authOpeners.forEach((trigger) => {
    trigger.addEventListener('click', openAuthModal);
  });
  if (authModalClose) {
    authModalClose.addEventListener('click', closeAuthModal);
  }
  if (authModal) {
    authModal.addEventListener('click', (event) => {
      if (event.target === authModal) {
        closeAuthModal();
      }
    });
  }
  if (signOutButton) {
    signOutButton.addEventListener('click', handleSignOut);
  }
  if (passkeyRegisterToggle) {
    passkeyRegisterToggle.addEventListener('click', togglePasskeyRegisterForm);
  }
  if (passkeyRegisterForm) {
    passkeyRegisterForm.addEventListener('submit', handlePasskeyRegister);
  }
  if (passkeySignInButton) {
    passkeySignInButton.addEventListener('click', handlePasskeySignIn);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAuthModal();
    }
  });
}

function reloadUserScopedState() {
  if (currentUser) {
    profile = loadProfile();
    entries = loadEntries().map(upgradeEntry);
  } else {
    profile = {};
    entries = [];
    if (form) {
      form.reset();
    }
    if (profileForm) {
      profileForm.reset();
    }
  }
  populateProfileForm();
  updateProfileSummary();
  renderEntries();
  updateEligibilityPreview();
}

function updateAuthUi() {
  const signedIn = Boolean(currentUser);
  if (authSignedOut) {
    authSignedOut.classList.toggle('d-none', signedIn);
  }
  if (authSignedIn) {
    authSignedIn.classList.toggle('d-none', !signedIn);
  }
  if (authCallout) {
    authCallout.classList.toggle('d-none', signedIn);
  }
  if (authProviderBadge) {
    authProviderBadge.classList.toggle('d-none', !signedIn);
  }
  if (signedIn) {
    if (authUserName) {
      authUserName.textContent = currentUser.name || 'Signed in';
    }
    if (authUserEmail) {
      authUserEmail.textContent = currentUser.email || '';
      authUserEmail.classList.toggle('d-none', !currentUser.email);
    }
    if (authProviderBadge) {
      authProviderBadge.textContent = currentUser.provider === 'passkey' ? 'Passkey' : 'Google';
    }
    if (authAvatar) {
      if (currentUser.avatar) {
        authAvatar.src = currentUser.avatar;
        authAvatar.alt = `${currentUser.name || 'Signed in user'} avatar`;
        authAvatar.hidden = false;
      } else {
        authAvatar.hidden = true;
      }
    }
  } else {
    if (authUserName) authUserName.textContent = '';
    if (authUserEmail) {
      authUserEmail.textContent = '';
      authUserEmail.classList.add('d-none');
    }
    if (authProviderBadge) authProviderBadge.textContent = '';
    if (authAvatar) {
      authAvatar.src = '';
      authAvatar.hidden = true;
    }
  }
}

function enforceAuthLocks() {
  const locked = !currentUser;
  authGuards.forEach((element) => {
    element.classList.toggle('auth-locked', locked);
  });
  toggleControlsDisabled(form, locked);
  toggleControlsDisabled(profileForm, locked);
  if (locked) {
    updateEligibilityPreview();
  }
}

function toggleControlsDisabled(container, disabled) {
  if (!container) return;
  const controls = container.querySelectorAll('input, select, textarea, button');
  controls.forEach((control) => {
    if (control.dataset?.authIgnore === 'true') return;
    control.disabled = disabled;
  });
}

function ensureAuthenticated(actionDescription) {
  if (currentUser) return true;
  if (statusMessage && actionDescription) {
    setStatus(`Sign in to ${actionDescription}.`, 'text-danger');
  }
  openAuthModal();
  return false;
}

function openAuthModal() {
  if (!authModal) return;
  authModal.classList.add('active');
  authModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setPasskeyStatus('');
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.remove('active');
  authModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  hidePasskeyRegisterForm();
  setPasskeyStatus('');
}

function hidePasskeyRegisterForm() {
  if (!passkeyRegisterForm) return;
  passkeyRegisterForm.classList.add('d-none');
  passkeyRegisterForm.reset();
  if (passkeyRegisterToggle) {
    passkeyRegisterToggle.setAttribute('aria-expanded', 'false');
  }
}

function handleSignOut() {
  setCurrentUser(null);
  closeAuthModal();
  setStatus('Signed out. Sign in to continue tracking opportunities.', 'text-secondary');
}

function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    try {
      const persisted = {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar
      };
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(persisted));
    } catch (error) {
      console.warn('Unable to persist auth state:', error);
    }
  } else {
    localStorage.removeItem(AUTH_STATE_KEY);
  }
  reloadUserScopedState();
  updateAuthUi();
  enforceAuthLocks();
}

function handleSubmit(event) {
  event.preventDefault();
  if (!ensureAuthenticated('add opportunities')) {
    return;
  }
  if (!form) return;
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
  if (!ensureAuthenticated('fetch opportunity details')) {
    return;
  }
  if (!form) return;
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
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.className = `status-message small mt-1 ${className}`.trim();
}

function handleClearAll() {
  if (!ensureAuthenticated('clear saved opportunities')) {
    return;
  }
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
    if (!ensureAuthenticated('modify saved opportunities')) {
      return;
    }
    entries.splice(index, 1);
    saveEntries();
    renderEntries();
  }
}

function renderEntries() {
  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (!currentUser) {
    tableBody.innerHTML = '<tr><td colspan="25" class="text-center text-muted py-4">Sign in to see your saved opportunities.</td></tr>';
    if (clearAllButton) {
      clearAllButton.disabled = true;
    }
    updateDashboard();
    return;
  }

  if (!entries.length) {
    tableBody.innerHTML = '<tr><td colspan="25" class="text-center text-muted py-4">No opportunities yet. Fetch a link and add it to your dashboard.</td></tr>';
    if (clearAllButton) {
      clearAllButton.disabled = true;
    }
    updateDashboard();
    return;
  }

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

  if (clearAllButton) {
    clearAllButton.disabled = entries.length === 0;
  }
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
  if (!currentUser) return;
  const key = storageKeyForUser(ENTRIES_KEY_BASE);
  if (!key) return;
  const serialized = entries.map(({ eligibilityAssessment, ...rest }) => rest);
  try {
    localStorage.setItem(key, JSON.stringify(serialized));
  } catch (error) {
    console.warn('Unable to persist opportunities:', error);
  }
}

function loadEntries() {
  if (!currentUser) return [];
  try {
    const key = storageKeyForUser(ENTRIES_KEY_BASE);
    if (!key) return [];
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to load saved opportunities from localStorage:', error);
    return [];
  }
}

function loadProfile() {
  if (!currentUser) return {};
  try {
    const key = storageKeyForUser(PROFILE_KEY_BASE);
    if (!key) return {};
    const stored = localStorage.getItem(key);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('Unable to load profile from localStorage:', error);
    return {};
  }
}

function saveProfile() {
  if (!currentUser) return;
  const key = storageKeyForUser(PROFILE_KEY_BASE);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(profile));
  } catch (error) {
    console.warn('Unable to save profile to localStorage:', error);
  }
}

function storageKeyForUser(baseKey) {
  if (!currentUser || !currentUser.id) return '';
  return `${baseKey}::${currentUser.id}`;
}

function loadCurrentUser() {
  try {
    const stored = localStorage.getItem(AUTH_STATE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object' && parsed.id) {
      return parsed;
    }
  } catch (error) {
    console.warn('Unable to restore auth state:', error);
  }
  return null;
}

function loadPasskeyRegistry() {
  try {
    const stored = localStorage.getItem(PASSKEY_STORE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.id);
  } catch (error) {
    console.warn('Unable to load saved passkeys:', error);
    return [];
  }
}

function savePasskeyRegistry() {
  try {
    localStorage.setItem(PASSKEY_STORE_KEY, JSON.stringify(passkeyRegistry));
  } catch (error) {
    console.warn('Unable to save passkey registry:', error);
  }
}

function detectPasskeySupport() {
  if (!window.PublicKeyCredential || !navigator.credentials) {
    passkeySupported = false;
    return;
  }
  PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    .then((available) => {
      passkeySupported = Boolean(available) && window.isSecureContext;
    })
    .catch((error) => {
      console.warn('Unable to detect passkey support:', error);
      passkeySupported = false;
    });
}

function initializeGoogleSignIn() {
  if (!googleSignInButtonContainer) return;
  if (!googleClientId) {
    googleSignInButtonContainer.classList.add('d-none');
    if (googleSignInPlaceholder) {
      googleSignInPlaceholder.classList.remove('d-none');
    }
    return;
  }

  const render = () => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      setTimeout(render, 250);
      return;
    }
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: false
    });
    window.google.accounts.id.renderButton(googleSignInButtonContainer, {
      theme: 'filled_blue',
      size: 'large',
      text: 'signin_with',
      shape: 'pill'
    });
    googleSignInButtonContainer.classList.remove('d-none');
    if (googleSignInPlaceholder) {
      googleSignInPlaceholder.classList.add('d-none');
    }
  };

  render();
}

function handleGoogleCredential(response) {
  if (!response || !response.credential) {
    setPasskeyStatus('Google sign-in was not completed.', 'danger');
    return;
  }
  const payload = decodeJwtPayload(response.credential);
  const user = {
    id: `google-${payload.sub || Date.now()}`,
    name: payload.name || payload.given_name || 'Google user',
    email: payload.email || '',
    provider: 'google',
    avatar: payload.picture || ''
  };
  setCurrentUser(user);
  setStatus('Signed in with Google. You can now add opportunities.', 'text-success');
  closeAuthModal();
}

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return {};
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (error) {
    console.warn('Unable to decode Google credential:', error);
    return {};
  }
}

function togglePasskeyRegisterForm() {
  if (!passkeyRegisterForm) return;
  const willShow = passkeyRegisterForm.classList.contains('d-none');
  passkeyRegisterForm.classList.toggle('d-none', !willShow);
  if (passkeyRegisterToggle) {
    passkeyRegisterToggle.setAttribute('aria-expanded', String(willShow));
  }
  if (willShow && passkeyNameInput) {
    passkeyNameInput.focus();
  }
  if (!willShow) {
    passkeyRegisterForm.reset();
  }
  setPasskeyStatus('');
}

async function handlePasskeyRegister(event) {
  event.preventDefault();
  setPasskeyStatus('');
  if (!isPasskeyEnvironmentReady()) {
    return;
  }
  if (passkeySupported === false) {
    setPasskeyStatus('Passkeys are not supported on this device yet.', 'danger');
    return;
  }
  const name = (passkeyNameInput?.value || '').trim();
  const email = (passkeyEmailInput?.value || '').trim();
  if (!name) {
    setPasskeyStatus('Enter your name so the passkey is labeled correctly.', 'danger');
    if (passkeyNameInput) passkeyNameInput.focus();
    return;
  }

  try {
    const challenge = randomBuffer(32);
    const userId = randomBuffer(32);
    const rpId = window.location.hostname || 'localhost';
    const publicKey = {
      challenge,
      rp: { name: 'Opportunity Command Center', id: rpId },
      user: { id: userId, name: email || name, displayName: name },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 }
      ],
      authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
      timeout: 60000,
      attestation: 'none'
    };

    const credential = await navigator.credentials.create({ publicKey });
    if (!credential) {
      setPasskeyStatus('No credential was returned.', 'danger');
      return;
    }

    const credentialId = bufferToBase64Url(credential.rawId);
    if (!passkeyRegistry.find((entry) => entry.id === credentialId)) {
      passkeyRegistry.push({ id: credentialId, name, email });
      savePasskeyRegistry();
    }

    setCurrentUser({ id: `passkey-${credentialId}`, name, email, provider: 'passkey' });
    setStatus('Signed in with your passkey. You can now add opportunities.', 'text-success');
    closeAuthModal();
  } catch (error) {
    console.warn('Passkey registration failed:', error);
    if (error && error.name === 'NotAllowedError') {
      setPasskeyStatus('Passkey registration was cancelled.', 'danger');
    } else {
      setPasskeyStatus('Unable to create a passkey. Try again on a supported device.', 'danger');
    }
  }
}

async function handlePasskeySignIn() {
  setPasskeyStatus('');
  if (!isPasskeyEnvironmentReady()) {
    return;
  }
  if (passkeySupported === false) {
    setPasskeyStatus('Passkeys are not available on this device.', 'danger');
    return;
  }
  if (!passkeyRegistry.length) {
    setPasskeyStatus('No passkeys saved yet. Create one on this device first.', 'danger');
    return;
  }

  try {
    const challenge = randomBuffer(32);
    const allowCredentials = passkeyRegistry.map((record) => ({
      id: base64UrlToBuffer(record.id),
      type: 'public-key',
      transports: ['internal', 'hybrid']
    }));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials,
        timeout: 60000,
        userVerification: 'preferred'
      }
    });

    if (!assertion) {
      setPasskeyStatus('No passkey assertion returned.', 'danger');
      return;
    }

    const credentialId = bufferToBase64Url(assertion.rawId);
    const record = passkeyRegistry.find((item) => item.id === credentialId);
    if (!record) {
      setPasskeyStatus('We could not match that passkey. Try creating a new one.', 'danger');
      return;
    }

    setCurrentUser({
      id: `passkey-${credentialId}`,
      name: record.name || 'Passkey user',
      email: record.email || '',
      provider: 'passkey'
    });
    setStatus('Signed in with your passkey. You can now add opportunities.', 'text-success');
    closeAuthModal();
  } catch (error) {
    console.warn('Passkey sign-in failed:', error);
    if (error && error.name === 'NotAllowedError') {
      setPasskeyStatus('Passkey sign-in was cancelled.', 'danger');
    } else {
      setPasskeyStatus('Unable to sign in with your passkey. Try again.', 'danger');
    }
  }
}

function setPasskeyStatus(message, tone = 'secondary') {
  if (!passkeyStatus) return;
  passkeyStatus.textContent = message || '';
  passkeyStatus.className = `passkey-status text-${tone}`;
}

function isPasskeyEnvironmentReady() {
  if (!window.isSecureContext) {
    setPasskeyStatus('Passkeys require a secure context (HTTPS or localhost).', 'danger');
    return false;
  }
  if (!window.PublicKeyCredential || !navigator.credentials) {
    setPasskeyStatus('This browser does not support passkeys yet.', 'danger');
    return false;
  }
  return true;
}

function randomBuffer(length) {
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return buffer;
}

function bufferToBase64Url(buffer) {
  const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer.buffer || buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBuffer(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const normalized = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  const decoded = atob(normalized);
  const buffer = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i += 1) {
    buffer[i] = decoded.charCodeAt(i);
  }
  return buffer;
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
  if (!ensureAuthenticated('update your profile')) {
    return;
  }
  if (!profileForm) return;
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
  if (!ensureAuthenticated('clear your profile')) {
    return;
  }
  if (!profileForm) return;
  if (!Object.keys(profile).length) {
    profileForm.reset();
    updateEligibilityPreview();
    return;
  }

  const confirmation = confirm('Clear your stored profile details? Eligibility comparisons will reset.');
  if (!confirmation) return;

  profile = {};
  const key = storageKeyForUser(PROFILE_KEY_BASE);
  if (key) {
    localStorage.removeItem(key);
  }
  profileForm.reset();
  updateProfileSummary();
  entries = entries.map(upgradeEntry);
  saveEntries();
  renderEntries();
  updateEligibilityPreview();
}

function updateProfileSummary() {
  if (!profileLastUpdated) return;
  if (!currentUser) {
    profileLastUpdated.textContent = 'Sign in to manage your profile.';
    return;
  }
  if (profile.lastUpdated) {
    const date = new Date(profile.lastUpdated);
    profileLastUpdated.textContent = `Last updated ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
  } else {
    profileLastUpdated.textContent = 'Profile not saved yet.';
  }
}

function updateEligibilityPreview() {
  if (!eligibilityPreview) return;
  if (!currentUser) {
    eligibilityPreview.className = 'eligibility-feedback eligibility-unknown';
    eligibilityPreview.innerHTML = '<strong>Sign in to unlock eligibility guidance.</strong><p class="mb-0">Authenticate to compare opportunity requirements against your saved skills and coursework.</p>';
    eligibilityPreview.classList.remove('d-none');
    return;
  }
  if (!form) return;
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
  if (!currentUser) {
    nextActionsList.innerHTML = '<li class="empty-state">Sign in to surface upcoming next actions.</li>';
    return;
  }
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
  if (!currentUser) {
    eligibilityWatchlist.innerHTML = '<li class="empty-state">Sign in to monitor eligibility gaps and watchlists.</li>';
    return;
  }
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
  if (!currentUser) {
    deadlineRadar.innerHTML = '<li class="empty-state">Sign in to visualize deadlines by urgency.</li>';
    return;
  }
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

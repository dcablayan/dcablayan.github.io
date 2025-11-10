const STORAGE_KEY = 'opportunity-atlas-users';
const CURRENT_USER_KEY = 'opportunity-atlas-current-user';
const GOOGLE_CLIENT_ID =
  window.OPPORTUNITY_ATLAS_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

const storage = {
  getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.error('Failed to parse storage', error);
      return {};
    }
  },
  saveAll(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  getCurrentUserEmail() {
    return localStorage.getItem(CURRENT_USER_KEY);
  },
  setCurrentUserEmail(email) {
    if (email) {
      localStorage.setItem(CURRENT_USER_KEY, email);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },
  getUser(email) {
    const users = this.getAll();
    return users[email] || null;
  },
  upsertUser(email, updater) {
    const users = this.getAll();
    const existing = users[email] || { profile: {}, opportunities: [] };
    const updated = typeof updater === 'function' ? updater(existing) : { ...existing, ...updater };
    users[email] = updated;
    this.saveAll(users);
    return updated;
  },
  getCurrentUser() {
    const email = this.getCurrentUserEmail();
    if (!email) return null;
    return this.getUser(email);
  },
  updateCurrentUser(updater) {
    const email = this.getCurrentUserEmail();
    if (!email) return null;
    return this.upsertUser(email, updater);
  },
  signOut() {
    this.setCurrentUserEmail(null);
  }
};

const toastEl = () => document.getElementById('toast');
let toastTimeout;
function showToast(message, variant = 'default') {
  const toast = toastEl();
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.variant = variant;
  toast.classList.add('active');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('active'), 3200);
}

function decodeJwt(token) {
  const payload = token.split('.')[1];
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  const decoded = decodeURIComponent(
    json
      .split('')
      .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join('')
  );
  return JSON.parse(decoded);
}

function normalizeUrl(url) {
  if (!url) return '';
  try {
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  } catch (error) {
    console.warn('Failed to normalize URL', error);
    return url;
  }
}

function extractDomainRoot(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const parts = host.split('.');
    if (parts.length <= 2) return host;
    return parts.slice(-2).join('.');
  } catch (error) {
    return '';
  }
}

function generateId() {
  if (window.crypto?.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

async function registerPasskey(email, name) {
  if (!window.PublicKeyCredential) {
    throw new Error('Passkeys are not supported in this browser.');
  }

  const userId = crypto.getRandomValues(new Uint8Array(16));
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const publicKey = {
    challenge,
    rp: {
      name: 'Opportunity Atlas',
    },
    user: {
      id: userId,
      name: email,
      displayName: name,
    },
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
    timeout: 60000,
    attestation: 'none',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'preferred',
      requireResidentKey: true,
    },
  };

  const credential = await navigator.credentials.create({ publicKey });
  if (!credential) {
    throw new Error('No credential returned by authenticator.');
  }
  const rawId = arrayBufferToBase64(credential.rawId);
  return { rawId, userId: arrayBufferToBase64(userId) };
}

async function authenticatePasskey(storedCredential) {
  if (!window.PublicKeyCredential) {
    throw new Error('Passkeys are not supported in this browser.');
  }
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const publicKey = {
    challenge,
    timeout: 60000,
    allowCredentials: [
      {
        type: 'public-key',
        id: base64ToArrayBuffer(storedCredential.rawId),
        transports: ['internal'],
      },
    ],
    userVerification: 'preferred',
  };
  const assertion = await navigator.credentials.get({ publicKey });
  if (!assertion) {
    throw new Error('Authentication cancelled.');
  }
  return assertion;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function ensureAuthForDashboard() {
  const page = document.body.dataset.page;
  const currentEmail = storage.getCurrentUserEmail();
  const vaultButton = document.querySelector('[data-go-vault]');
  if (vaultButton) {
    if (currentEmail) {
      vaultButton.disabled = false;
      if (!vaultButton.dataset.bound) {
        vaultButton.addEventListener('click', () => {
          window.location.href = 'vault.html';
        });
        vaultButton.dataset.bound = 'true';
      }
    } else {
      vaultButton.disabled = true;
    }
  }
  if (page === 'dashboard') {
    if (currentEmail) {
      window.location.replace('vault.html');
    } else {
      window.location.href = 'index.html';
    }
    return;
  }
  if (page === 'vault' && !currentEmail) {
    window.location.href = 'index.html';
  }
}

function completeSignIn(account) {
  const email = account.email.toLowerCase();
  const baseProfile = {
    name: account.name,
    email,
    avatar: account.picture || `https://www.gravatar.com/avatar/${email}?d=identicon`,
  };
  const user = storage.upsertUser(email, (existing) => ({
    profile: { ...baseProfile, ...existing.profile },
    opportunities: existing.opportunities || [],
    auth: {
      provider: account.provider,
      rawId: account.rawId || null,
    },
  }));
  storage.setCurrentUserEmail(email);
  showToast(`Welcome back, ${user.profile.name || email}`);
  ensureAuthForDashboard();
  if (document.body.dataset.page === 'auth') {
    setTimeout(() => {
      window.location.href = 'vault.html';
    }, 650);
  } else {
    renderDashboard();
  }
}

function setupGoogleSignIn() {
  const container = document.getElementById('googleSignInButton');
  const alertEl = document.getElementById('authAlert');
  if (!container) return;

  function renderFallback() {
    if (!container) return;
    container.innerHTML = '';
    const button = document.createElement('button');
    button.className = 'btn btn-outline';
    button.textContent = 'Continue with Google (demo)';
    button.addEventListener('click', () => {
      const email = prompt('Enter the Google account email to simulate sign-in');
      if (!email) return;
      const name = email.split('@')[0];
      completeSignIn({ email, name, provider: 'google' });
    });
    container.appendChild(button);
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.textContent = 'Google Identity Services requires a client ID. Using demo sign-in instead.';
    }
  }

  if (!window.google?.accounts?.id) {
    setTimeout(() => {
      if (!window.google?.accounts?.id) {
        renderFallback();
      } else {
        setupGoogleSignIn();
      }
    }, 600);
    return;
  }

  if (GOOGLE_CLIENT_ID.startsWith('YOUR_GOOGLE_CLIENT_ID')) {
    renderFallback();
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => {
      try {
        const payload = decodeJwt(response.credential);
        completeSignIn({
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          provider: 'google',
        });
      } catch (error) {
        console.error('Failed to handle Google sign-in', error);
        showToast('Unable to complete Google sign-in. Try passkey or refresh.', 'danger');
      }
    },
  });
  google.accounts.id.renderButton(container, {
    theme: 'filled_blue',
    shape: 'pill',
    width: 260,
    text: 'signin_with',
  });
}

function setupPasskeyFlows() {
  const signUpForm = document.getElementById('passkeySignUp');
  const signInForm = document.getElementById('passkeySignIn');

  if (signUpForm) {
    signUpForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(signUpForm);
      const name = formData.get('name').trim();
      const email = formData.get('email').trim().toLowerCase();
      try {
        const credential = await registerPasskey(email, name);
        storage.upsertUser(email, (existing) => ({
          profile: {
            name,
            email,
            avatar: existing.profile?.avatar || `https://www.gravatar.com/avatar/${email}?d=identicon`,
          },
          opportunities: existing.opportunities || [],
          auth: {
            provider: 'passkey',
            rawId: credential.rawId,
            userId: credential.userId,
          },
        }));
        storage.setCurrentUserEmail(email);
        showToast('Passkey registered! Redirecting to your vault...', 'success');
        setTimeout(() => (window.location.href = 'vault.html'), 800);
      } catch (error) {
        console.error(error);
        showToast(error.message || 'Unable to create passkey.', 'danger');
      }
    });
  }

  if (signInForm) {
    signInForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(signInForm);
      const email = formData.get('email').trim().toLowerCase();
      const user = storage.getUser(email);
      if (!user || !user.auth?.rawId) {
        showToast('No passkey profile found for that email.', 'danger');
        return;
      }
      try {
        await authenticatePasskey(user.auth);
        completeSignIn({
          email,
          name: user.profile?.name || email,
          picture: user.profile?.avatar,
          provider: 'passkey',
          rawId: user.auth.rawId,
        });
      } catch (error) {
        console.error(error);
        showToast(error.message || 'Unable to verify passkey.', 'danger');
      }
    });
  }
}

function initAuthPage() {
  setupGoogleSignIn();
  setupPasskeyFlows();
  ensureAuthForDashboard();
}

function setupDashboard() {
  ensureAuthForDashboard();
  const signOutBtn = document.getElementById('signOut');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      storage.signOut();
      showToast('Signed out successfully', 'success');
      setTimeout(() => (window.location.href = 'index.html'), 400);
    });
  }
  renderDashboard();
  const addBtn = document.getElementById('addOpportunity');
  if (addBtn) {
    addBtn.addEventListener('click', openOpportunityDialog);
  }
  const statusFilter = document.getElementById('statusFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  statusFilter?.addEventListener('change', renderOpportunityTable);
  priorityFilter?.addEventListener('change', renderOpportunityTable);

  const opportunityForm = document.getElementById('opportunityForm');
  if (opportunityForm) {
    opportunityForm.addEventListener('submit', handleOpportunitySubmit);
  }
  const fetchMetadataBtn = document.getElementById('fetchMetadata');
  fetchMetadataBtn?.addEventListener('click', handleFetchMetadata);
  document.getElementById('cancelOpportunity')?.addEventListener('click', closeOpportunityDialog);
  const organizationField = document.getElementById('opportunityOrganization');
  const validationLabel = document.getElementById('organizationValidation');
  organizationField?.addEventListener('input', () => {
    organizationField.dataset.verified = 'false';
    if (validationLabel) {
      validationLabel.textContent = '';
    }
  });

  const profileForm = document.getElementById('profileForm');
  profileForm?.addEventListener('submit', handleProfileSubmit);
}

function renderDashboard() {
  const userEmail = storage.getCurrentUserEmail();
  if (!userEmail) return;
  const user = storage.getUser(userEmail);
  if (!user) return;

  const chip = document.getElementById('userChip');
  const avatar = document.getElementById('userAvatar');
  const nameEl = document.getElementById('userName');
  if (chip && avatar && nameEl) {
    chip.hidden = false;
    avatar.src = user.profile?.avatar || `https://www.gravatar.com/avatar/${userEmail}?d=identicon`;
    nameEl.textContent = user.profile?.name || userEmail;
  }

  populateProfileForm(user.profile);
  renderMetrics();
  renderDeadlines();
  renderActions();
  renderOpportunityTable();
}

function populateProfileForm(profile = {}) {
  const profileForm = document.getElementById('profileForm');
  if (!profileForm) return;
  profileForm.querySelector('#profileName').value = profile.name || '';
  profileForm.querySelector('#profileEmail').value = profile.email || storage.getCurrentUserEmail() || '';
  profileForm.querySelector('#profileLocation').value = profile.location || '';
  profileForm.querySelector('#profileRemote').value = profile.remotePreference || 'unspecified';
  profileForm.querySelector('#profileSkills').value = profile.skills || '';
  profileForm.querySelector('#profileCourses').value = profile.courses || '';
  updateProfileStatusBadge(profile);
}

function updateProfileStatusBadge(profile = {}) {
  const badge = document.getElementById('profileStatus');
  if (!badge) return;
  const completeness = ['name', 'location', 'skills', 'courses'].filter((key) => (profile[key] || '').trim()).length;
  if (completeness >= 3) {
    badge.textContent = 'Ready';
    badge.dataset.variant = 'success';
  } else if (completeness >= 1) {
    badge.textContent = 'Partial';
    badge.dataset.variant = 'warning';
  } else {
    badge.textContent = 'Incomplete';
    badge.dataset.variant = 'warning';
  }
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const profile = {
    name: data.get('name').trim(),
    email: storage.getCurrentUserEmail(),
    location: data.get('location').trim(),
    remotePreference: data.get('remotePreference'),
    skills: data.get('skills').trim(),
    courses: data.get('courses').trim(),
    avatar: storage.getCurrentUser().profile?.avatar,
  };
  storage.updateCurrentUser((existing) => ({
    ...existing,
    profile: { ...existing.profile, ...profile },
  }));
  showToast('Profile updated', 'success');
  updateProfileStatusBadge(profile);
  renderMetrics();
  renderOpportunityTable();
}

function computeEligibilityScore(opportunity, profile = {}) {
  const skills = (profile.skills || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const courses = (profile.courses || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const tagsText = Array.isArray(opportunity.tags)
    ? opportunity.tags.join(' ')
    : typeof opportunity.tags === 'string'
    ? opportunity.tags
    : '';
  const haystack = [opportunity.eligibility, opportunity.notes, tagsText]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  let skillMatches = [];
  let courseMatches = [];
  if (haystack) {
    skillMatches = skills.filter((skill) => haystack.includes(skill));
    courseMatches = courses.filter((course) => haystack.includes(course));
  }
  const denominator = Math.max(skills.length || 1, 1);
  const score = Math.round(Math.min(100, (skillMatches.length / denominator) * 100));
  const remoteMatch =
    profile.remotePreference && profile.remotePreference !== 'unspecified'
      ? opportunity.remote === profile.remotePreference || opportunity.remote === 'unspecified'
      : true;
  return {
    score,
    skillMatches,
    courseMatches,
    remoteMatch,
  };
}

function renderMetrics() {
  const metricsEl = document.getElementById('metrics');
  if (!metricsEl) return;
  const user = storage.getCurrentUser();
  if (!user) return;

  const total = user.opportunities.length;
  const open = user.opportunities.filter((opp) => opp.status !== 'Offer');
  const now = new Date();
  const nextSeven = open.filter((opp) => {
    if (!opp.deadline) return false;
    const diff = (new Date(opp.deadline) - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;
  const highPriority = open.filter((opp) => opp.priority === 'High').length;
  const needsAction = open.filter((opp) => opp.nextAction && (!opp.nextActionDate || new Date(opp.nextActionDate) <= new Date(now.toDateString()))).length;

  metricsEl.innerHTML = '';
  const metricData = [
    { label: 'Total tracked', value: total },
    { label: 'Due within 7 days', value: nextSeven },
    { label: 'High priority open', value: highPriority },
    { label: 'Next actions ready', value: needsAction },
  ];
  metricData.forEach((metric) => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = `<span>${metric.label}</span><strong>${metric.value}</strong>`;
    metricsEl.appendChild(card);
  });
}

function renderDeadlines() {
  const listEl = document.getElementById('deadlineList');
  const badge = document.getElementById('deadlineBadge');
  if (!listEl) return;
  const user = storage.getCurrentUser();
  if (!user) return;

  const upcoming = user.opportunities
    .filter((opp) => opp.deadline)
    .map((opp) => ({
      ...opp,
      deadlineDate: new Date(opp.deadline),
    }))
    .filter((opp) => !Number.isNaN(opp.deadlineDate))
    .filter((opp) => opp.deadlineDate >= new Date())
    .sort((a, b) => a.deadlineDate - b.deadlineDate)
    .slice(0, 5);

  listEl.innerHTML = '';
  if (upcoming.length === 0) {
    listEl.innerHTML = '<p style="color: var(--text-muted); margin:0;">No deadlines on the horizon.</p>';
    if (badge) {
      badge.textContent = 'Clear skies';
      badge.dataset.variant = 'success';
    }
    return;
  }
  upcoming.forEach((opp) => {
    const diffDays = Math.ceil((opp.deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
    const card = document.createElement('div');
    card.className = 'deadline-card';
    card.innerHTML = `
      <strong>${opp.title}</strong>
      <span>${opp.organization}</span>
      <span class="due">Due in ${diffDays} day${diffDays === 1 ? '' : 's'} (${opp.deadlineDate.toLocaleDateString()})</span>
    `;
    listEl.appendChild(card);
  });
  if (badge) {
    badge.textContent = `${upcoming.length} due soon`;
    badge.dataset.variant = upcoming.length >= 3 ? 'danger' : 'warning';
  }
}

function renderActions() {
  const listEl = document.getElementById('actionList');
  const badge = document.getElementById('actionBadge');
  if (!listEl) return;
  const user = storage.getCurrentUser();
  if (!user) return;
  const actions = user.opportunities
    .filter((opp) => opp.nextAction)
    .map((opp) => ({
      ...opp,
      nextActionDateObj: opp.nextActionDate ? new Date(opp.nextActionDate) : null,
    }))
    .sort((a, b) => {
      if (!a.nextActionDateObj) return 1;
      if (!b.nextActionDateObj) return -1;
      return a.nextActionDateObj - b.nextActionDateObj;
    })
    .slice(0, 5);

  listEl.innerHTML = '';
  if (actions.length === 0) {
    listEl.innerHTML = '<p style="color: var(--text-muted); margin:0;">No next actions scheduled.</p>';
    if (badge) {
      badge.textContent = 'All caught up';
      badge.dataset.variant = 'success';
    }
    return;
  }
  actions.forEach((opp) => {
    const dateLabel = opp.nextActionDateObj ? opp.nextActionDateObj.toLocaleDateString() : 'No date';
    const card = document.createElement('div');
    card.className = 'action-card';
    card.innerHTML = `
      <strong>${opp.nextAction}</strong>
      <span>${opp.title} · ${opp.organization}</span>
      <span style="color: var(--text-muted);">${dateLabel}</span>
    `;
    listEl.appendChild(card);
  });
  if (badge) {
    badge.textContent = `${actions.length} planned`;
    badge.dataset.variant = 'warning';
  }
}

function renderOpportunityTable() {
  const tableBody = document.querySelector('#opportunityTable tbody');
  const emptyState = document.getElementById('emptyState');
  if (!tableBody) return;
  const user = storage.getCurrentUser();
  if (!user) return;
  const profile = user.profile || {};

  const statusFilter = document.getElementById('statusFilter')?.value || 'all';
  const priorityFilter = document.getElementById('priorityFilter')?.value || 'all';

  tableBody.innerHTML = '';
  const filtered = user.opportunities.filter((opp) => {
    const statusMatch = statusFilter === 'all' || opp.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || opp.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  filtered.forEach((opp) => {
    const eligibility = computeEligibilityScore(opp, profile);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div style="display:flex; flex-direction:column;">
          <strong>${opp.title}</strong>
          <a href="${opp.link}" target="_blank" rel="noopener" style="color: var(--primary); font-size:0.8rem;">Open link</a>
        </div>
      </td>
      <td>
        <div style="display:flex; flex-direction:column; gap:0.25rem;">
          <span>${opp.organization}</span>
          ${opp.organizationVerified ? '<span class="badge" data-variant="success">Verified</span>' : '<span class="badge" data-variant="warning">Check name</span>'}
        </div>
      </td>
      <td>${opp.deadline ? new Date(opp.deadline).toLocaleDateString() : '—'}</td>
      <td><span class="status-pill" data-status="${opp.status}">${opp.status}</span></td>
      <td>
        <div style="display:flex; flex-direction:column; gap:0.35rem;">
          <span class="badge" data-variant="${eligibility.score >= 70 ? 'success' : eligibility.score >= 30 ? 'warning' : 'danger'}">${eligibility.score}% fit</span>
          ${eligibility.skillMatches.length ? `<small style="color: var(--text-muted);">Matches: ${eligibility.skillMatches.join(', ')}</small>` : '<small style="color: var(--text-muted);">Update skills for better matching.</small>'}
        </div>
      </td>
      <td><span class="priority-badge" data-priority="${opp.priority}">${opp.priority}</span></td>
      <td>
        <div style="display:flex; flex-direction:column; gap:0.25rem;">
          <span>${opp.nextAction || '—'}</span>
          ${opp.nextActionDate ? `<small style="color: var(--text-muted);">${new Date(opp.nextActionDate).toLocaleDateString()}</small>` : ''}
        </div>
      </td>
      <td>
        <div class="inline-actions">
          <button class="btn btn-outline" data-action="status" data-id="${opp.id}">Update status</button>
          <button class="btn btn-outline" data-action="delete" data-id="${opp.id}">Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  if (emptyState) {
    emptyState.style.display = filtered.length ? 'none' : 'block';
  }

  tableBody.querySelectorAll('button[data-action="delete"]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      if (!id) return;
      if (!confirm('Remove this opportunity?')) return;
      storage.updateCurrentUser((existing) => ({
        ...existing,
        opportunities: existing.opportunities.filter((opp) => opp.id !== id),
      }));
      showToast('Opportunity removed', 'warning');
      renderDashboard();
    });
  });

  tableBody.querySelectorAll('button[data-action="status"]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      if (!id) return;
      const user = storage.getCurrentUser();
      const opportunity = user.opportunities.find((opp) => opp.id === id);
      if (!opportunity) return;
      const nextStatus = prompt(
        'Update status to one of: Not Started, In Progress, Submitted, Interview, Offer',
        opportunity.status
      );
      const allowed = ['Not Started', 'In Progress', 'Submitted', 'Interview', 'Offer'];
      if (!nextStatus || !allowed.includes(nextStatus)) return;
      storage.updateCurrentUser((existing) => ({
        ...existing,
        opportunities: existing.opportunities.map((opp) => (opp.id === id ? { ...opp, status: nextStatus } : opp)),
      }));
      showToast('Status updated', 'success');
      renderDashboard();
    });
  });
}

function openOpportunityDialog() {
  const dialog = document.getElementById('opportunityDialog');
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
    dialog.style.display = 'block';
  }
}

function closeOpportunityDialog() {
  const dialog = document.getElementById('opportunityDialog');
  if (!dialog) return;
  const form = document.getElementById('opportunityForm');
  form?.reset();
  document.getElementById('organizationValidation').textContent = '';
  const organizationField = document.getElementById('opportunityOrganization');
  if (organizationField) organizationField.dataset.verified = 'false';
  if (typeof dialog.close === 'function') {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
    dialog.style.display = 'none';
  }
}

async function handleFetchMetadata() {
  const urlInput = document.getElementById('opportunityLink');
  const organizationField = document.getElementById('opportunityOrganization');
  const titleField = document.getElementById('opportunityTitle');
  const typeField = document.getElementById('opportunityType');
  const alertLabel = document.getElementById('organizationValidation');
  if (!urlInput.value) {
    showToast('Provide a link before fetching details.', 'warning');
    return;
  }
  const normalized = normalizeUrl(urlInput.value);
  try {
    const metadata = await fetchOpportunityMetadata(normalized);
    if (metadata.title && !titleField.value) titleField.value = metadata.title;
    if (metadata.description) {
      const notes = document.getElementById('opportunityNotes');
      if (notes && !notes.value) notes.value = metadata.description;
    }
    if (metadata.type && !typeField.value) typeField.value = metadata.type;
    if (metadata.organization && !organizationField.value) {
      organizationField.value = metadata.organization.name;
    }
    organizationField.dataset.verified = 'false';
    if (metadata.tags?.length) {
      const tagsField = document.getElementById('opportunityTags');
      if (tagsField && !tagsField.value) tagsField.value = metadata.tags.join(', ');
    }
    const verification = verifyOrganization(organizationField.value || metadata.organization?.name, normalized, metadata);
    if (verification) {
      alertLabel.textContent = verification.message;
      alertLabel.style.color = verification.verified ? '#047857' : '#b45309';
      organizationField.dataset.verified = verification.verified ? 'true' : 'false';
    }
    showToast('Metadata synced from link', 'success');
  } catch (error) {
    console.error(error);
    showToast(error.message || 'Unable to fetch metadata.', 'danger');
  }
}

async function fetchOpportunityMetadata(url) {
  const proxyUrl = `https://r.jina.ai/http/${url}`;
  const response = await fetch(proxyUrl, { headers: { 'User-Agent': 'Mozilla/5.0 OpportunityAtlasBot' } });
  if (!response.ok) {
    throw new Error('Link could not be scraped. Paste details manually.');
  }
  const text = await response.text();
  const doc = new DOMParser().parseFromString(text, 'text/html');
  const title = doc.querySelector('meta[property="og:title"]')?.content || doc.querySelector('title')?.textContent || '';
  const description =
    doc.querySelector('meta[name="description"]')?.content ||
    doc.querySelector('meta[property="og:description"]')?.content ||
    '';
  const siteName = doc.querySelector('meta[property="og:site_name"]')?.content || '';
  const keywords = doc.querySelector('meta[name="keywords"]')?.content || '';
  const type = doc.querySelector('meta[property="og:type"]')?.content || '';
  const organizationCandidates = [siteName, extractDomainRoot(url), doc.querySelector('meta[name="author"]')?.content]
    .filter(Boolean)
    .map((entry) => entry.trim())
    .filter((entry, index, array) => array.indexOf(entry) === index);
  const tags = keywords
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 6);

  return {
    title,
    description,
    siteName,
    type,
    tags,
    organization: {
      name: organizationCandidates[0] || extractDomainRoot(url) || '',
      candidates: organizationCandidates,
    },
  };
}

function verifyOrganization(name, url, metadata = {}) {
  if (!name) return null;
  const normalizedName = name.trim().toLowerCase();
  const domain = extractDomainRoot(url);
  const siteName = (metadata.siteName || '').trim().toLowerCase();
  const candidates = metadata.organization?.candidates?.map((c) => c.toLowerCase()) || [];
  const directMatch = Boolean(domain && normalizedName.includes(domain.replace('.com', '')));
  const siteMatch = siteName && normalizedName.includes(siteName.replace('.com', ''));
  const candidateMatch = candidates.some((candidate) => normalizedName.includes(candidate));
  const verified = directMatch || siteMatch || candidateMatch;
  const message = verified
    ? 'Organization matches the source domain.'
    : `Double-check the organization name. Domain hint: ${domain}`;
  return { verified, message };
}

function collectOpportunityForm() {
  const form = document.getElementById('opportunityForm');
  if (!form) return null;
  const data = new FormData(form);
  const tags = (data.get('tags') || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const normalizedLink = normalizeUrl(data.get('link'));
  const organizationVerified =
    form.querySelector('#opportunityOrganization').dataset.verified === 'true';
  return {
    id: generateId(),
    addedOn: new Date().toISOString(),
    link: normalizedLink,
    title: data.get('title').trim(),
    organization: data.get('organization').trim(),
    organizationVerified,
    opportunityType: data.get('opportunityType').trim(),
    tags,
    location: data.get('location').trim(),
    remote: data.get('remote'),
    deadline: data.get('deadline') || null,
    programDates: data.get('programDates').trim(),
    duration: data.get('duration').trim(),
    compensation: data.get('compensation').trim(),
    eligibility: data.get('eligibility').trim(),
    materials: data.get('materials').trim(),
    applyLink: normalizeUrl(data.get('applyLink')),
    contactEmail: data.get('contactEmail').trim(),
    source: data.get('source').trim(),
    notes: data.get('notes').trim(),
    status: data.get('status'),
    priority: data.get('priority'),
    nextAction: data.get('nextAction').trim(),
    nextActionDate: data.get('nextActionDate') || null,
  };
}

function handleOpportunitySubmit(event) {
  event.preventDefault();
  const opportunity = collectOpportunityForm();
  if (!opportunity) return;
  const profile = storage.getCurrentUser()?.profile || {};
  const eligibility = computeEligibilityScore(opportunity, profile);
  opportunity.eligibilityScore = eligibility;
  storage.updateCurrentUser((existing) => ({
    ...existing,
    opportunities: [opportunity, ...existing.opportunities],
  }));
  showToast('Opportunity saved', 'success');
  closeOpportunityDialog();
  renderDashboard();
}

function hydrateDialogDefaults() {
  const dialog = document.getElementById('opportunityDialog');
  if (!dialog) return;
  dialog.addEventListener('close', () => {
    const form = document.getElementById('opportunityForm');
    form?.reset();
    document.getElementById('organizationValidation').textContent = '';
    const organizationField = document.getElementById('opportunityOrganization');
    if (organizationField) organizationField.dataset.verified = 'false';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  ensureAuthForDashboard();
  hydrateDialogDefaults();
  const page = document.body.dataset.page;
  if (page === 'auth') {
    initAuthPage();
  } else if (page === 'dashboard' || page === 'vault') {
    setupDashboard();
  }
});

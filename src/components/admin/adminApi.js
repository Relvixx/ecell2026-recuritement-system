'use client';

const TOKEN_KEY = 'adminToken';
const USER_KEY = 'adminUser';

export class AdminAuthError extends Error {
  constructor(message = 'Your admin session has ended.') {
    super(message);
    this.name = 'AdminAuthError';
  }
}

export function getAdminToken() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(TOKEN_KEY) || '';
}

export function getAdminUser() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setAdminSession(token, admin) {
  window.localStorage.setItem(TOKEN_KEY, token);
  if (admin) window.localStorage.setItem(USER_KEY, JSON.stringify(admin));
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

async function responsePayload(response) {
  const type = response.headers.get('content-type') || '';
  if (type.includes('application/json')) return response.json();
  return { error: 'The server returned an unexpected response.' };
}

export async function adminFetch(path, options = {}) {
  const token = getAdminToken();
  if (!token) throw new AdminAuthError();
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {})
    }
  });
  if (response.status === 401 || response.status === 403) {
    clearAdminSession();
    throw new AdminAuthError();
  }
  const data = await responsePayload(response);
  if (!response.ok) {
    const error = new Error(typeof data?.error === 'string' ? data.error : 'Request failed.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function adminFetchBlob(path) {
  const token = getAdminToken();
  if (!token) throw new AdminAuthError();
  const response = await fetch(path, { headers: { Authorization: `Bearer ${token}` } });
  if (response.status === 401 || response.status === 403) {
    clearAdminSession();
    throw new AdminAuthError();
  }
  if (!response.ok) throw new Error('Could not export applications.');
  return { blob: await response.blob(), disposition: response.headers.get('content-disposition') || '' };
}

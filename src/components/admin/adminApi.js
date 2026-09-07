'use client';

const USER_KEY = 'adminUser';

export class AdminAuthError extends Error {
  constructor(message = 'Your admin session has ended.') {
    super(message);
    this.name = 'AdminAuthError';
  }
}

export function getAdminUser() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.sessionStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setAdminSession(admin) {
  window.localStorage.removeItem('adminToken');
  window.localStorage.removeItem(USER_KEY);
  if (admin) window.sessionStorage.setItem(USER_KEY, JSON.stringify(admin));
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('adminToken');
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

export async function fetchAdminProfile() {
  const response = await fetch('/api/auth/me', {
    credentials: 'include',
    cache: 'no-store'
  });

  if (response.status === 401 || response.status === 403) {
    clearAdminSession();
    throw new AdminAuthError();
  }

  const data = await responsePayload(response);

  if (!response.ok) {
    throw new Error(typeof data?.error === 'string' ? data.error : 'Request failed.');
  }

  setAdminSession(data.admin);
  return data.admin;
}

async function responsePayload(response) {
  const type = response.headers.get('content-type') || '';
  if (type.includes('application/json')) return response.json();
  return { error: 'The server returned an unexpected response.' };
}

export async function adminFetch(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
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
  const response = await fetch(path, { credentials: 'include' });
  if (response.status === 401 || response.status === 403) {
    clearAdminSession();
    throw new AdminAuthError();
  }
  if (!response.ok) throw new Error('Could not export applications.');
  return { blob: await response.blob(), disposition: response.headers.get('content-disposition') || '' };
}

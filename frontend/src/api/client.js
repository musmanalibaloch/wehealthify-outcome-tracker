const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

export async function getTestCredentials() {
  const res = await fetch(`${BASE}/api/auth/test-credentials`);
  if (!res.ok) throw new Error('Failed to load test credentials');
  return res.json();
}

export async function login(username, password) {
  let res;
  try {
    res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  } catch (err) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error(`Cannot reach server at ${BASE}. Is the backend running?`);
    }
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function getOutcomes() {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${BASE}/api/outcomes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load outcomes');
  return data;
}

export async function createOutcome(payload) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${BASE}/api/outcomes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.details?.[0]?.msg || 'Failed to create outcome');
  return data;
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const DEFAULT_CREDENTIALS = [
  {
    clinicName: 'Sunrise Physical Therapy',
    users: [
      { username: 'sarah@sunrise', password: 'sunrise123' },
      { username: 'mike@sunrise', password: 'sunrise123' },
    ],
  },
  {
    clinicName: 'Downtown Wellness Clinic',
    users: [
      { username: 'jane@downtown', password: 'downtown123' },
      { username: 'david@downtown', password: 'downtown123' },
    ],
  },
];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(e) {
    e.preventDefault();
    setValidationError('');
    const u = username.trim();
    const p = password;
    if (!u) {
      setValidationError('Username is required');
      return;
    }
    if (!p) {
      setValidationError('Password is required');
      return;
    }
    const ok = await login(u, p);
    if (ok) navigate(from, { replace: true });
  }

  function fillCreds(u, p) {
    setUsername(u);
    setPassword(p);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>WeHealthify</h1>
        <p className="subtitle">Patient Outcome Tracker</p>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. sarah@sunrise"
              autoComplete="username"
              disabled={loading}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              disabled={loading}
            />
          </label>
          {(validationError || error) && (
            <p className="error">{validationError || error}</p>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="test-credentials">
          <h3>Default credentials</h3>
          <p className="test-credentials-hint">Click a row to fill the form.</p>
          {DEFAULT_CREDENTIALS.map(({ clinicName, users }) => (
            <div key={clinicName} className="credential-clinic">
              <div className="credential-clinic-name">{clinicName}</div>
              {users.map(({ username: u, password: p }) => (
                <button
                  key={u}
                  type="button"
                  className="credential-row"
                  onClick={() => fillCreds(u, p)}
                >
                  <span className="credential-username">{u}</span>
                  <span className="credential-password">{p}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

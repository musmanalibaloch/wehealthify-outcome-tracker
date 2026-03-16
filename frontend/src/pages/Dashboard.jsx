import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOutcomes, createOutcome } from '../api/client';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [outcomes, setOutcomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    patientIdentifier: '',
    painScore: 5,
    mobilityScore: 5,
    dateRecorded: new Date().toISOString().slice(0, 10),
  });
  const [fieldErrors, setFieldErrors] = useState({});

  async function loadOutcomes() {
    setLoading(true);
    setError(null);
    try {
      const data = await getOutcomes();
      setOutcomes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOutcomes();
  }, []);

  function validateForm() {
    const errs = {};
    const patient = form.patientIdentifier.trim();
    if (!patient) errs.patientIdentifier = 'Patient identifier is required';
    const pain = Number(form.painScore);
    if (Number.isNaN(pain) || pain < 1 || pain > 10) errs.painScore = 'Pain score must be between 1 and 10';
    const mobility = Number(form.mobilityScore);
    if (Number.isNaN(mobility) || mobility < 1 || mobility > 10) errs.mobilityScore = 'Mobility score must be between 1 and 10';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    if (!validateForm()) return;
    setSubmitLoading(true);
    try {
      await createOutcome({
        patientIdentifier: form.patientIdentifier.trim(),
        painScore: Number(form.painScore),
        mobilityScore: Number(form.mobilityScore),
        dateRecorded: form.dateRecorded ? new Date(form.dateRecorded).toISOString() : undefined,
      });
      setForm({ patientIdentifier: '', painScore: 5, mobilityScore: 5, dateRecorded: new Date().toISOString().slice(0, 10) });
      await loadOutcomes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Outcome Tracker</h1>
        <div className="user-row">
          <span className="user-name">{user?.username}</span>
          <button type="button" className="btn-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="outcome-form-section">
          <h2>Record outcome</h2>
          <form onSubmit={handleSubmit} className="outcome-form">
            <label>
              Patient identifier
              <input
                type="text"
                value={form.patientIdentifier}
                onChange={(e) => {
                  setForm((f) => ({ ...f, patientIdentifier: e.target.value }));
                  if (fieldErrors.patientIdentifier) setFieldErrors((e) => ({ ...e, patientIdentifier: '' }));
                }}
                placeholder="Name or ID"
                disabled={submitLoading}
                className={fieldErrors.patientIdentifier ? 'input-error' : ''}
              />
              {fieldErrors.patientIdentifier && (
                <span className="field-error">{fieldErrors.patientIdentifier}</span>
              )}
            </label>
            <div className="form-row">
              <label>
                Pain (1–10)
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.painScore}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, painScore: e.target.value }));
                    if (fieldErrors.painScore) setFieldErrors((err) => ({ ...err, painScore: '' }));
                  }}
                  disabled={submitLoading}
                  className={fieldErrors.painScore ? 'input-error' : ''}
                />
                {fieldErrors.painScore && <span className="field-error">{fieldErrors.painScore}</span>}
              </label>
              <label>
                Mobility (1–10)
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.mobilityScore}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, mobilityScore: e.target.value }));
                    if (fieldErrors.mobilityScore) setFieldErrors((err) => ({ ...err, mobilityScore: '' }));
                  }}
                  disabled={submitLoading}
                  className={fieldErrors.mobilityScore ? 'input-error' : ''}
                />
                {fieldErrors.mobilityScore && <span className="field-error">{fieldErrors.mobilityScore}</span>}
              </label>
            </div>
            <label htmlFor="outcome-date-recorded">
              Date recorded
              <div className="date-input-wrapper">
                <input
                  id="outcome-date-recorded"
                  type="date"
                  value={form.dateRecorded}
                  onChange={(e) => setForm((f) => ({ ...f, dateRecorded: e.target.value }))}
                  disabled={submitLoading}
                  aria-label="Date recorded"
                />
                <span className="date-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="16" rx="2" ry="2" />
                    <line x1="8" y1="3" x2="8" y2="7" />
                    <line x1="16" y1="3" x2="16" y2="7" />
                    <line x1="3" y1="11" x2="21" y2="11" />
                  </svg>
                </span>
              </div>
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" disabled={submitLoading}>
              {submitLoading ? 'Saving…' : 'Save outcome'}
            </button>
          </form>
        </section>

        <section className="outcomes-list-section">
          <h2>Outcomes</h2>
          {loading ? (
            <p className="muted">Loading…</p>
          ) : outcomes.length === 0 ? (
            <p className="muted">No outcomes yet. Add one above.</p>
          ) : (
            <ul className="outcomes-list">
              {outcomes.map((o) => (
                <li key={o._id} className="outcome-item">
                  <div className="outcome-patient">{o.patientIdentifier}</div>
                  <div className="outcome-meta">
                    <span className="outcome-scores">
                      <span className="score-pill">Pain {o.painScore}</span>
                      <span className="score-pill">Mobility {o.mobilityScore}</span>
                    </span>
                    <span className="outcome-date">
                      {new Date(o.dateRecorded).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

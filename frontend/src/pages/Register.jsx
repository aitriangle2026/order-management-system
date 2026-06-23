import { useState } from 'react';
import { register } from '../api/auth';
import { LeftPanel } from './Login';
import './auth.css';

export default function Register({ onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(username, password);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <LeftPanel />

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-shine" />

          <div className="auth-card-logo">
            <div className="auth-card-logo-mark">
              <i className="ti ti-receipt" aria-hidden="true" />
            </div>
            <div>
              <div className="auth-card-logo-name">Order Desk</div>
              <div className="auth-card-logo-sub">Workspace portal</div>
            </div>
          </div>

          {success ? (
            <SuccessState onBack={onBack} />
          ) : (
            <RegisterForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              error={error}
              loading={loading}
              onSubmit={handleSubmit}
              onBack={onBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Register form ────────────────────────────────────────────── */

function RegisterForm({
  username, setUsername,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  error, loading, onSubmit, onBack,
}) {
  return (
    <>
      <h1 className="auth-form-title">Create account</h1>
      <p className="auth-form-sub">Set up your Order Desk access</p>

      {error && (
        <div className="auth-error">
          <i className="ti ti-alert-circle" aria-hidden="true" />
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="auth-field">
          <div className="auth-field-label">USERNAME</div>
          <div className="auth-inp-wrap">
            <input
              className="auth-inp"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <i className="ti ti-user auth-inp-icon" aria-hidden="true" />
          </div>
        </div>

        <div className="auth-field">
          <div className="auth-field-label">PASSWORD</div>
          <div className="auth-inp-wrap">
            <input
              className="auth-inp"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <i className="ti ti-lock auth-inp-icon" aria-hidden="true" />
          </div>
        </div>

        <p className="auth-pass-hint">
          Use letters, numbers and a symbol for stronger security.
        </p>

        <div className="auth-field">
          <div className="auth-field-label">CONFIRM PASSWORD</div>
          <div className="auth-inp-wrap">
            <input
              className="auth-inp"
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <i className="ti ti-lock-check auth-inp-icon" aria-hidden="true" />
          </div>
        </div>

        <div className="auth-btn-spacer" />

        <button
          type="submit"
          className="auth-btn-primary"
          disabled={loading}
        >
          <i className="ti ti-user-plus" aria-hidden="true" />
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="auth-divider">
        <div className="auth-divider-line" />
        <span className="auth-divider-text">already a member?</span>
        <div className="auth-divider-line" />
      </div>

      <button className="auth-btn-outline" onClick={onBack}>
        <i className="ti ti-arrow-left" aria-hidden="true" />
        Back to sign in
      </button>

      <div className="auth-step-dots">
        <div className="auth-dot" />
        <div className="auth-dot active" />
        <div className="auth-dot" />
      </div>
    </>
  );
}

/* ── Success state ────────────────────────────────────────────── */

function SuccessState({ onBack }) {
  return (
    <>
      <div className="auth-success-wrap">
        <div className="auth-success-icon">
          <i className="ti ti-circle-check" aria-hidden="true" />
        </div>
        <p className="auth-success-title">Account created!</p>
        <p className="auth-success-sub">
          You're all set. Sign in to access your Order Desk workspace.
        </p>
        <button className="auth-btn-primary" onClick={onBack}>
          <i className="ti ti-login" aria-hidden="true" />
          Go to sign in
        </button>
      </div>

      <div className="auth-step-dots">
        <div className="auth-dot" />
        <div className="auth-dot" />
        <div className="auth-dot active" />
      </div>
    </>
  );
}
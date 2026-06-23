import { useState } from 'react';
import { login } from '../api/auth';
import tclLogo from '../assets/a2.png';

import './auth.css';

export default function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      onLogin();
    } catch {
      setError('Invalid username or password.');
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
              <img src={tclLogo} alt="TCL" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            </div>
            <div>
              <div className="auth-card-logo-name">Order Desk</div>
              <div className="auth-card-logo-sub">Triangle Creative Lab</div>
            </div>
          </div>

          <h1 className="auth-form-title">Sign in</h1>
          <p className="auth-form-sub">Enter your credentials to continue</p>

          {error && (
            <div className="auth-error">
              <i className="ti ti-alert-circle" aria-hidden="true" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <div className="auth-field-label">USERNAME</div>
              <div className="auth-inp-wrap">
                <input
                  className="auth-inp"
                  type="text"
                  placeholder="Username or email"
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
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <i className="ti ti-lock auth-inp-icon" aria-hidden="true" />
              </div>
            </div>

            <div className="auth-btn-spacer" />

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              <i className="ti ti-login" aria-hidden="true" />
              {loading ? 'Signing in…' : 'Sign in to workspace'}
            </button>
          </form>

          <div className="auth-step-dots">
            <div className="auth-dot active" />
            <div className="auth-dot" />
            <div className="auth-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeftPanel() {
  return (
    <div className="auth-left">
      <div className="auth-shape auth-shape-1" />
      <div className="auth-shape auth-shape-2" />
      <div className="auth-shape auth-shape-3" />
      <div className="auth-shape auth-shape-4" />
      <div className="auth-shape auth-shape-5" />

      <div className="auth-left-content">
        <div className="auth-logo-row">
          <div className="auth-logo-mark">
            <img src={tclLogo} alt="Triangle Creative Lab" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          </div>
          <span className="auth-logo-name">Triangle Creative Lab</span>
        </div>

        <h2 className="auth-hero-heading">
          Your creative<br />ops, simplified.
        </h2>
        <p className="auth-hero-sub">
          One workspace to manage every job, client and deadline — built for the TCL team.
        </p>

        {/* Feature highlight cards — 3×2 square grid */}
        <div className="auth-feature-grid">
          {[
            { icon: 'ti-clipboard-list', title: 'Job Tracking',      desc: 'Real-time status on every active order.'  },
            { icon: 'ti-users',          title: 'Client Management', desc: 'Contacts and history all in one place.'   },
            { icon: 'ti-chart-bar',      title: 'Revenue Insights',  desc: 'Track billing and team performance.'      },
            { icon: 'ti-file-invoice',   title: 'Order Desk',        desc: 'All jobs in one clean workspace.'         },
            { icon: 'ti-shield-check',   title: 'Role Access',       desc: 'Secure admin and staff controls.'         },
          ].map((f) => (
            <div className="auth-feature-card" key={f.title}>
              <div className="auth-feature-icon">
                <i className={`ti ${f.icon}`} aria-hidden="true" />
              </div>
              <div className="auth-feature-text">
                <div className="auth-feature-title">{f.title}</div>
                <div className="auth-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
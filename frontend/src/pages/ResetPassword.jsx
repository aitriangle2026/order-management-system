import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import tclLogo from "../assets/a2.png";
import "./auth.css";
import { LeftPanel } from "./Login";

const API = "https://order-management-system-production-72c4.up.railway.app/api/auth";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/reset-password/${token}`,
        {
          password,
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset failed."
      );
    }

    setLoading(false);
  };

  return (
    <div className="auth-root">

      <LeftPanel />

      <div className="auth-right">

        <div className="auth-card">
          <div className="auth-card-shine" />
          <div className="auth-card-logo">
            <div className="auth-card-logo-mark">
              <img
                src={tclLogo}
                alt="logo"
                style={{
                  width: 22,
                  height: 22
                }}
              />
            </div>

            <div>
              <div className="auth-card-logo-name">
                Order Desk
              </div>

              <div className="auth-card-logo-sub">
                Triangle Creative Lab
              </div>
            </div>
          </div>

          <h1 className="auth-form-title">
            Reset Password
          </h1>

          <p className="auth-form-sub">
            Enter your new password.
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {message && (
            <div
              style={{
                background: "#e8fff2",
                color: "#0f9d58",
                padding: 12,
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="auth-field">
              <div className="auth-field-label">
                NEW PASSWORD
              </div>

              <div className="auth-inp-wrap">

    <input
        className="auth-inp"
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
    />

    <i className="ti ti-lock auth-inp-icon"></i>

</div>
            </div>

            <div className="auth-field">
              <div className="auth-field-label">
                CONFIRM PASSWORD
              </div>

              <div className="auth-inp-wrap">

    <input
        className="auth-inp"
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e)=>setConfirmPassword(e.target.value)}
    />

    <i className="ti ti-lock auth-inp-icon"></i>

</div>
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Reset Password"}
            </button>

          </form>

          <div
            style={{
              marginTop: 25,
              textAlign: "center",
            }}
          >
            <Link to="/">
              Back to Login
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
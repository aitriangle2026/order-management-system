import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth";
import { LeftPanel } from "./Login";
import tclLogo from "../assets/a2.png";
import "./auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setSuccess("");
  setError("");

  try {
    const data = await forgotPassword(email);

    setSuccess(data.message);

    setEmail("");

  } catch (err) {

    setError(
      err.response?.data?.message ||
      "Something went wrong."
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
              alt="TCL"
              style={{
                width:22,
                height:22,
                objectFit:"contain"
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
          Forgot Password
        </h1>

        <p className="auth-form-sub">
          Enter your email address and we'll send you a password reset link.
        </p>

        {error && (
  <div className="auth-error">
    {error}
  </div>
)}

{success && (
  <div className="auth-success">
    {success}
  </div>
)}

        <form onSubmit={handleSubmit}>

          <div className="auth-field">

            <div className="auth-field-label">
              EMAIL
            </div>

            <div className="auth-inp-wrap">

              <input
                className="auth-inp"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />

              <i
                className="ti ti-mail auth-inp-icon"
              />

            </div>

          </div>

          <div className="auth-btn-spacer" />

          <button
            type="submit"
            className="auth-btn-primary"
            disabled={loading}
          >

            {loading
              ? "Sending..."
              : "Send Reset Link"}

          </button>

        </form>

        <div
          style={{
            marginTop:20,
            textAlign:"center"
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
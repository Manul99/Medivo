import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      await loginUser(
        email.trim(),
        password,
      );

      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Login failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Login failed.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-brand">

          <div
            className="brand-mark"
            aria-hidden="true"
          >
              <img
              src="/medivo-logo.png"
              alt="Medivo Logo"
              />
          </div>

          <div>
            <div className="brand-name">
              Medivo
            </div>

            <div className="brand-subtitle">
              Smart medicine box
            </div>
          </div>

        </div>

        <h1>
          Welcome back
        </h1>

        <p className="auth-subtitle">
          Sign in to manage your medicine box.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter email address"
              disabled={loading}
              autoComplete="email"
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              disabled={loading}
              autoComplete="current-password"
            />

          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create an account
          </Link>

        </div>

      </div>

    </div>
  );
}
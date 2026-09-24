import { useState } from "react";
import type { FormEvent } from "react";
import { registerUser } from "../services/authService";
import { Link } from "react-router-dom";

interface RegisterProps {
  onRegistered?: () => void;
}

export default function Register({
  onRegistered,
}: RegisterProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [boxId, setBoxId] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!boxId.trim()) {
  setError("Medicine Box ID / MAC address is required.");
  return;
}

    const normalizedBoxId = boxId
      .trim()
      .toUpperCase();

    const macAddressRegex =
      /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;

    if (!macAddressRegex.test(normalizedBoxId)) {
      setError(
        "Invalid Box ID / MAC address. Example: 68:09:47:28:0E:B0"
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const profile = await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
        boxId: normalizedBoxId,
      });

      setSuccess(
        `Account created successfully for ${profile.firstName} ${profile.lastName}.`
      );

      setPassword("");
      setConfirmPassword("");

      onRegistered?.();
    } catch (error: unknown) {
      console.error("Registration failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Registration failed.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Account</h1>

        <p className="register-subtitle">
          Create your Medicine Monitor account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                placeholder="Enter first name"
                disabled={loading}
                autoComplete="given-name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                placeholder="Enter last name"
                disabled={loading}
                autoComplete="family-name"
              />
            </div>
          </div>

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
            <label htmlFor="phoneNumber">
              Phone Number
            </label>

            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(event) =>
                setPhoneNumber(event.target.value)
              }
              placeholder="Enter phone number"
              disabled={loading}
              autoComplete="tel"
            />
          </div>

        <div className="form-group">
          <label htmlFor="boxId">
            Medicine Box ID / MAC Address
          </label>

          <input
            id="boxId"
            type="text"
            value={boxId}
            onChange={(event) =>
              setBoxId(event.target.value.toUpperCase())
            }
            placeholder="68:09:47:28:0E:B0"
            disabled={loading}
            autoComplete="off"
            maxLength={17}
          />

          <small>
            Enter the MAC address shown on your Medicine Monitor box.
          </small>
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
              placeholder="Create password"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm password"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {success && (
            <div className="form-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>
        <div className="auth-footer">

        <span>
          Already have an account?
        </span>

        <Link to="/login">
          Sign in
        </Link>

      </div>
      </div>
    </div>
  );
}
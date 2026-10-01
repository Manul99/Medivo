import { useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
} from "../services/profileService";

import type {
  UserProfile,
  BloodType,
} from "../interfaces/user.interface";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";



const BLOOD_TYPES: BloodType[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

function formatDateForInput(date: string | null): string {
  if (!date) {
    return "";
  }

  return date.substring(0, 10);
}

export default function Profile() {
  const [profile, setProfile] =
  useState<UserProfile | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodType, setBloodType] = useState<BloodType | "">("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getMyProfile();

      setProfile(data);

      setFirstName(data.firstName);
      setLastName(data.lastName);
      setPhoneNumber(data.phoneNumber || "");
      setDateOfBirth(formatDateForInput(data.dateOfBirth));
      setBloodType(data.bloodType || "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    if (!profile) {
      return;
    }

    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setPhoneNumber(profile.phoneNumber || "");
    setDateOfBirth(
      formatDateForInput(profile.dateOfBirth)
    );
    setBloodType(profile.bloodType || "");

    setError("");
    setSuccessMessage("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!dateOfBirth) {
      setError("Date of birth is required.");
      return;
    }

    if (!bloodType) {
      setError("Blood type is required.");
      return;
    }

    try {
      setIsSaving(true);

      const updatedProfile = await updateMyProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        dateOfBirth,
        bloodType: bloodType as BloodType,
      });

      setProfile(updatedProfile);

      setFirstName(updatedProfile.firstName);
      setLastName(updatedProfile.lastName);
      setPhoneNumber(updatedProfile.phoneNumber || "");
      setDateOfBirth(
        formatDateForInput(updatedProfile.dateOfBirth)
      );
      setBloodType(updatedProfile.bloodType || "");

      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  const handleLogout = async () => {
  try {
    await logoutUser();
  } finally {
    navigate("/login");
  }
};

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-loading">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      
        {/* Topbar */}
   {/* Topbar */}
{/* Topbar */}
<header className="topbar">

  {/* Brand */}
  <button
    type="button"
    className="brand"
    onClick={() => navigate("/dashboard")}
    aria-label="Go to dashboard"
  >
    <span className="brand-mark">
      <img
        src="/medivo-logo.png"
        alt="Medivo"
      />
    </span>

    <span>
      <div className="brand-name">
        Medivo
      </div>

      <div className="brand-subtitle">
        Smart medicine box
      </div>
    </span>
  </button>


  {/* Desktop Actions */}
  <div className="desktop-topbar-actions">

    <div className="connection-status">
      <span className="status-dot" />
      Box ready
    </div>

    <button
      type="button"
      className="topbar-nav-button"
      onClick={() => navigate("/medication-history")}
    >
      Medicine History
    </button>

    <button
      type="button"
      className="topbar-nav-button"
      onClick={() => navigate("/medical-documents")}
    >
      Medical Documents
    </button>

    <button
      type="button"
      className="topbar-nav-button"
      onClick={() => navigate("/profile")}
    >
      Profile
    </button>

    <button
      type="button"
      className="topbar-logout-button"
      onClick={handleLogout}
    >
      Logout
    </button>

  </div>


  {/* Mobile Hamburger */}
  <button
    type="button"
    className="mobile-menu-button"
    aria-label={
      isMobileMenuOpen
        ? "Close menu"
        : "Open menu"
    }
    aria-expanded={isMobileMenuOpen}
    onClick={() =>
      setIsMobileMenuOpen(
        (current) => !current
      )
    }
  >
    <span />
    <span />
    <span />
  </button>


  {/* Mobile Menu */}
  {isMobileMenuOpen && (
    <div className="mobile-topbar-menu">

      <div className="mobile-connection-status">
        <span className="status-dot" />
        Box ready
      </div>

      <button
        type="button"
        onClick={() => {
          setIsMobileMenuOpen(false);
          navigate("/medication-history");
        }}
      >
        Medicine History
      </button>

      <button
        type="button"
        onClick={() => {
          setIsMobileMenuOpen(false);
          navigate("/medical-documents");
        }}
      >
        Medical Documents
      </button>

      <button
        type="button"
        onClick={() => {
          setIsMobileMenuOpen(false);
          navigate("/profile");
        }}
      >
        Profile
      </button>

      <button
        type="button"
        className="mobile-logout-button"
        onClick={async () => {
          setIsMobileMenuOpen(false);
          await handleLogout();
        }}
      >
        Logout
      </button>

    </div>
  )}
</header>

    {/* Profile Content */}
    <main className="profile-content">

      <button
        type="button"
        className="back-to-dashboard-button"
        onClick={() => navigate("/dashboard")}
      >
        <span aria-hidden="true">
          ←
        </span>

        Back to Dashboard
      </button>

      
      <div className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p>
            Manage your personal information and medical details.
          </p>
        </div>
      </div>

      <div className="profile-card">
        <form onSubmit={handleSubmit}>
          <div className="profile-section">
            <div className="profile-section-header">
              <h2>Personal Information</h2>
              <p>
                Keep your personal information up to date.
              </p>
            </div>

            <div className="profile-form-grid">
              <div className="profile-form-group">
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
                  maxLength={100}
                  disabled={isSaving}
                />
              </div>

              <div className="profile-form-group">
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
                  maxLength={100}
                  disabled={isSaving}
                />
              </div>

              <div className="profile-form-group">
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
                  maxLength={30}
                  disabled={isSaving}
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  readOnly
                />

                <span className="profile-readonly-text">
                  Email cannot be changed.
                </span>
              </div>
            </div>
          </div>

          <div className="profile-divider" />

          <div className="profile-section">
            <div className="profile-section-header">
              <h2>Medical Information</h2>
              <p>
                These details help Medivo provide the correct
                information about you.
              </p>
            </div>

            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label htmlFor="dateOfBirth">
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) =>
                    setDateOfBirth(event.target.value)
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="age">
                  Age
                </label>

                <input
                  id="age"
                  type="text"
                  value={
                    profile?.age !== null &&
                    profile?.age !== undefined
                      ? `${profile.age} years`
                      : "Not available"
                  }
                  disabled
                  readOnly
                />

                <span className="profile-readonly-text">
                  Age is calculated automatically from your
                  date of birth.
                </span>
              </div>

              <div className="profile-form-group">
                <label htmlFor="bloodType">
                  Blood Type
                </label>

                <select
                  id="bloodType"
                  value={bloodType}
                  onChange={(event) =>
                    setBloodType(
                      event.target.value as BloodType
                    )
                  }
                  disabled={isSaving}
                >
                  <option value="">
                    Select blood type
                  </option>

                  {BLOOD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="profile-message profile-error">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="profile-message profile-success">
              {successMessage}
            </div>
          )}

          <div className="profile-actions">
            <button
              type="button"
              className="profile-cancel-button"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="profile-save-button"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
  );
}
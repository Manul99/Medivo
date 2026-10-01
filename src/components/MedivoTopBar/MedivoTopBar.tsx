import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import "./MedivoTopBar.css";

interface MedivoTopBarProps {
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
}

export default function MedivoTopBar({
  showBackButton = false,
  backTo = "/dashboard",
  backLabel = "Back to Dashboard",
}: MedivoTopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigateAndClose = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="medivo-topbar">
        <div className="medivo-topbar-inner">

          {/* Brand */}
          <button
            type="button"
            className="medivo-topbar-brand"
            onClick={() => navigate("/dashboard")}
            aria-label="Go to dashboard"
          >
            <div className="medivo-topbar-logo">
              <img
                src="/medivo-icon.png"
                alt="Medivo"
              />
            </div>

            <div className="medivo-topbar-brand-text">
              <span className="medivo-topbar-brand-name">
                Medivo
              </span>

              <span className="medivo-topbar-brand-subtitle">
                Smart medicine box
              </span>
            </div>
          </button>

          {/* Desktop actions */}
          <div className="medivo-topbar-actions">

            <div className="medivo-connection-status">
              <span className="medivo-status-dot" />
              <span>Box ready</span>
            </div>

            <button
              type="button"
              className={`medivo-nav-button ${
                location.pathname === "/medication-history"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                navigate("/medication-history")
              }
            >
              Medicine History
            </button>

            <button
              type="button"
              className={`medivo-nav-button ${
                location.pathname === "/medical-documents"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                navigate("/medical-documents")
              }
            >
              Medical Documents
            </button>

            <button
              type="button"
              className={`medivo-nav-button ${
                location.pathname === "/profile"
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>

            <button
              type="button"
              className="medivo-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={`medivo-mobile-menu-button ${
              isMobileMenuOpen ? "open" : ""
            }`}
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
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="medivo-mobile-menu-overlay"
            onClick={() =>
              setIsMobileMenuOpen(false)
            }
          />

          <div className="medivo-mobile-menu">

            <div className="medivo-mobile-menu-status">
              <span className="medivo-status-dot" />
              <span>Box ready</span>
            </div>

            <button
              type="button"
              className={
                location.pathname === "/medication-history"
                  ? "active"
                  : ""
              }
              onClick={() =>
                navigateAndClose(
                  "/medication-history"
                )
              }
            >
              <span className="menu-icon">↗</span>
              Medicine History
            </button>

            <button
              type="button"
              className={
                location.pathname === "/medical-documents"
                  ? "active"
                  : ""
              }
              onClick={() =>
                navigateAndClose(
                  "/medical-documents"
                )
              }
            >
              <span className="menu-icon">▣</span>
              Medical Documents
            </button>

            <button
              type="button"
              className={
                location.pathname === "/profile"
                  ? "active"
                  : ""
              }
              onClick={() =>
                navigateAndClose("/profile")
              }
            >
              <span className="menu-icon">◯</span>
              Profile
            </button>

            <div className="medivo-mobile-menu-divider" />

            <button
              type="button"
              className="logout"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
            >
              <span className="menu-icon">↪</span>
              Logout
            </button>
          </div>
        </>
      )}

      {/* Optional back button */}
      {showBackButton && (
        <div className="medivo-backbar">
          <div className="medivo-backbar-inner">
            <button
              type="button"
              className="medivo-back-button"
              onClick={() => navigate(backTo)}
            >
              <span aria-hidden="true">←</span>
              {backLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
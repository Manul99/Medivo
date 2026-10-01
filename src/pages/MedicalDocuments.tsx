import {

  useCallback,

  useEffect,

  useState,

} from "react";

import {

  useNavigate,

} from "react-router-dom";

import MedicalDocumentUpload

  from "../components/MedicalDocumentUpload";

import MedicalDocumentList

  from "../components/MedicalDocumentList";

import {

  getMedicalDocuments,

} from "../services/medicalDocumentService";

import type {

  MedicalDocument,

} from "../interfaces/medicalDocument.interface";

import {

  logoutUser,

} from "../services/authService";

export default function MedicalDocuments() {

  const navigate = useNavigate();

  const [

    documents,

    setDocuments,

  ] = useState<MedicalDocument[]>([]);

  const [

    isLoading,

    setIsLoading,

  ] = useState(true);

  const [

    error,

    setError,

  ] = useState<string | null>(null);

  const [

    isMobileMenuOpen,

    setIsMobileMenuOpen,

  ] = useState(false);

  const fetchDocuments = useCallback(

    async () => {

      return getMedicalDocuments();

    },

    []

  );

  useEffect(() => {

    let cancelled = false;

    const loadInitialDocuments = async () => {

      try {

        const result =

          await fetchDocuments();

        if (cancelled) {

          return;

        }

        setDocuments(result);

        setError(null);

      } catch (error) {

        if (cancelled) {

          return;

        }

        console.error(

          "Failed to load medical documents:",

          error

        );

        setError(

          error instanceof Error

            ? error.message

            : "Failed to load medical documents."

        );

      } finally {

        if (!cancelled) {

          setIsLoading(false);

        }

      }

    };

    void loadInitialDocuments();

    return () => {

      cancelled = true;

    };

  }, [fetchDocuments]);

  const handleLogout = async () => {

    try {

      await logoutUser();

      navigate("/login", {

        replace: true,

      });

    } catch (err) {

      console.error(

        "Logout failed:",

        err

      );

      setError(

        "Logout failed. Please try again."

      );

    }

  };

  const navigateAndClose = (

    path: string

  ) => {

    setIsMobileMenuOpen(false);

    navigate(path);

  };

  const reloadDocuments = useCallback(

    async () => {

      try {

        setIsLoading(true);

        setError(null);

        const result =

          await fetchDocuments();

        setDocuments(result);

      } catch (error) {

        console.error(

          "Failed to load medical documents:",

          error

        );

        setError(

          error instanceof Error

            ? error.message

            : "Failed to load medical documents."

        );

      } finally {

        setIsLoading(false);

      }

    },

    [fetchDocuments]

  );

  return (

    <div className="medical-documents-page">

      {/* =====================================================

          TOP BAR

          ===================================================== */}

      <header className="topbar">

        {/* ================= BRAND ================= */}

        <button

          type="button"

          className="brand"

          onClick={() => navigate("/dashboard")}

          aria-label="Go to Dashboard"

        >

          <div

            className="brand-mark"

            aria-hidden="true"

          >

            <img

              src="/medivo-logo.png"

              alt=""

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

        </button>

        {/* ================= TOP BAR ACTIONS ================= */}

        <div className="topbar-actions">

          {/* ================= DESKTOP ================= */}

          <div className="desktop-topbar-actions">

            <div className="connection-status">

              <span className="status-dot" />

              Box ready

            </div>

            <button

              type="button"

              className="medicine-history-button"

              onClick={() =>

                navigate("/medication-history")

              }

            >

              Medicine History

            </button>

            <button

              type="button"

              className="medical-documents-button"

              onClick={() =>

                navigate("/medical-documents")

              }

            >

              Medical Documents

            </button>

            <button

              type="button"

              className="profile-button"

              onClick={() =>

                navigate("/profile")

              }

            >

              Profile

            </button>

            <button

              type="button"

              className="logout-button"

              onClick={handleLogout}

            >

              Logout

            </button>

          </div>

          {/* ================= MOBILE HAMBURGER ================= */}

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

                current => !current

              )

            }

          >

            <span />

            <span />

            <span />

          </button>

        </div>

      </header>

      {/* =====================================================

          MOBILE MENU

          ===================================================== */}

      {isMobileMenuOpen && (

        <>

          <div

            className="mobile-menu-overlay"

            onClick={() =>

              setIsMobileMenuOpen(false)

            }

          />

          <div

            className="mobile-menu"

            role="menu"

          >

            <div className="mobile-menu-status">

              <span className="status-dot" />

              <span>Box ready</span>

            </div>

            <button

              type="button"

              className="mobile-menu-item"

              onClick={() =>

                navigateAndClose(

                  "/medication-history"

                )

              }

            >

              <span className="mobile-menu-icon">

                ◷

              </span>

              <span>

                Medicine History

              </span>

            </button>

            <button

              type="button"

              className="mobile-menu-item active"

              onClick={() =>

                navigateAndClose(

                  "/medical-documents"

                )

              }

            >

              <span className="mobile-menu-icon">

                ▣

              </span>

              <span>

                Medical Documents

              </span>

            </button>

            <button

              type="button"

              className="mobile-menu-item"

              onClick={() =>

                navigateAndClose("/profile")

              }

            >

              <span className="mobile-menu-icon">

                ◯

              </span>

              <span>

                Profile

              </span>

            </button>

            <div className="mobile-menu-divider" />

            <button

              type="button"

              className="mobile-menu-item mobile-logout-item"

              onClick={async () => {

                setIsMobileMenuOpen(false);

                await handleLogout();

              }}

            >

              <span className="mobile-menu-icon">

                ↪

              </span>

              <span>

                Logout

              </span>

            </button>

          </div>

        </>

      )}

      {/* =====================================================

          PAGE CONTENT

          ===================================================== */}

      <main className="medical-documents-content">

        <div className="medical-documents-container">

          {/* ================= BACK ================= */}

          <button

            type="button"

            className="back-to-dashboard-button"

            onClick={() =>

              navigate("/dashboard")

            }

          >

            <span aria-hidden="true">

              ←

            </span>

            Back to Dashboard

          </button>

          {/* ================= PAGE HEADER ================= */}

          <div className="medical-documents-header">

            <div className="medical-documents-title-icon">

              📄

            </div>

            <div>

              <h1>

                Medical Documents

              </h1>

              <p>

                Store your prescriptions,

                medical reports and test

                results securely.

              </p>

            </div>

          </div>

          {/* ================= UPLOAD ================= */}

          <MedicalDocumentUpload

            onUploaded={reloadDocuments}

          />

          {/* ================= DOCUMENTS ================= */}

          {isLoading ? (

            <div className="medical-documents-loading">

              <span className="medical-loading-spinner" />

              Loading medical documents...

            </div>

          ) : error ? (

            <div className="medical-document-error">

              <span>!</span>

              <p>{error}</p>

            </div>

          ) : (

            <MedicalDocumentList

              documents={documents}

              onChanged={reloadDocuments}

            />

          )}

        </div>

      </main>

    </div>

  );

}

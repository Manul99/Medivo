import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import MedicineBoxGrid from "../components/MedicineBoxBrid";
import AddMedicineSheet from "../components/AddMedicineSheet";
import MedicationList from "../components/MedicationList";

import { COMPARTMENTS } from "../constants/compartments";

import type {
  Day,
  MedicationAssignment,
} from "../interfaces/medication.interface";

import {
  createMedication,
  getMedications,
  finishMedication,
  updateMedication
  } from "../services/medicationSerivce";

import { logoutUser } from "../services/authService";
import {
  setBoxPower,
} from "../services/boxService";

function Dashboard() {
  const navigate = useNavigate();

  /*
   * Saved medications from PostgreSQL.
   */
  const [
    medications,
    setMedications,
  ] = useState<MedicationAssignment[]>([]);

  const [
  editingMedication,
  setEditingMedication,
] = useState<MedicationAssignment | null>(null);
  /*
   * Loading state.
   */
  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  /*
   * Saving state.
   */
  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  /*
   * Error message.
   */
  const [
    error,
    setError,
  ] = useState<string | null>(null);

  /*
   * Temporary/current compartment selection.
   */
const [
  selectedCompartmentIds,
  setSelectedCompartmentIds,
] = useState<string[]>(() => {

  const saved =
    localStorage.getItem(
      "medivo:selectedCompartments"
    );

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
});
const [isMobileMenuOpen, setIsMobileMenuOpen] =
  useState(false);

useEffect(() => {
  if (selectedCompartmentIds.length > 0) {
    localStorage.setItem(
      "medivo:selectedCompartments",
      JSON.stringify(selectedCompartmentIds)
    );
  } else {
    localStorage.removeItem(
      "medivo:selectedCompartments"
    );
  }
}, [selectedCompartmentIds]);

  /*
   * Bottom sheet state.
   */
  const [
    isSheetOpen,
    setIsSheetOpen,
  ] = useState(false);

const [isBoxOn, setIsBoxOn] = useState(false);
const [isPowerUpdating, setIsPowerUpdating] = useState(false);

  /*
   * Load medications from PostgreSQL.
   */
  useEffect(() => {
    const loadMedications = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getMedications();

        setMedications(data);
      } catch (err) {
        console.error(
          "Failed to load medications:",
          err
        );

        if (
          err instanceof Error &&
          err.message === "UNAUTHORIZED"
        ) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load medications."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadMedications();
  }, [navigate]);

  /*
   * Calculate occupied physical cells.
   */
 const occupiedCompartmentIds =
  useMemo(() => {

    return new Set(
      medications
        .filter(
          (medication) =>
            medication.isActive
        )
        .flatMap(
          (medication) =>
            medication.compartmentIds
        )
    );

  }, [medications]);

  /*
   * Select / unselect compartment.
   */
const toggleCompartment = (
  compartmentId: string
) => {
  setSelectedCompartmentIds(
    (currentIds) => {

      if (
        currentIds.includes(
          compartmentId
        )
      ) {
        return currentIds.filter(
          (id) =>
            id !== compartmentId
        );
      }

      return [
        ...currentIds,
        compartmentId,
      ];
    }
  );
};

  /*
   * Next button.
   */
  const handleNext = () => {
    if (
      selectedCompartmentIds.length === 0
    ) {
      return;
    }

    setError(null);
    setEditingMedication(null);
    setIsSheetOpen(true);
  };

  /*
   * Save medication to PostgreSQL.
   */
  const handleSaveMedication = async (
  data: {
    medicineName: string;
    days: Day[];
    hour: number;
    minute: number;
  }
) => {
  /*
   * ==========================================
   * GET COMPARTMENTS
   * ==========================================
   */

  const compartmentIds =
    editingMedication
      ? editingMedication.compartmentIds
      : selectedCompartmentIds;

  if (compartmentIds.length === 0) {
    setError(
      "Please select at least one compartment."
    );

    return;
  }

  try {
    setIsSaving(true);
    setError(null);

    /*
     * ==========================================
     * UPDATE EXISTING MEDICATION
     * ==========================================
     */

    if (editingMedication) {

      await updateMedication(
        editingMedication.id,
        {
          medicineName:
            data.medicineName,

          compartmentIds,

          days:
            data.days,

          hour:
            data.hour,

          minute:
            data.minute,
        }
      );

    }

    /*
     * ==========================================
     * CREATE NEW MEDICATION
     * ==========================================
     */

    else {

      await createMedication({
        medicineName:
          data.medicineName,

        compartmentIds,

        days:
          data.days,

        hour:
          data.hour,

        minute:
          data.minute,
      });

    }

    /*
     * ==========================================
     * REFRESH MEDICATIONS
     * ==========================================
     */

    const updatedMedications =
      await getMedications();

    setMedications(
      updatedMedications
    );

    /*
     * ==========================================
     * RESET STATE
     * ==========================================
     */

    setSelectedCompartmentIds([]);

    localStorage.removeItem(
      "medivo:selectedCompartments"
    );

    setEditingMedication(null);

    setIsSheetOpen(false);

  } catch (err) {

    console.error(
      "Failed to save medication:",
      err
    );

    if (
      err instanceof Error &&
      err.message === "UNAUTHORIZED"
    ) {
      navigate(
        "/login",
        {
          replace: true,
        }
      );

      return;
    }

    setError(
      err instanceof Error
        ? err.message
        : "Failed to save medication."
    );

  } finally {

    setIsSaving(false);
  }
};

const handleEditMedication = (
  medication: MedicationAssignment
) => {

  setEditingMedication(
    medication
  );

  setSelectedCompartmentIds(
    medication.compartmentIds
  );

  setIsSheetOpen(true);
};

  /*
   * Logout.
   */
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

  /*
   * Only display active medicines.
   */
  const activeMedications =
    medications.filter(
      (medication) =>
        medication.isActive
    );

const handleFinishMedication = async (
  id: string
) => {
  try {
    setError(null);

    await finishMedication(id);

    const updatedMedications =
      await getMedications();

    setMedications(updatedMedications);

  } catch (err) {
    console.error(
      "Failed to finish medication:",
      err
    );

    if (
      err instanceof Error &&
      err.message === "UNAUTHORIZED"
    ) {
      navigate(
        "/login",
        { replace: true }
      );

      return;
    }

    setError(
      err instanceof Error
        ? err.message
        : "Failed to finish medication."
    );
  }

 
};

const handlePowerToggle = async () => {
  const newPowerState = !isBoxOn;

  try {
    setIsPowerUpdating(true);

    await setBoxPower(newPowerState);

    setIsBoxOn(newPowerState);
  } catch (error) {
    console.error(
      "Failed to update box power:",
      error
    );
  } finally {
    setIsPowerUpdating(false);
  }
};

  return (
    <div className="app-shell">

      {/* ================= HEADER ================= */}

      <header className="topbar">

        <div className="brand">

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

         <div className="topbar-actions">

            {/* ================= DESKTOP ACTIONS ================= */}
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
              onClick={() => navigate("/profile")}
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

          {isMobileMenuOpen && (
      <div className="mobile-menu">

        <div className="mobile-menu-status">
          <span className="status-dot" />
          <span>Box ready</span>
        </div>

        <button
          type="button"
          className="mobile-menu-item"
          onClick={() => {
            setIsMobileMenuOpen(false);
            navigate("/medication-history");
          }}
        >
          <span className="mobile-menu-icon">
            💊
          </span>

          <span>
            Medicine History
          </span>
        </button>

        <button
          type="button"
          className="mobile-menu-item"
          onClick={() => {
            setIsMobileMenuOpen(false);
            navigate("/medical-documents");
          }}
        >
          <span className="mobile-menu-icon">
            📄
          </span>

          <span>
            Medical Documents
          </span>
        </button>

          <button
          type="button"
          className="profile-button"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>

        <div className="mobile-menu-divider" />

        <button
          type="button"
          className="mobile-menu-item mobile-logout-item"
          onClick={handleLogout}
        >
          <span className="mobile-menu-icon">
            ↪
          </span>

          <span>
            Logout
          </span>
        </button>

      </div>
    )}

      {/* ================= MAIN ================= */}

      <main className="page">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Hero */}

        <section className="hero">

          <div>

            <p className="eyebrow">
              MEDICINE BOX
            </p>

            <h1>
              Set up your medicine
              compartments
            </h1>

            <p className="hero-copy">
              Select one or more physical
              cells to create a single
              medicine compartment. Your
              saved medicines are stored
              securely in your account.
            </p>

          </div>

          <div className="selection-summary">

            <span>
              {selectedCompartmentIds.length}
            </span>

            <small>
              selected
            </small>

          </div>

        </section>

        {/* Loading */}

        {isLoading ? (
          <div className="loading-message">
            Loading your medicines...
          </div>
        ) : (

          <section className="content-grid">

            <div className="primary-column">

              <MedicineBoxGrid
                compartments={
                  COMPARTMENTS
                }
                selectedCompartmentIds={
                  selectedCompartmentIds
                }
                occupiedCompartmentIds={
                  occupiedCompartmentIds
                }
                onToggleCompartment={
                  toggleCompartment
                }
              />

              {/* NEXT */}

              <button
                className="primary-button next-button"
                type="button"
                disabled={
                  selectedCompartmentIds.length ===
                    0 ||
                  isSaving
                }
                onClick={handleNext}
              >
                Next

                <span aria-hidden="true">
                  →
                </span>
              </button>

              {/* Saved medicines */}

            <MedicationList
              medications={activeMedications}
              onFinish={handleFinishMedication}
              onEdit={handleEditMedication}
            />

            </div>

            {/* Information */}

            <aside className="side-card">

              <div className="info-icon">
                i
              </div>

              <h2>
                How it works
              </h2>

              <ol>

                <li>
                  Select the physical
                  cells you want to combine.
                </li>

                <li>
                  Click <strong>Next</strong>{" "}
                  and enter the medicine
                  schedule.
                </li>

                <li>
                  Save it to assign those
                  cells to the medicine.
                </li>

              </ol>
              {/* ================= BOX POWER ================= */}

              <div className="box-power-section">
                <div className="box-power-header">
                  <span className="box-power-label">
                    Medicine Box
                  </span>

                  <span
                    className={`box-power-status ${
                      isBoxOn
                        ? "box-power-status-on"
                        : "box-power-status-off"
                    }`}
                  >
                    {isBoxOn ? "ON" : "OFF"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePowerToggle}
                  disabled={isPowerUpdating}
                  className={`box-power-button ${
                    isBoxOn
                      ? "box-power-on"
                      : "box-power-off"
                  }`}
                >
                  {isPowerUpdating
                    ? "Updating..."
                    : isBoxOn
                      ? "Turn Off Box"
                      : "Turn On Box"}
                </button>
              </div>

            </aside>
            

          </section>
        )}

      </main>

      {/* ================= BOTTOM SHEET ================= */}

      <AddMedicineSheet
        open={isSheetOpen}
        selectedCompartmentIds={
          selectedCompartmentIds
        }
        onClose={() => {
          if (!isSaving) {
            setIsSheetOpen(false);
          }
        }}
        onSave={
          handleSaveMedication
        }
         editingMedication={editingMedication}
      />

    </div>
  );
}

export default Dashboard;
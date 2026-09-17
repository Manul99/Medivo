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
  finishMedication
  } from "../services/medicationSerivce";

import { logoutUser } from "../services/authService";

function Dashboard() {
  const navigate = useNavigate();

  /*
   * Saved medications from PostgreSQL.
   */
  const [
    medications,
    setMedications,
  ] = useState<MedicationAssignment[]>([]);

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
  ] = useState<string[]>([]);

  /*
   * Bottom sheet state.
   */
  const [
    isSheetOpen,
    setIsSheetOpen,
  ] = useState(false);

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
    if (
      selectedCompartmentIds.length === 0
    ) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

     await createMedication({
      medicineName: data.medicineName,

      compartmentIds: [
        ...selectedCompartmentIds,
      ],

      days: data.days,

      hour: data.hour,

      minute: data.minute,
    });

    const updatedMedications =
      await getMedications();

    setMedications(
      updatedMedications
    );

      /*
       * Clear selection.
       */
      setSelectedCompartmentIds([]);

      /*
       * Close bottom sheet.
       */
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
        navigate("/login", {
          replace: true,
        });

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

  return (
    <div className="app-shell">

      {/* ================= HEADER ================= */}

      <header className="topbar">

        <div className="brand">

          <div
            className="brand-mark"
            aria-hidden="true"
          >
            +
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

          <div className="connection-status">

            <span className="status-dot" />

            Box ready

          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

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
                medications={medications}
                onFinish={handleFinishMedication}
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
      />

    </div>
  );
}

export default Dashboard;
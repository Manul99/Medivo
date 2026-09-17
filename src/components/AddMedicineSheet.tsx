import {
  useState,
} from "react";

import { DAYS } from "../constants/days";

import type {
  Day,
} from "../interfaces/medication.interface";

interface AddMedicineSheetProps {
  open: boolean;

  selectedCompartmentIds: string[];

  onClose: () => void;

  onSave: (data: {
    medicineName: string;
    days: Day[];
    hour: number;
    minute: number;
  }) => void;
}

export default function AddMedicineSheet({
  open,
  selectedCompartmentIds,
  onClose,
  onSave,
}: AddMedicineSheetProps) {

  const [
    medicineName,
    setMedicineName,
  ] = useState("");

  const [
    days,
    setDays,
  ] = useState<Day[]>([]);

  const [
    time,
    setTime,
  ] = useState("08:00");

  const [
    error,
    setError,
  ] = useState("");

  /*
   * ==========================================
   * SELECT / UNSELECT DAY
   * ==========================================
   */

  const toggleDay = (
    day: Day
  ) => {
    setDays((currentDays) => {

      if (
        currentDays.includes(day)
      ) {
        return currentDays.filter(
          (currentDay) =>
            currentDay !== day
        );
      }

      return [
        ...currentDays,
        day,
      ];
    });

    setError("");
  };

  /*
   * ==========================================
   * SAVE MEDICATION
   * ==========================================
   */

  const handleSubmit = () => {

    /*
     * Validate medicine name
     */
    if (!medicineName.trim()) {

      setError(
        "Please enter the medicine name."
      );

      return;
    }

    /*
     * Validate days
     */
    if (days.length === 0) {

      setError(
        "Please select at least one day."
      );

      return;
    }

    /*
     * Convert HH:mm to numbers
     */
    const [
      hourText,
      minuteText,
    ] = time.split(":");

    const hour =
      Number(hourText);

    const minute =
      Number(minuteText);

    /*
     * Validate time
     */
    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {

      setError(
        "Please select a valid time."
      );

      return;
    }

    /*
     * Send data to Dashboard
     */
    onSave({
      medicineName:
        medicineName.trim(),

      days,

      hour,

      minute,
    });
  };

  /*
   * Don't render when closed.
   */
  if (!open) {
    return null;
  }

  return (
    <div
      className="sheet-overlay"
      role="presentation"
      onMouseDown={onClose}
    >

      <section
        className="medicine-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-medicine-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* ====================================
            HANDLE
            ==================================== */}

        <div className="sheet-handle" />

        {/* ====================================
            HEADER
            ==================================== */}

        <div className="sheet-header">

          <div>

            <p className="eyebrow">
              ADD MEDICINE
            </p>

            <h2 id="add-medicine-title">
              Set medicine schedule
            </h2>

            <p>
              {selectedCompartmentIds.length}{" "}
              {
                selectedCompartmentIds.length ===
                1
                  ? "cell"
                  : "cells"
              }{" "}
              selected:{" "}

              <strong>
                {
                  selectedCompartmentIds.join(
                    " · "
                  )
                }
              </strong>
            </p>

          </div>

          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

        </div>

        {/* ====================================
            FORM CONTENT
            ==================================== */}

        <div className="sheet-content">

          {/* ==================================
              MEDICINE NAME
              ================================== */}

          <label className="field">

            <span>
              Medicine name
            </span>

            <input
              type="text"
              value={medicineName}
              placeholder="e.g. Paracetamol"
              autoFocus
              onChange={(event) => {

                setMedicineName(
                  event.target.value
                );

                setError("");
              }}
            />

          </label>

          {/* ==================================
              DAYS
              ================================== */}

          <div className="field">

            <span>
              Repeat on
            </span>

            <div className="day-grid">

              {DAYS.map(
                (day) => {

                  const isSelected =
                    days.includes(
                      day.key
                    );

                  return (
                    <button
                      key={day.key}
                      type="button"
                      className={[
                        "day-chip",
                        isSelected
                          ? "is-active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-pressed={
                        isSelected
                      }
                      onClick={() =>
                        toggleDay(
                          day.key
                        )
                      }
                    >

                      <strong>
                        {day.label}
                      </strong>

                      <small>
                        {day.fullLabel}
                      </small>

                    </button>
                  );
                }
              )}

            </div>

          </div>

          {/* ==================================
              TIME
              ================================== */}

          <label className="field">

            <span>
              Reminder time
            </span>

            <input
              type="time"
              value={time}
              onChange={(event) => {

                setTime(
                  event.target.value
                );

                setError("");
              }}
            />

          </label>

          {/* ==================================
              VALIDATION ERROR
              ================================== */}

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {/* ==================================
              ACTIONS
              ================================== */}

          <div className="sheet-actions">

            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              type="button"
              onClick={handleSubmit}
            >
              Save Medicine
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}
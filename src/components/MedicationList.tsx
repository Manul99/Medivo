import { DAYS } from "../constants/days";

import type {
  MedicationAssignment,
} from "../interfaces/medication.interface";

interface MedicationListProps {
  medications: MedicationAssignment[];

  onFinish: (
    id: string
  ) => void;

  onEdit: (
    medication: MedicationAssignment
  ) => void;
}

/*
 * ==========================================
 * FORMAT TIME
 * ==========================================
 *
 * Backend returns time as:
 *
 * "09:30"
 *
 * or possibly:
 *
 * "09.30"
 *
 * This function supports both.
 */
function formatTime(
  time: string
): string {

  const normalizedTime =
    time.replace(".", ":");

  const [
    hourText,
    minuteText,
  ] = normalizedTime.split(":");

  const hour =
    Number(hourText);

  const minute =
    Number(minuteText);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return time;
  }

  const date = new Date();

  date.setHours(
    hour,
    minute,
    0,
    0
  );

  return new Intl.DateTimeFormat(
    undefined,
    {
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date);
}

export default function MedicationList({
  medications,
  onFinish,
  onEdit,
}: MedicationListProps) {

  /*
   * ==========================================
   * EMPTY STATE
   * ==========================================
   */

  if (medications.length === 0) {
    return (
      <section className="medications-card empty-card">

        <div className="empty-icon">
          +
        </div>

        <h2>
          No medicines assigned yet
        </h2>

        <p>
          Select cells above and click
          Next to add your first medicine.
        </p>

      </section>
    );
  }

  /*
   * ==========================================
   * MEDICATION LIST
   * ==========================================
   */

  return (
    <section className="medications-card">

      <div className="section-heading">

        <div>

          <p className="eyebrow">
            ACTIVE MEDICINES
          </p>

          <h2>
            Your medicine schedule
          </h2>

        </div>

        <span className="count-badge">
          {medications.length}
        </span>

      </div>

      <div className="medication-list">

        {medications.map(
          (medication) => {

            return (
              <article
                className="medication-item"
                key={medication.id}
              >

                {/* ==================================
                    MEDICINE ICON
                    ================================== */}

                <div className="medicine-icon">
                  💊
                </div>

                {/* ==================================
                    MAIN INFORMATION
                    ================================== */}

                <div className="medicine-main">

                  <h3>
                    {medication.medicineName}
                  </h3>

                  {/* ==================================
                      COMPARTMENTS
                      ================================== */}

                  <p className="medicine-meta">
                    {medication.compartmentIds.join(
                      " · "
                    )}
                  </p>

                  {/* ==================================
                      SCHEDULES
                      ================================== */}

                  <div className="medicine-details">

                    {medication.schedules.map(
                      (schedule) => {

                        const dayLabel =
                          DAYS.find(
                            (item) =>
                              item.key ===
                              schedule.day
                          )?.label ??
                          schedule.day;

                        return (
                          <div
                            key={`${medication.id}-${schedule.day}-${schedule.time}`}
                          >

                            <span>
                              {dayLabel}
                            </span>

                            <span>
                              {" • "}
                            </span>

                            <span>
                              {formatTime(
                                schedule.time
                              )}
                            </span>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>

                {/* ==================================
                    FINISH BUTTON
                    ================================== */}

                <div className="medication-actions">

                  {/* EDIT */}
                  <button
                    className="edit-button"
                    type="button"
                    onClick={() =>
                      onEdit(medication)
                    }
                  >
                    Edit
                  </button>

                  {/* FINISH */}
                  <button
                    className="finish-button"
                    type="button"
                    onClick={() =>
                      onFinish(
                        medication.id
                      )
                    }
                  >
                    Finish
                  </button>

                </div>

              </article>
            );
          }
        )}

      </div>

    </section>
  );
}
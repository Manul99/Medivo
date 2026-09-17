import { DAYS } from "../constants/days";

import type {
  MedicationAssignment,
} from "../interfaces/medication.interface";


interface MedicationListProps {
  medications: MedicationAssignment[];

  onFinish: (
    id: string
  ) => void;
}

function formatTime(
  hour: number,
  minute: number
): string {
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
}: MedicationListProps) {
  /*
   * Empty state
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
   * Medication list
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

                {/* Medicine icon */}
                <div className="medicine-icon">
                  💊
                </div>

                {/* Main information */}
                <div className="medicine-main">

                  <h3>
                    {medication.medicineName}
                  </h3>

                  {/* Compartments */}
                  <p className="medicine-meta">
                    {medication.compartmentIds.join(
                      " · "
                    )}
                  </p>

                  {/* Schedules */}
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
                            key={`${medication.id}-${schedule.day}`}
                          >

                            <span>
                              {dayLabel}
                            </span>

                            <span>
                              {" • "}
                            </span>

                            <span>
                              {formatTime(
                                schedule.hour,
                                schedule.minute
                              )}
                            </span>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>

                {/* Finish button */}
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

              </article>
            );
          }
        )}

      </div>

    </section>
  );
}
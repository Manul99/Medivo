import type { Compartment } from "../interfaces/compartment.interface";

interface MedicineBoxGridProps {
  compartments: Compartment[];
  selectedCompartmentIds: number[];
  occupiedCompartmentIds: Set<number>;
  onToggleCompartment: (
    compartmentId: number,
  ) => void;
}

export default function MedicineBoxGrid({
  compartments,
  selectedCompartmentIds,
  occupiedCompartmentIds,
  onToggleCompartment,
}: MedicineBoxGridProps) {
  return (
    <div className="box-card">

      {/* Header */}
      <div className="card-heading">
        <div>
          <h2>Medicine Box</h2>

          <p>
            Select the physical cells you want to
            combine into one compartment.
          </p>
        </div>

        <div className="box-legend">

          <span>
            <i className="legend-swatch available" />
            Available
          </span>

          <span>
            <i className="legend-swatch selected" />
            Selected
          </span>

          <span>
            <i className="legend-swatch occupied" />
            Used
          </span>

        </div>
      </div>

      {/* Physical box */}
      <div className="physical-box">

        <div
          className="grid-frame"
          aria-label="Medicine box with 21 compartments"
        >

          {compartments.map((compartment) => {

            const isSelected =
              selectedCompartmentIds.includes(
                compartment.id,
              );

            const isOccupied =
              occupiedCompartmentIds.has(
                compartment.id,
              );

            return (
              <button
                key={compartment.id}
                type="button"
                disabled={isOccupied}
                aria-pressed={isSelected}
                aria-label={`${compartment.id}${
                  isOccupied
                    ? ", occupied"
                    : isSelected
                      ? ", selected"
                      : ""
                }`}
                className={[
                  "compartment",
                  isSelected
                    ? "is-selected"
                    : "",
                  isOccupied
                    ? "is-occupied"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() =>
                  onToggleCompartment(
                    compartment.id,
                  )
                }
              >
                <span>
                  {compartment.id}
                </span>
              </button>
            );
          })}

        </div>
      </div>

      {/* Selection information */}
      <div className="selection-bar">

        <div>

          <strong>
            {selectedCompartmentIds.length > 0
              ? selectedCompartmentIds.join(" · ")
              : "No cells selected"}
          </strong>

          <span>
            {selectedCompartmentIds.length > 0
              ? "These cells will be saved as one medicine compartment."
              : "Select at least one cell to continue."}
          </span>

        </div>

        <span className="selection-count">
          {selectedCompartmentIds.length}/21
        </span>

      </div>

    </div>
  );
}
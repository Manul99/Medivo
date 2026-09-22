import type { Compartment } from "../interfaces/compartment.interface";

export const COMPARTMENTS: Compartment[] =
  Array.from(
    { length: 21 },
    (_, index) => ({
      id: `C${String(index + 1).padStart(2, "0")}`,
      row: Math.floor(index / 7),
      column: index % 7,
    })
  );
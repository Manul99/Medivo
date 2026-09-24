export type Day =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface MedicationSchedule {
  day: Day;
  time: string;
}

export interface MedicationAssignment {
  id: string;

  medicineName: string;

  /*
   * Physical compartment IDs used by the frontend.
   *
   * Example:
   * C01
   * C02
   * C03
   */
  compartmentIds: string[];

  /*
   * Medication schedules returned by the backend.
   */
  schedules: MedicationSchedule[];

  isActive: boolean;

  createdAtUtc: string;

  updatedAtUtc: string;
}
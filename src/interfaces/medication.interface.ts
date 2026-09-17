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
  hour: number;
  minute: number;
}

export interface MedicationAssignment {
  id: string;
  medicineName: string;
  compartmentIds: string[];
  schedules: MedicationSchedule[];
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}
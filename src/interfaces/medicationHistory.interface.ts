export interface MedicationHistory {
  id: string;
  date: string;
  time: string;
  boxId: string;
  slotNumber: number;
  compartmentId: string;
  medicineName: string;
  medicineMatched: boolean;
}
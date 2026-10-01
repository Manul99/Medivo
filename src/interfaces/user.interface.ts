export type BloodType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;

  firstName: string;
  lastName: string;
  phoneNumber: string;

  dateOfBirth: string | null;
  bloodType: BloodType | null;

  age: number | null;

  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  bloodType: BloodType;
}
export type MedicalDocumentType =
  | "PRESCRIPTION"
  | "LAB_REPORT"
  | "MEDICAL_REPORT"
  | "SCAN"
  | "OTHER";

export interface MedicalDocument {
  id: string;
  documentType: MedicalDocumentType;
  documentName: string;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
  documentDate: string | null;
  description: string | null;
  createdAtUtc: string;
}
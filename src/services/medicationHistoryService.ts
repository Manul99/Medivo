import type {
  MedicationHistory,
} from "../interfaces/medicationHistory.interface";

import { getApiUrl } from "../config/api";

export async function getMedicationHistory(
  fromDate: string,
  toDate: string
): Promise<MedicationHistory[]> {
  const response = await fetch(
    getApiUrl(
      `/medication-history` +
        `?fromDate=${encodeURIComponent(fromDate)}` +
        `&toDate=${encodeURIComponent(toDate)}`
    ),
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to load medication history."
    );
  }

  return response.json();
}
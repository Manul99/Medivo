import type {
  Day,
  MedicationAssignment,
} from "../interfaces/medication.interface";

const API_BASE_URL = "";

export interface CreateMedicationRequest {
  medicineName: string;

  /*
   * Frontend uses C01, C02, C03...
   */
  compartmentIds: string[];

  days: Day[];

  hour: number;

  minute: number;
}

async function getCsrfToken(): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/csrf`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to initialize CSRF protection."
    );
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error(
      "CSRF token was not returned by the server."
    );
  }

  return data.token;
}

export async function getMedications(): Promise<
  MedicationAssignment[]
> {
  const response = await fetch(
    `${API_BASE_URL}/api/medications`,
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
        "Failed to load medications."
    );
  }

  return response.json();
}

export async function createMedication(
  request: CreateMedicationRequest
): Promise<MedicationAssignment> {

  const csrfToken =
    await getCsrfToken();

  const response = await fetch(
    `${API_BASE_URL}/api/medications`,
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken,
      },

      body: JSON.stringify(request),
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
        "Failed to save medication."
    );
  }

  return response.json();
}

export async function deleteMedication(
  id: string
): Promise<void> {

  const csrfToken =
    await getCsrfToken();

  const response = await fetch(
    `${API_BASE_URL}/api/medications/${id}`,
    {
      method: "DELETE",

      credentials: "include",

      headers: {
        "X-XSRF-TOKEN": csrfToken,
      },
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
        "Failed to delete medication."
    );
  }
}

export async function finishMedication(
  id: string
): Promise<void> {

  const csrfToken =
    await getCsrfToken();

  const response = await fetch(
    `${API_BASE_URL}/api/medications/${id}`,
    {
      method: "DELETE",

      credentials: "include",

      headers: {
        "X-XSRF-TOKEN": csrfToken,
      },
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
        "Failed to finish medication."
    );
  }
}
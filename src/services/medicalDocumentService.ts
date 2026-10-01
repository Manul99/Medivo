import type {
  MedicalDocument,
  MedicalDocumentType,
} from "../interfaces/medicalDocument.interface";

import { getApiUrl } from "../config/api";

async function getCsrfToken(): Promise<string> {
  const response = await fetch(
    getApiUrl("/auth/csrf"),
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to get CSRF token."
    );
  }

  const data = await response.json();

  return data.token;
}

async function handleUnauthorized(
  response: Response
) {
  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
}

export async function getMedicalDocuments():
  Promise<MedicalDocument[]> {
  const response = await fetch(
    getApiUrl("/medical-documents"),
    {
      method: "GET",
      credentials: "include",
    }
  );

  await handleUnauthorized(response);

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to load medical documents."
    );
  }

  return response.json();
}

export async function uploadMedicalDocument(
  documentType: MedicalDocumentType,
  documentName: string,
  documentDate: string | null,
  description: string,
  file: File
): Promise<MedicalDocument> {
  const csrfToken =
    await getCsrfToken();

  const formData =
    new FormData();

  formData.append(
    "documentType",
    documentType
  );

  formData.append(
    "documentName",
    documentName
  );

  if (documentDate) {
    formData.append(
      "documentDate",
      documentDate
    );
  }

  if (description.trim()) {
    formData.append(
      "description",
      description.trim()
    );
  }

  formData.append(
    "file",
    file
  );

  const response =
    await fetch(
      getApiUrl("/medical-documents"),
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": csrfToken,
        },
        body: formData,
      }
    );

  await handleUnauthorized(response);

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to upload medical document."
    );
  }

  return response.json();
}

export async function getMedicalDocumentViewUrl(
  id: string
): Promise<string> {
  const response =
    await fetch(
      getApiUrl(`/medical-documents/${id}/view`),
      {
        method: "GET",
        credentials: "include",
      }
    );

  await handleUnauthorized(response);

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to generate document URL."
    );
  }

  const result =
    await response.json();

  return result.url;
}

export async function deleteMedicalDocument(
  id: string
): Promise<void> {
  const csrfToken =
    await getCsrfToken();

  const response =
    await fetch(
      getApiUrl(`/medical-documents/${id}`),
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": csrfToken,
        },
      }
    );

  await handleUnauthorized(response);

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to delete medical document."
    );
  }
}
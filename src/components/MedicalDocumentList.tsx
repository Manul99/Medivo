import {
  useState,
} from "react";

import type {
  MedicalDocument,
} from "../interfaces/medicalDocument.interface";

import {
  deleteMedicalDocument,
  getMedicalDocumentViewUrl,
} from "../services/medicalDocumentService";

interface MedicalDocumentListProps {
  documents: MedicalDocument[];
  onChanged: () => Promise<void>;
}

function getDocumentTypeLabel(
  type: string
) {
  switch (type) {
    case "PRESCRIPTION":
      return "Prescription";

    case "LAB_REPORT":
      return "Lab Report";

    case "MEDICAL_REPORT":
      return "Medical Report";

    case "SCAN":
      return "Scan";

    default:
      return "Other";
  }
}

function getDocumentTypeClass(
  type: string
) {
  switch (type) {
    case "PRESCRIPTION":
      return "prescription";

    case "LAB_REPORT":
      return "lab-report";

    case "MEDICAL_REPORT":
      return "medical-report";

    case "SCAN":
      return "scan";

    default:
      return "other";
  }
}

function getFileType(
  contentType: string
) {
  if (contentType === "application/pdf") {
    return "PDF";
  }

  if (
    contentType === "image/jpeg" ||
    contentType === "image/png"
  ) {
    return "IMG";
  }

  return "FILE";
}

function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function formatDate(
  date: string | null
) {
  if (!date) {
    return "No date";
  }

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

export default function MedicalDocumentList({
  documents,
  onChanged,
}: MedicalDocumentListProps) {

  const [
    loadingDocumentId,
    setLoadingDocumentId,
  ] = useState<string | null>(
    null
  );

  const [
    deletingDocumentId,
    setDeletingDocumentId,
  ] = useState<string | null>(
    null
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const handleView =
    async (
      document: MedicalDocument
    ) => {

      try {
        setError(null);

        setLoadingDocumentId(
          document.id
        );

        const url =
          await getMedicalDocumentViewUrl(
            document.id
          );

        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );

      } catch (error) {

        console.error(
          "Failed to open document:",
          error
        );

        setError(
          "Failed to open document."
        );

      } finally {

        setLoadingDocumentId(
          null
        );

      }
    };

  const handleDelete =
    async (
      document: MedicalDocument
    ) => {

      const confirmed =
        window.confirm(
          `Delete "${document.documentName}"?`
        );

      if (!confirmed) {
        return;
      }

      try {

        setError(null);

        setDeletingDocumentId(
          document.id
        );

        await deleteMedicalDocument(
          document.id
        );

        await onChanged();

      } catch (error) {

        console.error(
          "Failed to delete document:",
          error
        );

        setError(
          "Failed to delete document."
        );

      } finally {

        setDeletingDocumentId(
          null
        );

      }
    };

  return (
    <section className="medical-document-list">

      {/* ================= HEADER ================= */}

      <div className="medical-document-list-header">

        <div>
          <h2>
            Your Documents
          </h2>

          <p>
            {documents.length === 0
              ? "No documents uploaded yet."
              : `${documents.length} document${
                  documents.length === 1
                    ? ""
                    : "s"
                } stored securely`}
          </p>
        </div>

        {documents.length > 0 && (
          <div className="document-count">
            {documents.length}
          </div>
        )}

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="medical-document-error">
          <span>!</span>
          <p>{error}</p>
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {documents.length === 0 ? (
        <div className="medical-documents-empty">

          <div className="empty-document-icon">
            +
          </div>

          <h3>
            No medical documents yet
          </h3>

          <p>
            Upload a prescription, lab report,
            scan or other medical document above.
          </p>

        </div>
      ) : (

        /* ================= DOCUMENT CARDS ================= */

        <div className="medical-document-grid">

          {documents.map(
            (document) => {

              const typeClass =
                getDocumentTypeClass(
                  document.documentType
                );

              return (
                <article
                  key={document.id}
                  className="medical-document-card"
                >

                  {/* Card Header */}

                  <div className="medical-document-card-header">

                    <div
                      className={`medical-file-type-icon ${typeClass}`}
                    >
                      {getFileType(
                        document.contentType
                      )}
                    </div>

                    <div className="medical-document-card-title">

                      <h3
                        title={
                          document.documentName
                        }
                      >
                        {document.documentName}
                      </h3>

                      <span
                        className={`medical-document-type ${typeClass}`}
                      >
                        {getDocumentTypeLabel(
                          document.documentType
                        )}
                      </span>

                    </div>

                  </div>

                  {/* File name */}

                  <div className="medical-document-file-name">

                    <span className="file-name-icon">
                      •
                    </span>

                    <span
                      title={
                        document.originalFileName
                      }
                    >
                      {document.originalFileName}
                    </span>

                  </div>

                  {/* Metadata */}

                  <div className="medical-document-meta">

                    <div className="medical-document-meta-item">

                      <span>
                        Date
                      </span>

                      <strong>
                        {formatDate(
                          document.documentDate
                        )}
                      </strong>

                    </div>

                    <div className="medical-document-meta-item">

                      <span>
                        Size
                      </span>

                      <strong>
                        {formatFileSize(
                          document.fileSizeBytes
                        )}
                      </strong>

                    </div>

                  </div>

                  {/* Description */}

                  {document.description && (
                    <div className="medical-document-description">

                      <p>
                        {document.description}
                      </p>

                    </div>
                  )}

                  {/* Actions */}

                  <div className="medical-document-actions">

                    <button
                      type="button"
                      className="document-view-button"
                      onClick={() =>
                        handleView(
                          document
                        )
                      }
                      disabled={
                        loadingDocumentId ===
                        document.id
                      }
                    >
                      {loadingDocumentId ===
                      document.id ? (
                        <>
                          <span className="button-spinner" />
                          Opening...
                        </>
                      ) : (
                        <>
                          <span>
                            ↗
                          </span>
                          View
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="document-delete-button"
                      onClick={() =>
                        handleDelete(
                          document
                        )
                      }
                      disabled={
                        deletingDocumentId ===
                        document.id
                      }
                    >
                      {deletingDocumentId ===
                      document.id ? (
                        <>
                          <span className="button-spinner delete-spinner" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <span>
                            ×
                          </span>
                          Delete
                        </>
                      )}
                    </button>

                  </div>

                </article>
              );
            }
          )}

        </div>

      )}

    </section>
  );
}
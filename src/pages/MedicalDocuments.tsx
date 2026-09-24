import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import MedicalDocumentUpload
  from "../components/MedicalDocumentUpload";

import MedicalDocumentList
  from "../components/MedicalDocumentList";

import {
  getMedicalDocuments,
} from "../services/medicalDocumentService";

import type {
  MedicalDocument,
} from "../interfaces/medicalDocument.interface";

export default function MedicalDocuments() {
     const navigate = useNavigate();
  const [
    documents,
    setDocuments,
  ] = useState<MedicalDocument[]>(
    []
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const loadDocuments =
    useCallback(
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const result =
            await getMedicalDocuments();

          setDocuments(result);
        } catch (error) {
          console.error(
            "Failed to load medical documents:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load medical documents."
          );
        } finally {
          setIsLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

 return (
  <div className="medical-documents-page">

    <div className="medical-documents-container">

      {/* ================= PAGE HEADER ================= */}
    <button
      type="button"
      className="back-to-dashboard-button"
      onClick={() => navigate("/dashboard")}
    >
      <span aria-hidden="true">
        ←
      </span>

      Back to Dashboard
    </button>

      <div className="medical-documents-header">

        <div className="medical-documents-title-icon">
          +
        </div>

        <div>
          <h1>
            Medical Documents
          </h1>

          <p>
            Store your prescriptions,
            medical reports and test results
            securely.
          </p>
        </div>

      </div>

      {/* ================= UPLOAD ================= */}

      <MedicalDocumentUpload
        onUploaded={loadDocuments}
      />

      {/* ================= DOCUMENTS ================= */}

      {isLoading ? (
        <div className="medical-documents-loading">
          <span className="medical-loading-spinner" />
          Loading medical documents...
        </div>
      ) : error ? (
        <div className="medical-document-error">
          <span>!</span>
          <p>{error}</p>
        </div>
      ) : (
        <MedicalDocumentList
          documents={documents}
          onChanged={loadDocuments}
        />
      )}

    </div>

  </div>
);
}
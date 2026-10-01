import {
  useRef,
  useState,
} from "react";

import {
  uploadMedicalDocument,
} from "../services/medicalDocumentService";

import type {
  MedicalDocumentType,
} from "../interfaces/medicalDocument.interface";

interface MedicalDocumentUploadProps {
  onUploaded: () => Promise<void>;
}

const DOCUMENT_TYPES: {
  value: MedicalDocumentType;
  label: string;
}[] = [
  {
    value: "PRESCRIPTION",
    label: "Prescription",
  },
  {
    value: "LAB_REPORT",
    label: "Lab Report",
  },
  {
    value: "MEDICAL_REPORT",
    label: "Medical Report",
  },
  {
    value: "SCAN",
    label: "Scan",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

export default function MedicalDocumentUpload({
  onUploaded,
}: MedicalDocumentUploadProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [
    documentType,
    setDocumentType,
  ] =
    useState<MedicalDocumentType>(
      "PRESCRIPTION"
    );

  const [
    documentName,
    setDocumentName,
  ] = useState("");

  const [
    documentDate,
    setDocumentDate,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(null);

  const [
    isUploading,
    setIsUploading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] ?? null;

    setError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      setError(
        "Only PDF, JPG, JPEG and PNG files are allowed."
      );

      setSelectedFile(null);
      return;
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      setError(
        "File size cannot exceed 10 MB."
      );

      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleChooseFile = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleUpload =
    async () => {
      setError(null);

      if (!documentName.trim()) {
        setError(
          "Please enter a document name."
        );
        return;
      }

      if (!selectedFile) {
        setError(
          "Please select a file."
        );
        return;
      }

      try {
        setIsUploading(true);

        await uploadMedicalDocument(
          documentType,
          documentName.trim(),
          documentDate || null,
          description,
          selectedFile
        );

        setDocumentName("");
        setDocumentDate("");
        setDescription("");
        setSelectedFile(null);

        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            "";
        }

        await onUploaded();
      } catch (error) {
        console.error(
          "Medical document upload failed:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to upload document."
        );
      } finally {
        setIsUploading(false);
      }
    };

  return (
    <section className="medical-document-upload">

      {/* ================= HEADER ================= */}

      <div className="medical-upload-header">

        <div className="medical-upload-icon">
          <span aria-hidden="true">
            🗂️
          </span>
        </div>

        <div>
          <h2>
            Upload Medical Document
          </h2>

          <p>
            Keep your prescriptions,
            reports and test results
            securely stored in one place.
          </p>
        </div>

      </div>

      {/* ================= FORM ================= */}

      <div className="medical-document-form">

        {/* Document Type */}

        <div className="medical-document-field">

          <label htmlFor="document-type">
            Document Type
          </label>

          <select
            id="document-type"
            value={documentType}
            onChange={(event) =>
              setDocumentType(
                event.target
                  .value as MedicalDocumentType
              )
            }
            disabled={isUploading}
          >
            {DOCUMENT_TYPES.map(
              (type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              )
            )}
          </select>

        </div>

        {/* Document Name */}

        <div className="medical-document-field">

          <label htmlFor="document-name">
            Document Name
          </label>

          <input
            id="document-name"
            type="text"
            value={documentName}
            onChange={(event) =>
              setDocumentName(
                event.target.value
              )
            }
            placeholder="e.g. Doctor Prescription"
            maxLength={200}
            disabled={isUploading}
          />

        </div>

        {/* Document Date */}

        <div className="medical-document-field">

          <label htmlFor="document-date">
            Document Date
          </label>

          <input
            id="document-date"
            type="date"
            value={documentDate}
            onChange={(event) =>
              setDocumentDate(
                event.target.value
              )
            }
            disabled={isUploading}
          />

        </div>

        {/* Description */}

        <div className="medical-document-field medical-document-field-full">

          <label htmlFor="document-description">
            Description
            <span className="optional-label">
              Optional
            </span>
          </label>

          <textarea
            id="document-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Add any notes about this document..."
            maxLength={1000}
            disabled={isUploading}
          />

        </div>

        {/* ================= FILE ================= */}

        <div className="medical-document-field medical-document-field-full">

          <label>
            Medical File
          </label>

          <div
            className={`medical-file-dropzone ${
              selectedFile
                ? "has-file"
                : ""
            }`}
            onClick={handleChooseFile}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                handleChooseFile();
              }
            }}
          >

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={handleFileChange}
              disabled={isUploading}
              hidden
            />

            {!selectedFile ? (
              <>
                <div className="file-upload-icon">
                  ↑
                </div>

                <div className="file-upload-title">
                  Choose a medical document
                </div>

                <div className="file-upload-subtitle">
                  Click to browse from your device
                </div>

                <div className="file-upload-types">
                  PDF · JPG · PNG
                  <span>
                    Maximum 10 MB
                  </span>
                </div>
              </>
            ) : (
              <div className="selected-file">

                <div className="selected-file-icon">
                  {selectedFile.type ===
                  "application/pdf"
                    ? "PDF"
                    : "IMG"}
                </div>

                <div className="selected-file-info">

                  <strong>
                    {selectedFile.name}
                  </strong>

                  <span>
                    {(
                      selectedFile.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </span>

                </div>

                <button
                  type="button"
                  className="remove-file-button"
                  onClick={(event) => {
                    event.stopPropagation();

                    setSelectedFile(
                      null
                    );

                    if (
                      fileInputRef.current
                    ) {
                      fileInputRef.current.value =
                        "";
                    }
                  }}
                  disabled={isUploading}
                  aria-label="Remove selected file"
                >
                  ×
                </button>

              </div>
            )}

          </div>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div
            className="medical-document-error"
            role="alert"
          >
            <span>
              !
            </span>

            <p>
              {error}
            </p>
          </div>
        )}

        {/* ================= ACTION ================= */}

        <div className="medical-upload-actions">

          <button
            type="button"
            className="medical-document-upload-button"
            onClick={handleUpload}
            disabled={
              isUploading ||
              !selectedFile ||
              !documentName.trim()
            }
          >
            {isUploading ? (
              <>
                <span className="upload-spinner" />

                Uploading...
              </>
            ) : (
              <>
                <span>
                  ↑
                </span>

                Upload Document
              </>
            )}
          </button>

        </div>

      </div>

    </section>
  );
}
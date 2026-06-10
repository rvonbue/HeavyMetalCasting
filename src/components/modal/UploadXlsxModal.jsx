import { useRef, useState } from "react";
import Modal from "./Modal";

export default function UploadXlsxModal({ isOpen, onClose, onUpload }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  function validateFile(selectedFile) {
    if (!selectedFile) return;

    const isXlsx =
      selectedFile.name.toLowerCase().endsWith(".xlsx") ||
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (!isXlsx) {
      setFile(null);
      setError("Please upload a valid .xlsx file.");
      return;
    }

    setError("");
    setFile(selectedFile);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    validateFile(e.dataTransfer.files?.[0]);
  }

  function handleUpload() {
    if (!file) return;
    onUpload(file);
    setFile(null);
    setError("");
    onClose();
  }

  function handleClose() {
    setFile(null);
    setError("");
    setIsDragging(false);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Products XLSX"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file}
            className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Upload
          </button>
        </>
      }
    >
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={[
          "flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition",
          isDragging
            ? "border-black bg-gray-100"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          onChange={(e) => validateFile(e.target.files?.[0])}
          className="hidden"
        />

        <p className="text-sm font-medium text-gray-900">
          Drag and drop your XLSX file here
        </p>

        <p className="mt-1 text-sm text-gray-500">
          or click to browse
        </p>

        {file && (
          <p className="mt-4 rounded-md bg-white px-3 py-2 text-sm text-gray-700">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
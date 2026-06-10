import { useRef, useState } from "react";
import { useDispatch } from 'react-redux'
import { uploadProductImage } from "../api/productEditApis";
import { addProductImages } from '../store/productsSlice';
import { toast } from "sonner";

export default function ProductImageUploaderDropzone({ product }) {
  const inputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);

  function handleFiles(selectedFiles) {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFiles(newFiles);
    setModalOpen(true);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

async function handleUpload() {
  const uploadPromise = Promise.all(
    files.map(({ file }) => uploadProductImage(product.id, file))
  );

  toast.promise(uploadPromise, {
    loading: "Uploading images...",
    success: (images) =>
      `${images.length} image${images.length === 1 ? "" : "s"} uploaded`,
    error: (error) => error?.message || "Failed to upload images",
  });

  try {
    const uploadedImages = await uploadPromise;

  dispatch(
    addProductImages({
      productId: product.id,
      images: uploadedImages,
    })
);

    setModalOpen(false);
    setFiles([]);
  } catch (error) {
    console.error(error);
  }
}

  return (
    <>
      <div
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-sm text-gray-500 hover:bg-gray-50"
      >
        Drop product images here or click to upload
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Upload Product Images
            </h2>

            <div className="grid grid-cols-4 gap-4">
              {files.map(({ file, previewUrl }, index) => (
                <div key={previewUrl} className="rounded border p-2">
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-32 w-full rounded object-cover"
                  />

                  <p className="mt-2 truncate text-xs">{file.name}</p>

                  <button
                    type="button"
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="mt-2 text-xs text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setFiles([]);
                }}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpload}
                className="rounded bg-black px-4 py-2 text-white"
              >
                Upload Images
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
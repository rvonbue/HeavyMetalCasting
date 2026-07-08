import { useRef, useState } from "react";
import { useDispatch } from 'react-redux'
import { toast } from "sonner";
import { uploadProductImage } from "../../api/productEditAPI";
import { addProductImages } from '../../store/productsSlice';


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
  files.map(({ file }, idx) =>
    uploadProductImage(
      product.id,
      file,
      product.product_images.length + idx
    )
  )
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
        className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-hmc-border-b p-4 text-center text-sm text-hmc-textprimary hover:bg-hmc-border-b/10"
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
          <div className="w-full max-w-3xl rounded-lg bg-hmc-panelbackground border border-hmc-border-b p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-hmc-textprimary">
                Upload Product Images
              </h2>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setFiles([]);
                }}
                className="text-hmc-textprimary/60 hover:text-hmc-textprimary transition text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {files.map(({ file, previewUrl }, index) => (
                <div key={previewUrl} className="rounded border border-hmc-border-b p-2">
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-32 w-full rounded object-cover"
                  />

                  <p className="mt-2 truncate text-xs text-hmc-textprimary">{file.name}</p>

                  <button
                    type="button"
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="mt-2 text-xs text-hmc-error font-semibold"
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
                className="rounded border border-hmc-border-b px-4 py-2 text-hmc-textprimary hover:bg-hmc-border-b/20 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpload}
                className="rounded bg-hmc-button-a px-4 py-2 text-hmc-button-text-a font-bold hover:opacity-90 transition"
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
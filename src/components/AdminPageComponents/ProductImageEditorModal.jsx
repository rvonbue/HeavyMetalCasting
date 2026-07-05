import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import Modal from "../modal/Modal";
import { HmcSelect } from "../Resuables";
import ImageCropper from "./ImageCropper";
import { updateProductImageAPI, replaceProductImageFile } from "../../api/productEditAPI";
import { updateProductImage } from "../../store/productsSlice";

// The six standard product photo angles.
const VIEW_OPTIONS = [
  { value: "front", label: "Front" },
  { value: "back", label: "Back" },
  { value: "top", label: "Top" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "bottom", label: "Bottom" },
];

export default function ProductImageEditorModal({ isOpen, onClose, image }) {
  const dispatch = useDispatch();
  const metalTypes = useSelector(
    (state) => state.products.productAttributes.metal_types
  );
  const cropperRef = useRef(null);

  const metalOptions = (metalTypes ?? []).map((m) => ({
    value: m.id,
    label: m.label ?? m.name ?? String(m.id),
  }));

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      metal_types: image?.metal_types ?? [],
      view_type: image?.view_type ?? null,
      search_text: image?.search_text ?? "",
      product_description: image?.product_description ?? "",
    },
  });

  async function onSubmit(values) {
    try {
      // If the image was cropped, upload the new file first.
      const blob = await cropperRef.current?.getBlob();
      if (blob) {
        await replaceProductImageFile({ image, blob });
      }

      const saved = await updateProductImageAPI({
        id: image.id,
        updates: {
          metal_types: values.metal_types ?? [],
          view_type: values.view_type ?? null,
          search_text: values.search_text ?? "",
          product_description: values.product_description ?? "",
        },
      });
      dispatch(updateProductImage({ productId: image.product_id, image: saved }));
      toast.success("Image updated");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to update image");
    }
  }

  if (!image) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Image Edit Modal"
      maxWidth="max-w-4xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-hmc-border-a text-hmc-textprimary hover:bg-hmc-button-a/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-hmc-button-a text-hmc-button-text-a font-bold hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save"}
          </button>
        </>
      }
    >
      <div>
        <div className="grid grid-cols-2 gap-6">
          {/* Left: image + cropper */}
          <div className="rounded border border-hmc-border-a bg-hmc-bg-a p-4">
            <ImageCropper ref={cropperRef} src={image.image_url || image.thumbnail_url} />
          </div>

          {/* Right: edit fields */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-hmc-textprimary">
                Metal Types
              </label>
              <Controller
                name="metal_types"
                control={control}
                render={({ field }) => (
                  <HmcSelect
                    isMulti
                    options={metalOptions}
                    value={metalOptions.filter((o) => (field.value ?? []).includes(o.value))}
                    onChange={(selected) =>
                      field.onChange((selected ?? []).map((o) => o.value))
                    }
                  />
                )}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-hmc-textprimary">
                View
              </label>
              <Controller
                name="view_type"
                control={control}
                render={({ field }) => (
                  <HmcSelect
                    options={VIEW_OPTIONS}
                    value={VIEW_OPTIONS.find((o) => o.value === field.value) ?? null}
                    onChange={(option) => field.onChange(option?.value ?? null)}
                    isClearable
                    isSearchable={false}
                  />
                )}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-hmc-textprimary">
                Search Text
              </label>
              <input
                type="text"
                {...register("search_text")}
                className="w-full rounded border border-hmc-b/30 bg-white px-3 py-2 text-sm text-hmc-textprimary focus:border-hmc-c focus:outline-none focus:ring-1 focus:ring-hmc-c/30"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-hmc-textprimary">
                Description / Notes
              </label>
              <textarea
                rows={4}
                {...register("product_description")}
                className="w-full rounded border border-hmc-b/30 bg-white px-3 py-2 text-sm text-hmc-textprimary focus:border-hmc-c focus:outline-none focus:ring-1 focus:ring-hmc-c/30"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button_A, HmcSelect } from "../Resuables";
import { createProductFromTemplate } from "../../api/productAddAPI";

const PRODUCT_TEMPLATE_OPTIONS = [
  { value: "ring", label: "Ring" },
  { value: "necklace", label: "Necklace" },
  { value: "earring", label: "Earring" },
  { value: "pin", label: "Pin" },
];

export default function AddProductTemplateModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productAttributes = useSelector(
    (state) => state.products.productAttributes
  );

  const [selectedTemplate, setSelectedTemplate] = useState(
    PRODUCT_TEMPLATE_OPTIONS[0]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleAddProduct() {
    if (!selectedTemplate) {
      toast.error("Select a product type.");
      return;
    }

    try {
      setIsSubmitting(true);

      const newProduct = await createProductFromTemplate({ templateType: selectedTemplate.value });

      dispatch({ type: "products/addProduct", payload: newProduct });

      toast.success("Product created.");

      navigate(`/admin/edit_product?product_id=${newProduct.id}`);

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Could not create product.");
    } finally {
      setIsSubmitting(false);
    }
  }
  console.log("selectedTemplate", selectedTemplate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded border border-hmc-border-a bg-hmc-panelbackground p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-hmc-textprimary">
          Add Product
        </h2>

        <div className="mb-5">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-hmc-textprimary">
            Product Type
          </label>

          <HmcSelect
            options={PRODUCT_TEMPLATE_OPTIONS}
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            placeholder="Select product type..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-hmc-border-a px-4 py-2 text-sm font-bold text-hmc-textprimary transition hover:bg-hmc-button-a/20"
          >
            Cancel
          </button>

          <Button_A
            type="button"
            button_type={"onClick"}
            button_name={isSubmitting ? "Adding..." : "Add Product"}
            onClick={handleAddProduct}
            disabled={isSubmitting}
            className="rounded bg-hmc-button-a px-4 py-2 text-sm font-bold text-hmc-button-text-a transition hover:bg-hmc-button-b hover:text-hmc-button-text-b disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState  } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select';
import { toNumber } from 'lodash-es';

import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
// import { useOutletContext } from 'react-router-dom';
import { PageContainer, Button_A, FormLabel } from "../../components/Resuables"; // MultiSelectDropdown
import ProductImageUploaderDropzone from "../../components/ProductImageUploaderDropzone"; // MultiSelectDropdown

import {  TailwindSpinner } from "../../styles/Icons";
import { productImageLinks } from "../../staticData/PathData.js";
import { getProductImageLinks } from "../../components/Resuables.jsx";
import DragDropProductImageGrid from "../../components/AdminPageComponents/DragDropProductImageGrid";


function ProductEditPage(){
  const { products,  productsLoading, productAttributes } = useSelector(state => state.products);
  const { productEditFields } = useSelector(state => state.admin);
  const location = useLocation();
  const handleFormSubmit = (data) => {
    console.log("Updated product:", data);
  };
  const queryParams = new URLSearchParams(location.search);
  const productId = toNumber(queryParams.get('product_id'));
  const selectedProduct = products.find((prd) => prd.id === productId);

  return  (
  <PageContainer bg="alt1">
    {(productsLoading || selectedProduct === undefined) ?
      <TailwindSpinner/> :
      <EditProductForm 
        selectedProduct={selectedProduct}
        productEditFields={productEditFields} 
        productAttributes={productAttributes}
        onSubmit={handleFormSubmit} 
      />
    }
  </PageContainer>)
}
const adminSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "38px",
    borderColor: state.isFocused
      ? "var(--color-hmc-c)"
      : "rgba(107, 91, 75, 0.3)",
    boxShadow: state.isFocused
      ? "0 0 0 1px rgba(176, 141, 87, 0.3)"
      : "none",
    "&:hover": {
      borderColor: "var(--color-hmc-c)",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "2px 8px",
    flexWrap: "nowrap",
    overflowX: "auto",
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "rgba(176, 141, 87, 0.15)",
    flexShrink: 0,
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "var(--color-hmc-a)",
    fontSize: "11px",
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "var(--color-hmc-c)",
    ":hover": {
      backgroundColor: "var(--color-hmc-c)",
      color: "white",
    },
  }),

  option: (base, state) => ({
    ...base,
    fontSize: "13px",
    backgroundColor: state.isSelected
      ? "var(--color-hmc-c)"
      : state.isFocused
        ? "rgba(176, 141, 87, 0.12)"
        : "white",
    color: state.isSelected ? "white" : "var(--color-hmc-a)",
  }),
};


const EditProductForm = ({
  productEditFields,
  onSubmit,
  selectedProduct,
  productAttributes,
}) => {

  const defaultValues = productEditFields.reduce((acc, field) => {
  if (!field.is_editable) return acc;

  const value = selectedProduct[field.column_name];

  if (field.input_type === "checkbox") {
    acc[field.column_name] =
      value === true || value === "true" || value === 1;
  } else {
    acc[field.column_name] = value ?? "";
  }

  return acc;
}, {});

const {
  register,
  control,
  handleSubmit,
  formState,
  watch,
} = useForm({
  defaultValues,
});

  const [fieldsUpdated, setFieldsUpdated] = useState(false);
  const { isDirty, dirtyFields } = formState;

  useEffect(() => {
    setFieldsUpdated(isDirty);

    if (isDirty) {
      console.log("Some data changed:", dirtyFields);
    }
  }, [isDirty, dirtyFields]);

  const editableFields = productEditFields
    .filter((field) => field.is_editable)
    .sort((a, b) => {
      const groupA = a.group_id ?? 999;
      const groupB = b.group_id ?? 999;

      if (groupA !== groupB) {
        return groupA - groupB;
      }

      return (a.field_sort_order ?? 999) - (b.field_sort_order ?? 999);
    });

  const groupedFields = editableFields.reduce((acc, field) => {
    const groupId = field.group_id ?? 999;

    if (!acc[groupId]) {
      acc[groupId] = [];
    }

    acc[groupId].push(field);
    return acc;
  }, {});

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full min-h-0 flex-col"
    >
      <div className="mb-4 flex flex-none items-center justify-between">
        <h1 className="text-xl font-bold text-hmc-a">Product Edit</h1>

        {fieldsUpdated && (
          <div className="flex flex-none items-center gap-2 text-sm text-hmc-a">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
            <span>Warning unsaved changes</span>
          </div>
        )}

        <Button_A
          button_name="Update Product"
          button_type="form"
          link_val="/admin/add_product"
        />
      </div>

      <div className="flex-none space-y-4">
        {Object.entries(groupedFields).map(([groupId, fields]) => (
          <div
            key={groupId}
            className="flex flex-wrap items-end gap-x-4 gap-y-3"
          >
            {fields.map((field) => (
              <ProductEditField
                key={field.id}
                field={field}
                register={register}
                control={control}
                productAttributes={productAttributes}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 min-h-[500px] flex-1 overflow-hidden border">
        <div className="h-full overflow-y-auto p-2">
          {selectedProduct.product_images.length > 0 && (
            <DragDropProductImageGrid product={selectedProduct} />
          )}
        </div>
      </div>

      <div className="my-4 h-[90px] flex-none">
        <ProductImageUploaderDropzone product={selectedProduct} />
      </div>
    </form>
  );
};

function ProductEditField({ field, register, control, productAttributes }) {
  const {
    column_name,
    lookup_name,
    label,
    input_type,
    field_width,
  } = field;

  const lookupData = productAttributes?.[lookup_name || column_name] || [];

  const widthClassMap = {
    tiny: "w-[50px]",
    small: "w-[140px]",
    medium: "w-[260px]",
    large: "w-[420px]",
    xlarge: "w-[650px]",
    auto: "w-fit",
    full: "w-full",
  };

  const widthClass = widthClassMap[field_width] || "w-[260px]";

  const inputClassName =
    "w-full rounded-md border border-hmc-b/30 bg-white px-3 py-2 text-sm text-hmc-a shadow-sm transition focus:border-hmc-c focus:outline-none focus:ring-1 focus:ring-hmc-c/30";

  return (
    <div className={widthClass}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-hmc-a">
        {label}
      </label>

      {input_type === "textarea" ? (
        <textarea
          className={`${inputClassName} h-28 resize-none leading-relaxed`}
          {...register(column_name)}
        />
      ) : input_type === "array_lookup" ? (
        <ArrayLookupSelect
          control={control}
          name={column_name}
          listData={lookupData}
          fieldWidth={field_width}
        />
      ) : input_type === "checkbox" ? (
          <Controller
            name={column_name}
            control={control}
            render={({ field }) => (
              <div className="flex min-h-[38px] items-center justify-center">
                <input
                  type="checkbox"
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-hmc-b text-hmc-c focus:ring-hmc-c"
                />
              </div>
            )}
          />)
          : (
        <input
          type={input_type === "float" ? "number" : input_type}
          step={input_type === "float" ? "0.01" : undefined}
          className={inputClassName}
          {...register(column_name)}
        />
      )}
    </div>
  );
}

const ArrayLookupSelect = ({
  control,
  name,
  listData = [],
  fieldWidth = "medium",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const allOptions = listData.map((item) => ({
          ...item,
          value: item.id,
          label: item.label ?? item.name ?? item.value ?? item.id,
        }));

        const selectedOptions = Array.isArray(field.value)
          ? field.value
              .map((id) => allOptions.find((option) => option.id === id))
              .filter(Boolean)
          : [];

        return (
          <Select
            isMulti
            options={allOptions}
            value={selectedOptions}
            onChange={(selected) =>
              field.onChange(selected.map((option) => option.value))
            }
            className="text-sm"
            classNamePrefix="select"
            styles={adminSelectStyles}
          />
        );
      }}
    />
  );
};

export default ProductEditPage;

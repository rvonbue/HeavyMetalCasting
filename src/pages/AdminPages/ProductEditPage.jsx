import { useEffect, useState  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select';
import { toNumber } from 'lodash-es';
import { toast } from "sonner";
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

import { updateProductAPI, upsertProductVariantsAPI } from "../../api/productEditAPI.js";
import { updateProduct, upsertProductVariants } from "../../store/productsSlice";

import { PageContainer, Button_A, FormLabel, getProductImageLinks, HmcSelect } from "../../components/Resuables"; // MultiSelectDropdown
import ProductImageUploaderDropzone from "../../components/AdminPageComponents/ProductImageUploaderDropzone"; // MultiSelectDropdown
import {  TailwindSpinner } from "../../styles/Icons";
import { productImageLinks } from "../../staticData/PathData.js";
import DragDropProductImageGrid from "../../components/AdminPageComponents/DragDropProductImageGrid";


function ProductEditPage(){
  const { products,  productsLoading, productAttributes } = useSelector(state => state.products);
  const { productEditFields, adminDataLoaded } = useSelector(state => state.admin);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFormSubmit = async (formData) => {
    try {
      const updatedProduct = await updateProductAPI({
        productId: selectedProduct.id,
        productUpdates: formData,
      });

      dispatch(updateProduct(updatedProduct));

      toast.success("Product updated successfully");

      navigate("/admin/overview_products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  const queryParams = new URLSearchParams(location.search);
  const productId = toNumber(queryParams.get('product_id'));
  const selectedProduct = products.find((prd) => prd.id === productId);

  return  (
  <PageContainer bg="alt1" classNames={"relative"}>
    {(productsLoading || selectedProduct === undefined || !adminDataLoaded) ?
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
    alignItems: "flex-start",
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
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    padding: "4px 8px",
    overflow: "visible",
  }),

  multiValue: (base) => ({
    ...base,
    margin: 0,
    maxWidth: "180px",
    backgroundColor: "rgba(176, 141, 87, 0.15)",
  }),

  multiValueLabel: (base) => ({
    ...base,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "var(--color-hmc-a)",
    fontSize: "14px",
  }),

  multiValueRemove: (base) => ({
  ...base,
  color: "rgba(107, 91, 75, 0.5)",

  ":hover": {
    color: "var(--color-hmc-error)",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
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
  } = useForm({
    defaultValues,
  });

  const [fieldsUpdated, setFieldsUpdated] = useState(false);

  const { errors, isDirty, dirtyFields } = formState;

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

      if (groupA !== groupB) return groupA - groupB;

      return (a.field_sort_order ?? 999) - (b.field_sort_order ?? 999);
    });

  const groupedFields = editableFields.reduce((acc, field) => {
    const groupId = field.group_id ?? 999;

    if (!acc[groupId]) acc[groupId] = [];

    acc[groupId].push(field);
    return acc;
  }, {});

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full min-h-0 flex-col"
    >
      <div className="mb-4 flex flex-none items-center justify-between">
        <h1 className="text-xl font-bold text-hmc-textprimary">Product Edit</h1>

        {fieldsUpdated && (
          <div className="flex flex-none items-center gap-2 text-sm text-hmc-textprimary">
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
            className="flex flex-wrap items-start gap-x-4 gap-y-3"
          >
            {fields.map((field) => (
              <ProductEditField
                key={field.id}
                field={field}
                register={register}
                control={control}
                productAttributes={productAttributes}
                error={errors[field.column_name]}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <VariantStockGrid
          product={selectedProduct}
          productAttributes={productAttributes}
        />
      </div>

      <div className="grid grid-cols-[80%_20%] gap-4 mt-4">
        <div className=" overflow-hidden border">
          <div className="h-full overflow-y-auto px-2">
            {selectedProduct.product_images.length > 0 && (
              <DragDropProductImageGrid product={selectedProduct} />
            )}
          </div>
        </div>

        <div className="h-[90px] w-full pr-2 ">
          <ProductImageUploaderDropzone product={selectedProduct} />
        </div>
      </div>
    </form>
  );
};
function ProductEditField({
  field,
  register,
  control,
  productAttributes,
  error,
}) {
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

  const inputClassName = `
    w-full rounded-md border bg-white px-3 py-2 text-sm text-hmc-textprimary shadow-sm transition focus:outline-none focus:ring-1
    ${
      error
        ? "border-red-500 focus:border-red-500 focus:ring-red-300"
        : "border-hmc-b/30 focus:border-hmc-c focus:ring-hmc-c/30"
    }
  `;

  const validationRules = buildValidation(field);

  return (
    <div className={widthClass + " max-w-full"}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-hmc-textprimary">
        {label}
      </label>

      {input_type === "textarea" ? (
        <textarea
          autoComplete="off"
          className={`${inputClassName} h-28 resize-none leading-relaxed`}
          {...register(column_name, validationRules)}
        />
      ) : input_type === "array_lookup" ? (
        <ArrayLookupSelect
          control={control}
          name={column_name}
          listData={lookupData}
          fieldWidth={field_width}
          rules={validationRules}
          hasError={Boolean(error)}
        />
      ) : input_type === "checkbox" ? (
        <Controller
          name={column_name}
          control={control}
          rules={validationRules}
          render={({ field }) => (
            <div className="flex min-h-[38px] items-center justify-center">
              <input
                type="checkbox"
                autoComplete="off"
                checked={Boolean(field.value)}
                onChange={(e) => field.onChange(e.target.checked)}
                className={`h-4 w-4 cursor-pointer rounded focus:ring-hmc-c ${
                  error
                    ? "border-red-500 text-red-600"
                    : "border-hmc-b text-hmc-c"
                }`}
              />
            </div>
          )}
        />
      ) : (
        <input
        
          type={input_type === "float" ? "number" : input_type}
          step={input_type === "float" ? "0.01" : undefined}
          className={inputClassName}
          {...register(column_name, validationRules)}
        />
      )}

      {error?.message && (
        <p className="mt-1 text-xs font-medium text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}

const ArrayLookupSelect = ({ control, name, listData = [] }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const options = listData.map((item) => ({
          ...item,
          value: item.id,
          label: item.label ?? item.name ?? item.value ?? item.id,
        }));

        const selectedOptions = Array.isArray(field.value)
          ? field.value
              .map((id) => options.find((option) => option.value === id))
              .filter(Boolean)
          : [];

        return (
          <HmcSelect
            isMulti
            options={options}
            value={selectedOptions}
            onChange={(selected) =>
              field.onChange(selected.map((option) => option.value))
            }
          />
        );
      }}
    />
  );
};

function VariantStockGrid({ product, productAttributes }) {
  const dispatch = useDispatch();
  const { size_charts, metal_types } = productAttributes;

  const sizeOptions = (product.size_chart ?? []).flatMap((chartId) => {
    const chart = size_charts.find((sc) => sc.id === chartId);
    return (chart?.options ?? []).map((opt) => ({
      chartId,
      value: String(opt.value),
      label: opt.label,
    }));
  });

  const productMetalTypes = (product.metal_types ?? [])
    .map((mtId) => metal_types.find((mt) => mt.id === mtId))
    .filter(Boolean);

  const variantMap = (product.product_variants ?? []).reduce((acc, v) => {
    acc[`${v.size_chart_id}:${v.size_value}:${v.metal_type_id}`] = v;
    return acc;
  }, {});

  if (!sizeOptions.length || !productMetalTypes.length) return null;

  async function handleStockBlur({ sizeChartId, sizeValue, metalTypeId, stock }) {
    try {
      const saved = await upsertProductVariantsAPI({
        productId: product.id,
        variants: [{ size_chart_id: sizeChartId, size_value: sizeValue, metal_type_id: metalTypeId, stock }],
      });
      dispatch(upsertProductVariants({ productId: product.id, variants: saved }));
    } catch (err) {
      console.error('Failed to save variant stock', err);
      toast.error('Failed to save stock');
    }
  }

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-hmc-textprimary">
        Stock
      </h2>
      <div className="overflow-x-auto rounded border border-hmc-border-a">
        <table className="text-sm">
          <thead className="bg-hmc-button-a text-hmc-button-text-a">
            <tr>
              <th className="px-3 py-2 text-left font-bold uppercase text-xs">Size</th>
              {productMetalTypes.map((mt) => (
                <th key={mt.id} className="px-3 py-2 text-left font-bold uppercase text-xs">
                  {mt.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeOptions.map((size) => (
              <tr key={`${size.chartId}:${size.value}`} className="border-t border-hmc-border-b">
                <td className="px-3 py-2 font-medium text-hmc-textprimary">{size.label}</td>
                {productMetalTypes.map((mt) => {
                  const key = `${size.chartId}:${size.value}:${mt.id}`;
                  const variant = variantMap[key];
                  return (
                    <td key={mt.id} className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        defaultValue={variant?.stock ?? 0}
                        onBlur={(e) =>
                          handleStockBlur({
                            sizeChartId: size.chartId,
                            sizeValue: size.value,
                            metalTypeId: mt.id,
                            stock: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-20 rounded border border-hmc-b/30 px-2 py-1 text-sm text-hmc-textprimary focus:border-hmc-c focus:outline-none focus:ring-1 focus:ring-hmc-c/30"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function buildValidation(field) {
  const rules = {};

  if (field.is_required) {
    rules.required = `${field.label} is required`;
  }

  if (field.max_length) {
    rules.maxLength = {
      value: field.max_length,
      message: `Maximum ${field.max_length} characters`,
    };
  }

  if (field.min_value != null) {
    rules.min = {
      value: field.min_value,
      message: `Minimum value is ${field.min_value}`,
    };
  }

  if (field.max_value != null) {
    rules.max = {
      value: field.max_value,
      message: `Maximum value is ${field.max_value}`,
    };
  }

  return rules;
}

export default ProductEditPage;

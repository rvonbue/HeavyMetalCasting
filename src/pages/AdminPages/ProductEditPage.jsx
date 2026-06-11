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

const customStyles = {
  multiValueLabel: (base) => ({
      ...base,
      fontSize: '1.2rem', // Change to your desired font size
  }),
};

const EditProductForm = ({ productEditFields, onSubmit, selectedProduct, productAttributes  }) => {
  const {
    register,
    control,
    handleSubmit,
    formState,
  } = useForm({
    defaultValues: productEditFields.reduce((acc, field) => {
      const { column_name, is_editable } = field;

      if (is_editable) {
        acc[column_name] = selectedProduct[column_name];
      }

      return acc;
    }, {}),
  });

  const [fieldsUpdated, setFieldsUpdated] = useState(false);

  const { errors, isDirty, dirtyFields } = formState;

  useEffect(() => {
    setFieldsUpdated(isDirty);

    if (isDirty) {
      console.log("Some data changed:", dirtyFields);
    }
  }, [isDirty, dirtyFields]);

  return (  
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full min-h-0 flex-col"
      >
        {/* Header */}
        <div className="mb-4 flex flex-none items-center justify-between">
          <h1 className="text-xl font-bold">Product Edit</h1>

          <Button_A
            button_name="Update Product"
            button_type="form"
            link_val="/admin/add_product"
          />
        </div>

        {/* Fields: content height only */}
        <div className="flex-none">
          <div className="flex flex-wrap gap-4">
            {productEditFields
              .filter((field) => field.is_editable)
              .map((field) => (
                <ProductEditField
                  key={field.id}
                  field={field}
                  register={register}
                  control={control}
                  productAttributes={productAttributes}
                />
              ))}
          </div>
        </div>

        {/* Gallery: takes remaining space */}
        <div className="mt-4 flex-1 min-h-0 overflow-hidden rounded border">
          <div className="h-full overflow-y-auto p-2">
            {selectedProduct.product_images.length > 0 && (
              <DragDropProductImageGrid product={selectedProduct} />
            )}
          </div>
        </div>

        {/* Dropzone: fixed bottom */}
        <div className="mt-4 h-[90px] flex-none">
          <ProductImageUploaderDropzone product={selectedProduct} />
        </div>

        {fieldsUpdated && (
          <div className="mt-2 flex flex-none items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
            <span>Warning unsaved changes</span>
          </div>
        )}
      </form>
    </>
  );
};
function ProductEditField({
  field,
  register,
  control,
  productAttributes,
}) {
  const { column_name, label, input_type } = field;

  const lookupData = productAttributes?.[column_name] || [];

  return (
    <div className="box-border flex flex-row items-center gap-2">
      <FormLabel
        classNames="text-left min-w-[150px]"
        labelName={label}
      />

      {input_type === "textarea" ? (
        <textarea
          className="h-32 w-full resize-none rounded border border-gray-300 p-2"
          {...register(column_name)}
        />
      ) : input_type === "array_lookup" ? (
        <ArrayLookupSelect
          control={control}
          name={column_name}
          listData={lookupData}
        />
      ) : input_type === "checkbox" ? (
        <input
          type="checkbox"
          className="h-5 w-5 cursor-pointer"
          {...register(column_name)}
        />
      ) : (
        <input
          type={input_type === "float" ? "number" : input_type}
          step={input_type === "float" ? "0.01" : undefined}
          className="w-full rounded border border-gray-300 p-2"
          {...register(column_name)}
        />
      )}
    </div>
  );
}

const ArrayLookupSelect = ({ control, name, listData = [] }) => {
  return (
    <div className="w-full">
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
              className="basic-multi-select"
              classNamePrefix="select"
              styles={customStyles}
            />
          );
        }}
      />
    </div>
  );
};

export default ProductEditPage;

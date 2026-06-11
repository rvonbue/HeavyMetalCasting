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
    defaultValues: 
      productEditFields.reduce((acc, { name, editable }) => {
        if(editable) {
          acc[name] = selectedProduct[name];
        }
        return acc;
      },{}) || {},
  });

  const [fieldsUpdated, setFieldsUpdated] = useState();
  const { errors } = formState;
  const isDirty = formState.isDirty; // true if any field has changed
  const dirtyFields = formState.dirtyFields; // which fields changed

  useEffect(() => {
    if (isDirty) {
      setFieldsUpdated(true);
      console.log('Some data changed:', dirtyFields);
    } else {
      setFieldsUpdated(false);
    }
  }, [isDirty, dirtyFields, setFieldsUpdated]);

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
              .filter((prop) => prop.editable)
              .map(({ label, type, name, inputProps, classNames, inputStyles, divStyles }) => (
                <div
                  key={name}
                  className="box-border flex flex-row items-center gap-2"
                  style={divStyles}
                >
                  <FormLabel
                    classNames={`text-left ${classNames ? classNames : ""}`}
                    labelName={label}
                  />

                  {type === "textarea" ? (
                    <textarea
                      className="h-32 w-full resize-none rounded border border-gray-300 p-2"
                      {...register(name, { ...inputProps })}
                    />
                  ) : type === "list" ? (
                    <CategorySelectComponent
                      control={control}
                      name={name}
                      inputStyles={inputStyles}
                      listData={productAttributes[name]}
                    />
                  ) : (
                    <input
                      type={type}
                      className="w-full rounded border border-gray-300 p-2"
                      style={{ cursor: "pointer", ...inputStyles }}
                      {...inputProps}
                      {...register(name, { ...inputProps })}
                    />
                  )}
                </div>
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
const CategorySelectComponent = ({ control, name, inputStyles, listData}) => {
    
    return ( 
      <div style={inputStyles}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const allCategories = listData.map((cat) => ({...cat, value: cat.id }));
            console.log("allCategories:", allCategories);
            const selectedOptions = field.value.map((id) => allCategories.find((cat) => cat.id === id ));
            return (
              <Select
                  {...field} 
                  isMulti
                  onChange={(changeOptions) => field.onChange(changeOptions.map((opt) => opt.value))} // Update the value in react-hook-form
                  options={allCategories}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={selectedOptions}
                  styles={customStyles}
              />
            )
          }}
          
        />
      </div>)
}

export default ProductEditPage;

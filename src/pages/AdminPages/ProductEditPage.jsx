import { useEffect, useState  } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { toNumber } from 'lodash-es';

import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
// import { useOutletContext } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../../AppState'
import { PageContainer, Button_A, FormLabel } from "../../components/Resuables"; // MultiSelectDropdown
import {  TailwindSpinner } from "../../styles/Icons";
import { productImageLinks } from "../../staticData/PathData.js";

function ProductEditPage(){
  const { products, productProps, productsLoading, productCategories } = useAppState();
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
        productProps={productProps} 
        productCategories={productCategories}
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

const EditProductForm = ({ productProps, onSubmit, selectedProduct, productCategories  }) => {
  const {
    register,
    control,
    handleSubmit,
    formState,
  } = useForm({
    defaultValues: 
      productProps.reduce((acc, { dataName, userEdit }) => {
        if(userEdit) {
          acc[dataName] = selectedProduct[dataName];
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Edit</h1>
        <Button_A button_name="Update Product" button_type="form" link_val="/admin/add_product" /> {/*  button_styles_outer={{ position: "fixed", right: "24px"}} */}
      </div>
        <div className="flex flex-wrap gap-4">
          {productProps
            .filter((prop) => prop.userEdit)
            .map(({ adminDisplayName, dataType, dataName, inputProps, classNames, inputStyles, divStyles }) => (
              <div key={dataName}  className="flex flex-row items-center gap-2 box-border" style={divStyles}>
                <FormLabel classNames={`text-left ${classNames ? classNames : ""}`} labelName={adminDisplayName}/>
                { dataType === "textarea" ? 
                  <textarea
                    className="border border-gray-300 p-2 rounded w-full h-32 resize-none"
                    {...register(dataName, { required: true })}
                  /> :
                dataType === "list" ? 
                  <CategorySelectComponent 
                    control={control}
                    dataName={dataName}
                    inputStyles={inputStyles}
                    productCategories={productCategories}
                  />
                  :
                <input
                  type={dataType}
                  className="border border-gray-300 p-2 rounded w-full"
                  style={{cursor: "pointer", ...inputStyles}}
                  {...inputProps}
                  {...register(dataName, { required: true })}
                />
                }
                {errors[dataName] && (
                  <span className="text-red-500 text-sm">
                    {adminDisplayName} is required.
                  </span>
                )}
              </div>
            ))}
          </div>
          <ProductImageGrid images={selectedProduct.images}/>
        
        { fieldsUpdated && 
          <div className="flex ">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" /> 
            Warning unsaved changes
          </div>}
      </form>
    </>
  );
};
const CategorySelectComponent = ({ control, dataName, inputStyles, productCategories}) => {
    
    return ( 
      <div style={inputStyles}>
        <Controller
          name={dataName}
          control={control}
          render={({ field }) => {
            const allCategories = productCategories.map((cat) => ({...cat, value: cat.id }));
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

const ProductImageGrid = ({ images }) => (
  <>
  <FormLabel labelName={"Image Gallery"}/>
  <hr className="bg-hmc-a"/>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
    {images.map((src, idx) => (
      <div
        key={idx}
        className="w-full aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center"
      >
        <img
          src={`${productImageLinks}${src}`}
          alt={`Thumbnail ${idx}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    ))}
  </div>
  </>
);


export default ProductEditPage;
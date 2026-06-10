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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Edit</h1>
        <Button_A button_name="Update Product" button_type="form" link_val="/admin/add_product" /> {/*  button_styles_outer={{ position: "fixed", right: "24px"}} */}
      </div>
        <div className="flex flex-wrap gap-4">
          {productEditFields
            .filter((prop) => prop.editable)
            .map(({ label, type, name, inputProps, classNames, inputStyles, divStyles }) => (
              <div key={name}  className="flex flex-row items-center gap-2 box-border" style={divStyles}>
                <FormLabel classNames={`text-left ${classNames ? classNames : ""}`} labelName={label}/>
                { type === "textarea" ? 
                  <textarea
                    className="border border-gray-300 p-2 rounded w-full h-32 resize-none"
                    {...register(name, { ...inputProps })}
                  /> :
                type === "list" ? 
                  <CategorySelectComponent 
                    control={control}
                    name={name}
                    inputStyles={inputStyles}
                    listData={productAttributes[name]}
                  />
                  :
                <input
                  type={type}
                  className="border border-gray-300 p-2 rounded w-full"
                  style={{cursor: "pointer", ...inputStyles}}
                  {...inputProps}
                  {...register(name, { ...inputProps })}
                />
                }
                {errors[name] && (
                  <span className="text-red-500 text-sm">
                    {label} is required.
                  </span>
                )}
              </div>
            ))}
          </div>
          {selectedProduct.product_images.length > 0  && <DragDropProductImageGrid product={selectedProduct}/> }
          <ProductImageUploaderDropzone product={selectedProduct} /> 
        { fieldsUpdated && 
          <div className="flex ">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" /> 
            Warning unsaved changes
          </div>}
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
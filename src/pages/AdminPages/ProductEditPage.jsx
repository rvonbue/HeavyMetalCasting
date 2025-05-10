import React, { useState } from 'react';
import { useForm } from "react-hook-form";


function ProductEditPage({ productProps }){
  const handleFormSubmit = (data) => {
    console.log("Updated product:", data);
  };
  return null;
  // return <EditProductForm productProps={productProps} onSubmit={handleFormSubmit} />;
}

const EditProductForm = ({ productProps, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {productProps
        .filter((prop) => prop.userEdit)
        .map(({ adminDisplayName, dataType, dataName }) => (
          <div key={dataName} className="flex flex-col">
            <label className="mb-1 font-medium">{adminDisplayName}</label>
            <input
              type={dataType}
              {...register(dataName, { required: true })}
              className="border border-gray-300 p-2 rounded"
            />
            {errors[dataName] && (
              <span className="text-red-500 text-sm">
                {adminDisplayName} is required.
              </span>
            )}
          </div>
        ))}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Save Product
      </button>
    </form>
  );
};

export default ProductEditPage;
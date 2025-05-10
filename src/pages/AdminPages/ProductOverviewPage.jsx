import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { NavLink } from "react-router";
import { PencilIcon, TrashIcon } from "../../styles/Icons";

export default function ProductOverviewPage() {
  const { productProps, setProductProps, products } = useOutletContext();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <NavLink to="/admin/add_product" end style={{padding: "0px 8px", color: "inherit"}}>+ Add Product</NavLink>  
        </div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {productProps.map(({ adminDisplayName }, index) => <th key={ index + adminDisplayName } className="p-3 border-b text-left">{adminDisplayName}</th>)}
              <th className="p-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {productProps.map(({ dataName }, index) => <td key={ index + dataName } className="p-3 border-b text-left">{product[dataName]}</td>)}
                <td className="p-3 border-b text-left">
                  <div className="flex justify-left">
                    <NavLink 
                      to={`/admin/edit_product?product_id=${product.id}`} 
                      end 
                      style={{padding: "0px 8px", color: "inherit"}}
                    >
                      <PencilIcon classes={"mr-4"}/>
                    </NavLink>
                    <TrashIcon />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

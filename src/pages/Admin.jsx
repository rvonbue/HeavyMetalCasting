import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink } from "react-router";
import { useAppState, useAppDispatch } from '../AppState'
import { FolderTab } from "../components/Resuables";

function AdminPage() {
  const { products, howShoppingCart } = useAppState();
  const [productProps, setProductProps] = useState([
      { 
        adminDisplayName: "ID", 
        storeDisplayName: "", 
        dataType: "number", 
        dataName: "id",
        userEdit: false 
      },
      { 
        adminDisplayName: "Product Name", 
        storeDisplayName: "", 
        dataType: "text", 
        dataName: "name",
        userEdit: true 
      },
      { 
        adminDisplayName: "Price", 
        storeDisplayName: "", 
        dataType: "number", 
        dataName: "price",
        userEdit: true 
      },
      { 
        adminDisplayName: "Stock",
        storeDisplayName: "",  
        dataType: "number", 
        dataName: "stock",
        userEdit: true 
      },
      { 
        adminDisplayName: "Description", 
        storeDisplayName: "", 
        dataType: "text", 
        dataName: "description",
        userEdit: true 
      },
  ]);


  const childrenProps = {
      productProps, 
      setProductProps,
      products
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl text-hmc-a font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center">
        <NavLink to="/admin/orders" end style={{padding: "0px 8px", color: "inherit"}}>
         {({ isActive }) => (
          <FolderTab
            label="Orders"
            selected={isActive}
          />
         )}
        </NavLink>
        <NavLink to="/admin/overview_products" end style={{padding: "0px 8px", color: "inherit"}}>
        {({ isActive }) => (
          <FolderTab
            label="Product Managment"
            selected={isActive}
          />
        )}
        </NavLink>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded shadow p-4 mt-2" >
        <Outlet context={childrenProps} />
      </div>
    </div>
  );
}

export default AdminPage;
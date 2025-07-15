import { useState } from 'react';
import { Outlet, useMatch  } from 'react-router-dom';
import { NavLink } from "react-router";
import { useAppState, useAppDispatch } from '../../AppState'
import { FolderTab } from "../../components/Resuables";

function AdminPage() {
  const { toolbarHeight } = useAppState();

  const editMatch = useMatch('/admin/edit_product')
  const overviewMatch = useMatch('/admin/overview_products');
  const addingMatch = useMatch('/admin/add_product');
  const productManagementLabelStatus = `${editMatch ? " (editing)" : ""}${overviewMatch ? " (overview)" : ""}${addingMatch ? " (adding)" : ""}`;

  return (
    <div className={`flex flex-col h-[calc(100vh-${toolbarHeight}px)] `}>
      {/* Component-local header (if you still want one) */}
      {/* <header className="flex-none p-1">
        <h1 className="text-4xl text-hmc-a font-bold">Admin Dashboard</h1>
      </header> */}

      {/* Tabs */}
      <nav className="flex-none flex justify-center space-x-4 overflow-hidden">
        <NavLink to="/admin/orders" end style={{ color: 'inherit' }}>
          {({ isActive }) => <FolderTab label="Orders" selected={isActive} />}
        </NavLink>
        <NavLink to="/admin/overview_products" end style={{ color: 'inherit' }}>
           <FolderTab label={"Product Management"} labelStatus={productManagementLabelStatus} selected={editMatch || overviewMatch || addingMatch} />
        </NavLink>
      </nav>

      {/* This will now be exactly (100vh - 56px) minus the nav height, and scroll internally */}
      <main className="flex-1 min-h-0 overflow-y-auto p-0">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPage;
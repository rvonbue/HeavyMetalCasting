import { useEffect } from "react";
import { Outlet, useMatch, NavLink  } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { FolderTab } from "../../components/Resuables";
import { supabase } from '../../lib/supabase';
import {
  setProducts,
  setProductsLoading,
} from '../../store/productsSlice';
import {
  setAdminInitialData
} from '../../store/adminSlice';
import { getAdminInitialData } from "../../api/adminAPI.js";

function AdminPage() {
  const { toolbarHeight } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const editMatch = useMatch('/admin/edit_product')
  const overviewMatch = useMatch('/admin/overview_products');
  const addingMatch = useMatch('/admin/add_product');
  const productManagementLabelStatus = `${editMatch ? " (editing)" : ""}${overviewMatch ? " (overview)" : ""}${addingMatch ? " (adding)" : ""}`;

useEffect(() => {
  async function loadFields() {
    const fields = await getAdminInitialData();
    dispatch(setAdminInitialData(fields));
  }

  loadFields();
}, [dispatch]);

  return (
    <div className={`flex flex-col h-[calc(100vh-${toolbarHeight}px)] `}>
      {/* <nav className="flex-none flex justify-center space-x-4 overflow-hidden">
        <NavLink to="/admin/orders" end style={{ color: 'inherit' }}>
          {({ isActive }) => <FolderTab label="Orders" selected={isActive} />}
        </NavLink>
        <NavLink to="/admin/overview_products" end style={{ color: 'inherit' }}>
           <FolderTab 
              label={"Product Management"} 
              labelStatus={productManagementLabelStatus} 
              selected={editMatch || overviewMatch || addingMatch} 
           />
        </NavLink>
      </nav> */}

      <main className="flex-1 min-h-0 overflow-y-auto p-0">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPage;
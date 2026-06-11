import { Link, useNavigate } from "react-router-dom";
import { HmcSelect } from "../Resuables";

export const ADMIN_ROUTES = [
  {
    value: "/admin",
    label: "Orders",
  },
  {
    value: "/admin/overview_products",
    label: "Products Overview",
  },
  {
    value: "/admin/add_product",
    label: "Add Product",
  },
  {
    value: "/admin/product_fields",
    label: "Product Fields",
  },
  {
    value: "/admin/store_settings",
    label: "Store Settings",
  },
];

export default function AdminMenu() {
  const navigate = useNavigate();

  return (
    <div className="w-[175px]">
      <HmcSelect
        options={ADMIN_ROUTES}
        value={undefined}
        onChange={(option)=> navigate((option.value))}
        placeholder="ADMIN"
      />
    </div>
  );
}
import { useNavigate, useLocation } from "react-router-dom";
import { HmcSelect } from "../Resuables";

export const ADMIN_ROUTES = [
  {
    value: "/admin/overview_orders",
    label: "Orders Overview",
  },
  {
    value: "/admin/overview_products",
    label: "Product Overview",
  },
  {
    value: "/admin/event_overview",
    label: "Event Overview",
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
  const { pathname } = useLocation();

  const selectedOption = ADMIN_ROUTES.find(r => pathname.startsWith(r.value)) ?? null;

  return (
    <div className="w-[350px]">
      <HmcSelect
        options={ADMIN_ROUTES}
        value={selectedOption}
        onChange={(option) => navigate(option.value)}
        placeholder="ADMIN"
      />
    </div>
  );
}
import { useRole } from "../hooks/useRole";
import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InventoryStocks from "../components/Inventory/stocks/InventoryStocks";
import PharmacyStockPage from "../components/Pharmacy/stocks/PharmacyStockPage";
const roleComponents: Record<string, JSX.Element> = {
  //   superadmin: <SuperAdminOverview />,
  "inventory-manager": <InventoryStocks />,
  pharmacist: <PharmacyStockPage />,

  //   frontdesk: <FrontdeskOverview />,
};
const Stocks = () => {
  const navigate = useNavigate();
  const role = useRole();
  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Stocks;

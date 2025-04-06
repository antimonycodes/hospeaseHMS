import { useRole } from "../hooks/useRole";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import InventoryStocks from "../components/Inventory/stocks/InventoryStocks";
const roleComponents: Record<string, JSX.Element> = {
  //   superadmin: <SuperAdminOverview />,
  "inventory-manager": <InventoryStocks />,

  //   frontdesk: <FrontdeskOverview />,
};
const Stocks = () => {
  const navigate = useNavigate();
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : (navigate("/signin"), null);
};

export default Stocks;

import InventoryStocks from "../components/Inventory/stocks/InventoryStocks";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";
const roleComponents: Record<string, JSX.Element> = {
    //   superadmin: <SuperAdminOverview />,
    inventory:<InventoryStocks/>
  
    //   frontdesk: <FrontdeskOverview />,
  };
const Stocks = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Stocks
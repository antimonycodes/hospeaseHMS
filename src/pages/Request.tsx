import InventoryRequest from "../components/Inventory/request/InventoryRequest";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";
const roleComponents: Record<string, JSX.Element> = {
    //   superadmin: <SuperAdminOverview />,
    inventory:<InventoryRequest/>
    //   frontdesk: <FrontdeskOverview />,
  };
const Request = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Request
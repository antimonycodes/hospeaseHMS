import InventoryRequest from "../components/Inventory/request/InventoryRequest";
import { useRole } from "../hooks/useRole";
import { useNavigate } from "react-router-dom";
import { JSX } from "react";
const roleComponents: Record<string, JSX.Element> = {
  //   superadmin: <SuperAdminOverview />,
  "inventory-manager": <InventoryRequest />,
  //   frontdesk: <FrontdeskOverview />,
};
const Request = () => {
  const navigate = useNavigate();
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : (navigate("/signin"), null);
};

export default Request;

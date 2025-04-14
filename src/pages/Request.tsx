import InventoryRequest from "../components/Inventory/request/InventoryRequest";
import { useRole } from "../hooks/useRole";
import { useNavigate } from "react-router-dom";
import { JSX, useEffect } from "react";
const roleComponents: Record<string, JSX.Element> = {
  //   superadmin: <SuperAdminOverview />,
  "inventory-manager": <InventoryRequest />,
  //   frontdesk: <FrontdeskOverview />,
};
const Request = () => {
  const navigate = useNavigate();
  const role = useRole();
  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Request;

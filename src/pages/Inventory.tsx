import { JSX } from "react";
import { useRole } from "../hooks/useRole";
import { useNavigate } from "react-router-dom";
import PharmInventory from "../components/Pharmacy/Inventory/PharmInventory";
import SaInventoryPage from "../components/Superadmin/Inventory/SaInventoryPage";
const roleComponents: Record<string, JSX.Element> = {
  admin: <SaInventoryPage />,
  pharmacist: <PharmInventory />,

  //   doctor:  ,
  // frontdesk: ,
};

const Inventory = () => {
  const navigate = useNavigate();
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : (navigate("/signin"), null);
};

export default Inventory;

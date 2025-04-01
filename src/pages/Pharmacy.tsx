import { JSX } from "react";
import SaPharnacyPage from "../components/Superadmin/pharmacy/SaPharnacyPage";
import { useRole } from "../hooks/useRole";
import PharmInventory from "../components/Pharmacy/Inventory/PharmInventory";
import { useNavigate } from "react-router-dom";
const roleComponents: Record<string, JSX.Element> = {
  admin: <SaPharnacyPage />,
  pharmacy: <PharmInventory />,

  //   doctor:  ,
  // frontdesk: ,
};

const Pharmacy = () => {
  const navigate = useNavigate();
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : (navigate("/signin"), null);
};

export default Pharmacy;

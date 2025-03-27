import { JSX } from "react";
import SaPharnacyPage from "../components/Superadmin/pharmacy/SaPharnacyPage";
import { useRole } from "../hooks/useRole";
import PharmInventory from "../components/Pharmacy/Inventory/PharmInventory";

const roleComponents: Record<string, JSX.Element> = {
  superadmin: <SaPharnacyPage />,
  pharmacy: <PharmInventory />,

  //   doctor:  ,
  // frontdesk: ,
};

const Pharmacy = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Pharmacy;

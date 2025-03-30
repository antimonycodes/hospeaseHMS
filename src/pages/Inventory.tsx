import { JSX } from "react";
 import { useRole } from "../hooks/useRole";
import PharmInventory from "../components/Pharmacy/Inventory/PharmInventory";
const roleComponents: Record<string, JSX.Element> = {
 
  pharmacy: <PharmInventory />,
 
  //   doctor:  ,
  // frontdesk: ,
};


const Inventory = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Inventory
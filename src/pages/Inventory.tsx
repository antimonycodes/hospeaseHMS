import { JSX, useEffect } from "react";
import { useRole } from "../hooks/useRole";
import { useNavigate } from "react-router-dom";
import PharmInventory from "../components/Pharmacy/Inventory/PharmInventory";
import SaInventoryPage from "../components/Superadmin/Inventory/SaInventoryPage";
const roleComponents: Record<string, JSX.Element> = {
  pharmacist: <PharmInventory />,
  admin: <SaInventoryPage />,

  //   doctor:  ,
  // frontdesk: ,
};

const Inventory = () => {
  const navigate = useNavigate();
  const role = useRole();

  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Inventory;

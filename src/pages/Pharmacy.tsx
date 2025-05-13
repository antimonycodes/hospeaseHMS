import { JSX, useEffect } from "react";
import SaPharnacyPage from "../components/Superadmin/pharmacy/SaPharnacyPage";
import { useRole } from "../hooks/useRole";
import PharmInventory from "../components/Pharmacy/Inventory/PharmInventory";
import { useNavigate } from "react-router-dom";
const roleComponents: Record<string, JSX.Element> = {
  admin: <SaPharnacyPage />,
  "platform-manager": <SaPharnacyPage />,
  pharmacy: <PharmInventory />,

  //   doctor:  ,
  // frontdesk: ,
};

const Pharmacy = () => {
  const navigate = useNavigate();
  const role = useRole();
  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Pharmacy;

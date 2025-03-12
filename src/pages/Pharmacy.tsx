import { JSX } from "react";
import SaPharnacyPage from "../components/Superadmin/pharmacy/SaPharnacyPage";
import { useRole } from "../hooks/useRole";

const roleComponents: Record<string, JSX.Element> = {
  superadmin: <SaPharnacyPage />,
  //   doctor:  ,
  // frontdesk: ,
};

const Pharmacy = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Pharmacy;

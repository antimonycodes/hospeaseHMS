import SaLaboratoryPage from "../components/Superadmin/laboratory/SaLaboratoryPage";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";

const roleComponents: Record<string, JSX.Element> = {
  admin: <SaLaboratoryPage />,
  // doctor:
  // frontdesk:
};

const Laboratory = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Laboratory;

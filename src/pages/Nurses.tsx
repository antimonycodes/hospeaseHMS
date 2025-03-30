import { JSX } from "react";
import { useRole } from "../hooks/useRole";
import SaNursesPage from "../components/Superadmin/nurses/SaNursesPage";
import MatronNurse from "../components/Matron/nurse/MatronNurse";

const roleComponents: Record<string, JSX.Element> = {
  matron: <MatronNurse />,
  admin: <SaNursesPage />,
  //   doctor:  ,
  // frontdesk:
};

const Nurses = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Nurses;

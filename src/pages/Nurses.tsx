import { JSX } from "react";
import { useRole } from "../hooks/useRole";
import SaNursesPage from "../components/Superadmin/nurses/SaNursesPage";
import MatronNurse from "../components/Matron/nurse/MatronNurse";

const roleComponents: Record<string, JSX.Element> = {
<<<<<<< HEAD
  superadmin: <SaNursesPage />,
  matron: <MatronNurse />,
=======
  admin: <SaNursesPage />,
>>>>>>> da874f1729ae2ef9f1db1d7067124aae49e10fa6
  //   doctor:  ,
  // frontdesk:
};

const Nurses = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Nurses;

import { JSX, useEffect } from "react";
import { useRole } from "../hooks/useRole";
import SaNursesPage from "../components/Superadmin/nurses/SaNursesPage";
import MatronNurse from "../components/Matron/nurse/MatronNurse";
import { useNavigate } from "react-router-dom";

const roleComponents: Record<string, JSX.Element> = {
  matron: <MatronNurse />,
  admin: <SaNursesPage />,

  //   doctor:  ,
  // frontdesk:
};

const Nurses = () => {
  const navigate = useNavigate();

  const role = useRole();

  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Nurses;

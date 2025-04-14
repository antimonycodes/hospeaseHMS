import { useNavigate } from "react-router-dom";
import SaLaboratoryPage from "../components/Superadmin/laboratory/SaLaboratoryPage";
import { useRole } from "../hooks/useRole";
import { JSX, useEffect } from "react";

const roleComponents: Record<string, JSX.Element> = {
  admin: <SaLaboratoryPage />,
  // doctor:
  // frontdesk:
};

const Laboratory = () => {
  const navigate = useNavigate();

  const role = useRole();
  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Laboratory;

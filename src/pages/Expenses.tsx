import { useNavigate } from "react-router-dom";
import Fexpenses from "../components/Finance/expenses/Fexpenses";
import { useRole } from "../hooks/useRole";
import { JSX, useEffect } from "react";

const roleComponents: Record<string, JSX.Element> = {
  finance: <Fexpenses />,
  "front-desk-manager": <Fexpenses />,

  // doctor:
  // frontdesk:
};
const Expenses = () => {
  const navigate = useNavigate();

  const role = useRole();

  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Expenses;

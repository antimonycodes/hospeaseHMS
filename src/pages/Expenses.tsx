import { useNavigate } from "react-router-dom";
import Fexpenses from "../components/Finance/expenses/Fexpenses";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";

const roleComponents: Record<string, JSX.Element> = {
  finance: <Fexpenses />,
  // doctor:
  // frontdesk:
};
const Expenses = () => {
  const navigate = useNavigate();

  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : (navigate("/signin"), null);
};

export default Expenses;

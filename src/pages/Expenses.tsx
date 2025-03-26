import Fexpenses from "../components/Finance/expenses/Fexpenses";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";
const roleComponents: Record<string, JSX.Element> = {
  finance: <Fexpenses />,
  // doctor:
  // frontdesk:
};
const Expenses = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Expenses;

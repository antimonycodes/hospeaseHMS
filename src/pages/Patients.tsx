import { JSX } from "react";
import PatientsPage from "../components/Superadmin/patients/PatientsPage";
import { useRole } from "../hooks/useRole";
import FpatientsTable from "../components/Frontdesk/patients/FpatientsTable";

const roleComponents: Record<string, JSX.Element> = {
  superadmin: <PatientsPage />,
  //   doctor:  ,
  frontdesk: <FpatientsTable />,
};

const Patients = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Patients;

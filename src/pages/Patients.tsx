import { JSX } from "react";
import PatientsPage from "../components/Superadmin/patients/PatientsPage";
import { useRole } from "../hooks/useRole";
import FpatientsTable from "../components/Frontdesk/patients/FpatientsTable";
import Dpatients from "../components/Doctor/patients/Dpatients";

const roleComponents: Record<string, JSX.Element> = {
  superadmin: <PatientsPage />,
  doctor: <Dpatients />,
  frontdesk: <FpatientsTable />,
};

const Patients = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Patients;

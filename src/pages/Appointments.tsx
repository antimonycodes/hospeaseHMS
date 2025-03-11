import { JSX } from "react";
import PatientsPage from "../components/Superadmin/patients/PatientsPage";
import { useRole } from "../hooks/useRole";
import FpatientsTable from "../components/Frontdesk/patients/FpatientsTable";
import FrontdeskAppointment from "../components/Frontdesk/appointment/FrontdeskAppointment";

const roleComponents: Record<string, JSX.Element> = {
  //   superadmin: <PatientsPage />,
  //   doctor:  ,
  frontdesk: <FrontdeskAppointment />,
};

const Appointments = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Appointments;

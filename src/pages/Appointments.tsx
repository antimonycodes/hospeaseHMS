import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import FrontdeskAppointment from "../components/Frontdesk/appointment/FrontdeskAppointment";
import DoctorsAppointment from "../components/Doctor/appointment/DoctorsAppointment";
import MedAppointment from "../components/medicaldirector/appointment/MedAppointment";

const roleComponents: Record<string, JSX.Element> = {
  //   superadmin: <PatientsPage />,
  doctor: <DoctorsAppointment />,
  "front-desk-manager": <FrontdeskAppointment />,
  "medical-director": <MedAppointment />,
};

const Appointments = () => {
  const navigate = useNavigate();
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : (navigate("/signin"), null);
};

export default Appointments;

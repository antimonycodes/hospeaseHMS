import { JSX, useEffect } from "react";
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

  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Appointments;

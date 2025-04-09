import { useNavigate } from "react-router-dom";
import SaDoctorsPage from "../components/Superadmin/doctors/SaDoctorsPage";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";
import MedDoctor from "../components/medicaldirector/doctor/MedDoctor";

const roleComponents: Record<string, JSX.Element> = {
  admin: <SaDoctorsPage />,
  "medical-director": <MedDoctor />,
};
const Doctors = () => {
  const navigate = useNavigate();

  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : (navigate("/signin"), null);
};

export default Doctors;

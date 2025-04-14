import { useNavigate } from "react-router-dom";
import SaDoctorsPage from "../components/Superadmin/doctors/SaDoctorsPage";
import { useRole } from "../hooks/useRole";
import { JSX, useEffect } from "react";
import MedDoctor from "../components/medicaldirector/doctor/MedDoctor";

const roleComponents: Record<string, JSX.Element> = {
  admin: <SaDoctorsPage />,
  "medical-director": <MedDoctor />,
};
const Doctors = () => {
  const navigate = useNavigate();

  const role = useRole();

  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Doctors;

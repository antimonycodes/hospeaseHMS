import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientsPage from "../components/Superadmin/patients/PatientsPage";
import { useRole } from "../hooks/useRole";
import FpatientsTable from "../components/Frontdesk/patients/FpatientsTable";
import Dpatients from "../components/Doctor/patients/Dpatients";
import Labpatients from "../components/Laboratory/patients/Labpatients";
import PharmPatients from "../components/Pharmacy/Patients/PharmPatients";
import NursePatients from "../components/Nurse/patients/NursePatients";
import MatronPatients from "../components/Matron/patients/MatronPatients";
import ConsultantPatients from "../components/Consultant/ConsultantPatients";
import MedicalPatient from "../components/medicaldirector/patients/MedicalPatient";

const roleComponents: Record<string, JSX.Element> = {
  admin: <PatientsPage />,
  doctor: <Dpatients />,
  "front-desk-manager": <FpatientsTable />,
  laboratory: <Labpatients />,
  pharmacist: <PharmPatients />,
  nurse: <NursePatients />,
  matron: <MatronPatients />,
  consultant: <ConsultantPatients />,
  "medical-director": <MedicalPatient />,
};

const Patients = () => {
  const navigate = useNavigate();
  const role = useRole();

  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Patients;

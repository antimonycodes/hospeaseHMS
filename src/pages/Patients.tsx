import { JSX } from "react";
import PatientsPage from "../components/Superadmin/patients/PatientsPage";
import { useRole } from "../hooks/useRole";
import FpatientsTable from "../components/Frontdesk/patients/FpatientsTable";
import Dpatients from "../components/Doctor/patients/Dpatients";
import Labpatients from "../components/Laboratory/patients/Labpatients";
import PharmPatients from "../components/Pharmacy/Patients/PharmPatients";
import NursePatients from "../components/Nurse/patients/NursePatients";
import MatronPatients from "../components/Matron/patients/MatronPatients";
import ConsultantPatients from "../components/Consultant/ConsultantPatients";

const roleComponents: Record<string, JSX.Element> = {
  admin: <PatientsPage />,
  doctor: <Dpatients />,
  frontdesk: <FpatientsTable />,
  laboratory: <Labpatients />,
  pharmacy: <PharmPatients />,
  nurses: <NursePatients />,
  matron: <MatronPatients />,
  consultant: <ConsultantPatients />,
};

const Patients = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Patients;

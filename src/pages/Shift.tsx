import DoctorOverview from "../components/Doctor/DoctorOverview";
import ShiftTable from "../components/Doctor/shift/ShiftTable";
import NurseShifts from "../components/Nurse/shifts/NurseShifts";
import { useNavigate } from "react-router-dom";
// import SuperAdminOverview from "../components/Superadmin/Overview";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";
import MatronShifts from "../components/Matron/shifts/MatronShifts";
import MedDShifts from "../components/medicaldirector/shifts/MedDShifts";

const roleComponents: Record<string, JSX.Element> = {
  //   superadmin: <SuperAdminOverview />,
  doctor: <ShiftTable />,
  nurse: <NurseShifts />,
  matron: <MatronShifts />,
  "medical-director": <MedDShifts />,

  //   frontdesk: <FrontdeskOverview />,
};

const Shift = () => {
  const navigate = useNavigate();
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : (navigate("/signin"), null);
};
export default Shift;

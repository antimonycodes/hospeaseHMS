import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import ShiftTable from "../components/Doctor/shift/ShiftTable";
import NurseShifts from "../components/Nurse/shifts/NurseShifts";
import MatronShifts from "../components/Matron/shifts/MatronShifts";
import MedDShifts from "../components/medicaldirector/shifts/MedDShifts";
import PharmShifts from "../components/Pharmacy/shifts/PharmShifts";
import SaShiftPage from "../components/Superadmin/shift/SaShiftPage";
import UserShifts from "../components/Superadmin/Staffs/UserShifts";

const roleComponents: Record<string, JSX.Element> = {
  admin: <SaShiftPage />,
  doctor: <UserShifts />,
  nurse: <UserShifts />,
  matron: <UserShifts />,
  "medical-director": <UserShifts />,
  pharmacist: <UserShifts />,
  "front-desk-manager": <UserShifts />,
  finance: <UserShifts />,
  laboratory: <UserShifts />,
  "inventory-manager": <UserShifts />,
};

const Shift = () => {
  const navigate = useNavigate();
  const role = useRole();

  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Shift;

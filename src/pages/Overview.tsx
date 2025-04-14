import { useNavigate } from "react-router-dom";
import DoctorOverview from "../components/Doctor/DoctorOverview";
import Foverview from "../components/Finance/overview/Foverview";
import FrontdeskOverview from "../components/Frontdesk/FrontdeskOverview";
import InventoryDash from "../components/Inventory/overview/InventoryDash";
import Laboverview from "../components/Laboratory/Overview/Laboverview";
import MatronDash from "../components/Matron/overview/MatronDash";
import NurseDash from "../components/Nurse/overview/NurseDash";
import PharmDash from "../components/Pharmacy/Overview/PharmDash";
import SuperAdminOverview from "../components/Superadmin/SuperAdminOverview";
// import SuperAdminOverview from "../components/Superadmin/Overview";
import { useRole } from "../hooks/useRole";
import { JSX, useEffect } from "react";
import MedicalDash from "../components/medicaldirector/overview/MedicalDash";

const roleComponents: Record<string, JSX.Element> = {
  admin: <SuperAdminOverview />,
  doctor: <DoctorOverview />,
  "front-desk-manager": <FrontdeskOverview />,
  laboratory: <Laboverview />,
  finance: <Foverview />,
  pharmacist: <PharmDash />,
  "inventory-manager": <InventoryDash />,
  nurse: <NurseDash />,
  matron: <MatronDash />,
  "medical-director": <MedicalDash />,
};

const Overview = () => {
  const navigate = useNavigate();
  const role = useRole();
  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};
export default Overview;

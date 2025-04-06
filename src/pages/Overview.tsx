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
import { JSX } from "react";

const roleComponents: Record<string, JSX.Element> = {
  admin: <SuperAdminOverview />,
  doctor: <DoctorOverview />,
  "front-desk-manager": <FrontdeskOverview />,
  laboratory: <Laboverview />,
  finance: <Foverview />,
  pharmacist: <PharmDash />,
  inventory: <InventoryDash />,
  nurse: <NurseDash />,
  matron: <MatronDash />,
};

const Overview = () => {
  const navigate = useNavigate();
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  // return role ? roleComponents[role] : <p>Unauthorized Access</p>;
  return role ? roleComponents[role] : (navigate("/signin"), null);
};
export default Overview;

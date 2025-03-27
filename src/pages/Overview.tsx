import DoctorOverview from "../components/Doctor/DoctorOverview";
import Foverview from "../components/Finance/overview/Foverview";
import FrontdeskOverview from "../components/Frontdesk/FrontdeskOverview";
import Laboverview from "../components/Laboratory/Overview/Laboverview";
import PharmDash from "../components/Pharmacy/Overview/PharmDash";
import SuperAdminOverview from "../components/Superadmin/SuperAdminOverview";
// import SuperAdminOverview from "../components/Superadmin/Overview";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";

const roleComponents: Record<string, JSX.Element> = {
  superadmin: <SuperAdminOverview />,
  doctor: <DoctorOverview />,
  frontdesk: <FrontdeskOverview />,
  laboratory: <Laboverview />,
  finance: <Foverview />,
  pharmacy: <PharmDash />,
};

const Overview = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};
export default Overview;

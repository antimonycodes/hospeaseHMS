import DoctorOverview from "../components/Doctor/DoctorOverview";
import SuperAdminOverview from "../components/Superadmin/SuperAdminOverview";
// import SuperAdminOverview from "../components/Superadmin/Overview";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";

const roleComponents: Record<string, JSX.Element> = {
  superadmin: <SuperAdminOverview />,
  doctor: <DoctorOverview />,
  //   frontdesk: <FrontDeskOverview />,
};

const Overview = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};
export default Overview;

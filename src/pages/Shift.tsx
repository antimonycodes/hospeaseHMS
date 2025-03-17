import DoctorOverview from "../components/Doctor/DoctorOverview";
import ShiftTable from "../components/Doctor/shift/ShiftTable";

// import SuperAdminOverview from "../components/Superadmin/Overview";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";

const roleComponents: Record<string, JSX.Element> = {
  //   superadmin: <SuperAdminOverview />,
  doctor: <ShiftTable />,
  //   frontdesk: <FrontdeskOverview />,
};

const Shift = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};
export default Shift;

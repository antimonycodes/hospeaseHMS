import overviewIcon from "../assets/overviewicon.svg";
import patientsIcon from "../assets/patientsicon.svg";
import doctorsIcon from "../assets/doctoricon.svg";
import consultationIcon from "../assets/consultanticon.svg";
import nursesIcon from "../assets/nursesicon.svg";
import pharmacyIcon from "../assets/pharmacyicon.svg";
import labIcon from "../assets/labicon.svg";
import financeIcon from "../assets/financeicon.svg";
import usersIcon from "../assets/usericon.svg";

export interface SidebarRoute {
  name: string;
  path: string;
  icon: string;
}

export const sidebarRoutes: Record<string, SidebarRoute[]> = {
  superadmin: [
    { name: "Overview", path: "/dashboard/overview", icon: overviewIcon },
    { name: "Patients", path: "/dashboard/patients", icon: patientsIcon },
    { name: "Doctors", path: "/dashboard/doctors", icon: doctorsIcon },
    {
      name: "Consultants",
      path: "/dashboard/consultants",
      icon: consultationIcon,
    },
    { name: "Nurses", path: "/dashboard/nurses", icon: nursesIcon },
    { name: "Pharmacy", path: "/dashboard/pharmacy", icon: pharmacyIcon },
    { name: "Laboratory", path: "/dashboard/laboratory", icon: labIcon },
    { name: "Finance", path: "/dashboard/finance", icon: financeIcon },
    { name: "Users", path: "/dashboard/users", icon: usersIcon },
  ],
  doctor: [
    { name: "Overview", path: "/dashboard/overview", icon: overviewIcon },
    {
      name: "Appointments",
      path: "/dashboard/appointments",
      icon: doctorsIcon,
    },
    { name: "Patients", path: "/dashboard/patients", icon: patientsIcon },
  ],
  frontdesk: [
    { name: "Overview", path: "/dashboard/overview", icon: overviewIcon },
    { name: "Patients", path: "/dashboard/patients", icon: patientsIcon },
  ],
};

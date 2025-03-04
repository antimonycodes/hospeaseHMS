import { Link, useLocation } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useEffect, useState } from "react";
import overviewIcon from "../../assets/overviewicon.svg";
import patientsIcon from "../../assets/patientsicon.svg";
import doctorsIcon from "../../assets/doctoricon.svg";
import consultationIcon from "../../assets/consultanticon.svg";
import nursesIcon from "../../assets/nursesicon.svg";
import pharmacyIcon from "../../assets/pharmacyicon.svg";
import labIcon from "../../assets/labicon.svg";
import financeIcon from "../../assets/financeicon.svg";
import usersIcon from "../../assets/usericon.svg";
import { sidebarRoutes } from "../../config/sidebarRoutes";

const Sidebar = () => {
  const role = useRole();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<{ name: string; path: string }[]>(
    []
  );

  useEffect(() => {
    setMenuItems(sidebarRoutes[role] || []);
  }, [role]);

  const icons: { [key: string]: string } = {
    Overview: overviewIcon,
    Patients: patientsIcon,
    Doctors: doctorsIcon,
    Consultants: consultationIcon,
    Nurses: nursesIcon,
    Pharmacy: pharmacyIcon,
    Laboratory: labIcon,
    Finance: financeIcon,
    Users: usersIcon,
  };

  return (
    <div
      className={`h-screen transition-all duration-300 ease-in-out bg-white mt-12 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <h1 className="text-primary font-medium text-2xl px-3">hospease</h1>
      <div className="flex flex-col p-2 mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-primary text-white"
                : "hover:bg-primary/25 text-[#3F3F46]"
            }`}
          >
            <img src={icons[item.name]} className={`text-lg w-[20px]`} />
            {!isCollapsed && <span className="text-sm">{item.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

import { Link, useLocation } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
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
    <div className="">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-40 md:hidden"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="p-4 flex justify-between items-center border-b">
              <h1 className="text-primary font-medium text-2xl">hospease</h1>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col p-2 mt-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-primary text-white"
                      : "hover:bg-primary/25 text-[#3F3F46]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img
                    src={icons[item.name]}
                    className="w-[20px]"
                    alt={item.name}
                  />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div
        className={`hidden md:block h-scree transition-all duration-300 ease-in-out bg-white mt-12 ${
          isCollapsed ? "w-16" : "w-60"
        }`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <h1
          className={`text-primary font-medium text-2xl px-3 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
        >
          {!isCollapsed && "hospease"}
        </h1>
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
              <img
                src={icons[item.name]}
                className="w-[20px]"
                alt={item.name}
              />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;

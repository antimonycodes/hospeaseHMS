import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronRight, LogOut, X } from "lucide-react";
import { motion } from "framer-motion";
import { sidebarRoutes, SidebarRoute } from "../../config/sidebarRoutes";
import logo from "../../assets/logo-full.png";
import logoSmall from "../../assets/logo-small.png";
import { useAuthStore } from "../../store/_auth/useAuthStore";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
  const role = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { logout } = useAuthStore();
  const [menuItems, setMenuItems] = useState<SidebarRoute[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    setMenuItems(role ? sidebarRoutes[role] : []);
  }, [role]);

  const handleMouseEnter = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }
    collapseTimeoutRef.current = setTimeout(() => {
      setIsCollapsed(false);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }
    collapseTimeoutRef.current = setTimeout(() => {
      setIsCollapsed(true);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  const toggleDropdown = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const isRouteActive = (route: SidebarRoute): boolean => {
    if (location.pathname === route.path) return true;
    if (route.children) {
      return route.children.some((child) => location.pathname === child.path);
    }
    return false;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const renderMenuItem = (item: SidebarRoute) => {
    const isActive = isRouteActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.name];

    return (
      <div key={item.path} className="w-full">
        {hasChildren ? (
          <>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-primary/25 text-[#3F3F46]"
                }
                ${isCollapsed ? "justify-center" : "justify-between"}`}
              onClick={() => !isCollapsed && toggleDropdown(item.name)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={isActive ? item.activeIcon : item.icon}
                  className="w-5 min-w-5"
                  alt={item.name}
                />
                {!isCollapsed && (
                  <span className="text-sm truncate">{item.name}</span>
                )}
              </div>
              {!isCollapsed && hasChildren && (
                <div className="text-current flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              )}
            </div>

            {!isCollapsed && isExpanded && (
              <div className="ml-6 mt-1 border-l-2 border-gray-200 pl-2">
                {item.children?.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 mt-1
                      ${
                        location.pathname === child.path
                          ? "bg-primary text-white"
                          : "hover:bg-primary/25 text-[#3F3F46]"
                      }`}
                  >
                    <img
                      src={
                        location.pathname === child.path
                          ? child.activeIcon
                          : child.icon
                      }
                      className="w-4 min-w-4"
                      alt={child.name}
                    />
                    <span className="text-sm truncate">{child.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <Link
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
              ${
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-primary/25 text-[#3F3F46]"
              }
              ${isCollapsed ? "justify-center" : ""}`}
          >
            <img
              src={isActive ? item.activeIcon : item.icon}
              className="w-5 min-w-5"
              alt={item.name}
            />
            {!isCollapsed && (
              <span className="text-sm truncate">{item.name}</span>
            )}
          </Link>
        )}
      </div>
    );
  };

  const renderMobileMenuItem = (item: SidebarRoute) => {
    const isActive = isRouteActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.name];

    return (
      <div key={item.path} className="w-full">
        {hasChildren ? (
          <>
            <div
              className={`flex items-center justify-between gap-3 p-3 rounded-lg transition-colors duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-primary/25 text-[#3F3F46]"
                }`}
              onClick={() => toggleDropdown(item.name)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={isActive ? item.activeIcon : item.icon}
                  className="w-5 min-w-5"
                  alt={item.name}
                />
                <span className="text-sm truncate">{item.name}</span>
              </div>
              {hasChildren && (
                <div className="text-current flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              )}
            </div>

            {isExpanded && (
              <div className="ml-6 mt-1 border-l-2 border-gray-200 pl-2">
                {item.children?.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 mt-1
                      ${
                        location.pathname === child.path
                          ? "bg-primary text-white"
                          : "hover:bg-primary/25 text-[#3F3F46]"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img
                      src={
                        location.pathname === child.path
                          ? child.activeIcon
                          : child.icon
                      }
                      className="w-4 min-w-4"
                      alt={child.name}
                    />
                    <span className="text-sm truncate">{child.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <Link
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
              ${
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-primary/25 text-[#3F3F46]"
              }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img
              src={isActive ? item.activeIcon : item.icon}
              className="w-5 min-w-5"
              alt={item.name}
            />
            <span className="text-sm truncate">{item.name}</span>
          </Link>
        )}
      </div>
    );
  };

  // Animation variants for the mobile menu
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  // Animation variants for the backdrop
  const backdropVariants = {
    open: { opacity: 0.5, display: "block" },
    closed: { opacity: 0, display: "none", transition: { delay: 0.2 } },
  };

  return (
    <>
      {/* Mobile menu backdrop */}
      <motion.div
        initial="closed"
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={backdropVariants}
        className="fixed inset-0 bg-black z-40 md:hidden"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile menu */}
      <motion.div
        initial="closed"
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-screen w-72 bg-white z-50 md:hidden overflow-y-auto shadow-xl rounded-r-xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto"
            onClick={() => navigate("/")}
          />
          <div className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <X
              size={20}
              className="text-gray-600"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>

        <div className="py-4 px-3 space-y-1">
          {menuItems.map(renderMobileMenuItem)}
        </div>

        <div className=" bottom-0 left-0 right-0 border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block h-screen bg-white mt-2 border-r border-gray-100 transition-all duration-300 ease-in-out overflow-x-auto ${
          isCollapsed ? "w-20" : "w-64"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-between p-6">
          <img
            src={isCollapsed ? logoSmall : logo}
            alt="Logo"
            className="w-full h-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="p-2 space-y-1">{menuItems.map(renderMenuItem)}</div>

        <div className=" bottom-0 left-0 right-0 border-t border-gray-100 p-2">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

// import { Link, useLocation } from "react-router-dom";
// import { useRole } from "../../hooks/useRole";
// import { useEffect, useState, useRef } from "react";
// import { ArrowLeftToLine, LogOut, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { sidebarRoutes } from "../../config/sidebarRoutes";
// import logo from "../../assets/logo-full.png";
// import logoSmall from "../../assets/logo-small.png";
// import { useAuthStore } from "../../store/_auth/useAuthStore";
// import signoutIcon from "../../assets/sign-out.svg";

// interface SidebarProps {
//   isMobileMenuOpen: boolean;
//   setIsMobileMenuOpen: (isOpen: boolean) => void;
// }

// interface MenuItems {
//   activeIcon: string | undefined;
//   icon: string | undefined;
//   name: string;
//   path: string;
// }

// const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
//   const role = useRole();
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const { logout } = useAuthStore();
//   const [menuItems, setMenuItems] = useState<MenuItems[]>([]);

//   useEffect(() => {
//     setMenuItems(role ? sidebarRoutes[role] : []);
//   }, [role]);

//   // Debounced collapse handlers to prevent rapid state changes
//   const handleMouseEnter = () => {
//     if (collapseTimeoutRef.current) {
//       clearTimeout(collapseTimeoutRef.current);
//     }
//     collapseTimeoutRef.current = setTimeout(() => {
//       setIsCollapsed(false);
//     }, 150);
//   };

//   const handleMouseLeave = () => {
//     if (collapseTimeoutRef.current) {
//       clearTimeout(collapseTimeoutRef.current);
//     }
//     collapseTimeoutRef.current = setTimeout(() => {
//       setIsCollapsed(true);
//     }, 300);
//   };

//   // Clean up timeout on unmount
//   useEffect(() => {
//     return () => {
//       if (collapseTimeoutRef.current) {
//         clearTimeout(collapseTimeoutRef.current);
//       }
//     };
//   }, []);

//   // const { logout } = useAuth();
//   return (
//     <div className="font-jakarta h-full overflow-y-auto overflow-x-hidden hide-scroll">
//       {/* Mobile sidebar */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             className="fixed top-0 left-0 h-screen w-64  bg-white custom-shadow z-40 md:hidden"
//             initial={{ x: -280 }}
//             animate={{ x: 0 }}
//             exit={{ x: -280 }}
//             transition={{ type: "spring", damping: 25, stiffness: 100 }}
//           >
//             <div className="p-4 flex justify-between items-center">
//               <div className="w-24">
//                 <img src={logo} alt="HospEase Logo" className="w-full" />
//               </div>
//               <button
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="p-1 rounded-full hover:bg-gray-100"
//               >
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="flex flex-col p-2 mt-4">
//               {menuItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
//                     location.pathname === item.path
//                       ? "bg-primary text-white"
//                       : "hover:bg-primary/25 text-[#3F3F46]"
//                   }`}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   <img
//                     src={
//                       location.pathname === item.path
//                         ? item.activeIcon
//                         : item.icon
//                     }
//                     className="w-[20px]"
//                     alt={item.name}
//                   />
//                   <span className="text-sm">{item.name}</span>
//                 </Link>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Desktop sidebar*/}
//       <div
//         className={` hidden md:block h-scree bg-white mt-2 border-r border-gray-100 transition-all duration-600 ease-in-out ${
//           isCollapsed ? "w-20" : "w-64"
//         }`}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         <div className="py-">
//           {isCollapsed ? (
//             <div className="flex justify-center px-2">
//               <img src={logoSmall} alt="HospEase Logo" className="w-10" />
//             </div>
//           ) : (
//             <div className="px-6 mx-auto">
//               <img
//                 src={logo}
//                 alt="HospEase Logo"
//                 className="w-full max-w-[140px]"
//               />
//             </div>
//           )}
//         </div>
//         <div className="flex flex-col p-2 mt-3 overflow-hidden">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
//                 location.pathname === item.path
//                   ? "bg-primary text-white"
//                   : "hover:bg-primary/25 text-[#3F3F46]"
//               } ${isCollapsed ? "justify-center" : ""}`}
//             >
//               <img
//                 src={
//                   location.pathname === item.path ? item.activeIcon : item.icon
//                 }
//                 className="w-[20px]"
//                 alt={item.name}
//               />
//               {!isCollapsed && (
//                 <span className="text-sm whitespace-nowrap">{item.name}</span>
//               )}
//             </Link>
//           ))}
//           <div
//             className=" clear-start flex items-center gap-2 px-4 mt-4   bottom-4 cursor-pointer"
//             onClick={logout}
//           >
//             <LogOut className=" text-[#3F3F46]" />
//             {!isCollapsed && <h1>Sign out</h1>}
//           </div>
//         </div>
//         {/*  */}
//       </div>

//       {/* Overlay for mobile menu */}
//       {isMobileMenuOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black/20 z-30 md:hidden"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Sidebar;
import { Link, useLocation } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useEffect, useState, useRef } from "react";
import {
  ArrowLeftToLine,
  ChevronDown,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Debounced collapse handlers to prevent rapid state changes
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

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  // Check if a route or any of its children is active
  const isRouteActive = (route: SidebarRoute): boolean => {
    if (location.pathname === route.path) return true;
    if (route.children) {
      return route.children.some((child) => location.pathname === child.path);
    }
    return false;
  };

  // Render menu item
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

  // Mobile menu renderer
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

  return (
    <div className="font-jakarta h-full overflow-hidden">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-0 left-0 h-screen w-64 bg-white custom-shadow z-40 md:hidden overflow-y-auto overflow-x-hidden"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 100 }}
          >
            <div className="p-4 flex justify-between items-center">
              <div className="w-24">
                <img src={logo} alt="HospEase Logo" className="w-full" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col p-2 mt-4 space-y-1">
              {menuItems.map(renderMobileMenuItem)}
              <div
                className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-primary/25 text-[#3F3F46] cursor-pointer mt-4"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
              >
                <LogOut className="w-5 min-w-5" />
                <span className="text-sm">Sign out</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div
        className={`hidden md:block h-screen bg-white mt-2 border-r border-gray-100 transition-all duration-300 ease-in-out overflow-x-hidden ${
          isCollapsed ? "w-20" : "w-64"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="py-4">
          {isCollapsed ? (
            <div className="flex justify-center px-2">
              <img src={logoSmall} alt="HospEase Logo" className="w-10" />
            </div>
          ) : (
            <div className="px-6 mx-auto">
              <img
                src={logo}
                alt="HospEase Logo"
                className="w-full max-w-[140px]"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col p-2 mt-3 space-y-1 overflow-y-auto overflow-x-hidden hide-scroll">
          {menuItems.map(renderMenuItem)}
          <div
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-primary/25 text-[#3F3F46] cursor-pointer mt-4 ${
              isCollapsed ? "justify-center" : ""
            }`}
            onClick={logout}
          >
            <LogOut className="w-5 min-w-5" />
            {!isCollapsed && <span className="text-sm">Sign out</span>}
          </div>
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

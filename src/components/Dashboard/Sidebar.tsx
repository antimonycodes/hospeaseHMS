// import { Link, useLocation } from "react-router-dom";
// import { useRole } from "../../hooks/useRole";
// import { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { sidebarRoutes } from "../../config/sidebarRoutes";
// import logo from "../../assets/logo-full.png";
// import logoSmall from "../../assets/logo-small.png";

// interface SidebarProps {
//   isMobileMenuOpen: boolean;
//   setIsMobileMenuOpen: (isOpen: boolean) => void;
// }

// const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
//   const role = useRole();
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [menuItems, setMenuItems] = useState<
//     {
//       activeIcon: string | undefined;
//       icon: string | undefined;
//       name: string;
//       path: string;
//     }[]
//   >([]);

//   useEffect(() => {
//     setMenuItems(role ? sidebarRoutes[role] : []);
//   }, [role]);

//   return (
//     <div className=" font-jakarta transition-all duration-500">
//       {/* Mobile sidebar */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             className="fixed top-0 left-0 h-screen w-64 overflow-y-auto bg-white custom-shadow z-40 md:hidden"
//             initial={{ x: -280 }}
//             animate={{ x: 0 }}
//             exit={{ x: -280 }}
//             transition={{ type: "spring", damping: 25 }}
//           >
//             <div className="p-4 flex justify-between items-center ">
//               {/* <h1 className="text-primary font-medium text-2xl">hospease</h1> */}
//               <div className=" w-24">
//                 <img src={logo} alt="" />
//               </div>
//               <button onClick={() => setIsMobileMenuOpen(false)}>
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="flex flex-col p-2 mt-4">
//               {menuItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
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

//       {/* Desktop sidebar */}
//       <div
//         className={`hidden md:block transition-all duration-1000 bg-white mt-6 ${
//           isCollapsed ? "w-16" : "w-60"
//         }`}
//         onMouseEnter={() => setIsCollapsed(false)}
//         onMouseLeave={() => setIsCollapsed(true)}
//       >
//         <div>
//           {/* {!isCollapsed && "hospease"} */}
//           {/* <div className=" w-[80%]">
//             <img src={logo} alt="" />
//           </div> */}
//           {isCollapsed ? (
//             <>
//               <div className=" ]">
//                 <img src={logoSmall} alt="" />
//               </div>
//             </>
//           ) : (
//             <>
//               <div className=" px-6 w-[80%]">
//                 <img src={logo} alt="" />
//               </div>
//             </>
//           )}
//         </div>
//         <div className="flex flex-col p-2 mt-3">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
//                 location.pathname === item.path
//                   ? "bg-primary text-white"
//                   : "hover:bg-primary/25 text-[#3F3F46]"
//               }`}
//             >
//               <img
//                 src={
//                   location.pathname === item.path ? item.activeIcon : item.icon
//                 }
//                 className="w-[20px]"
//                 alt={item.name}
//               />
//               {!isCollapsed && (
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-sm"
//                 >
//                   {item.name}
//                 </motion.span>
//               )}
//             </Link>
//           ))}
//         </div>
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
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sidebarRoutes } from "../../config/sidebarRoutes";
import logo from "../../assets/logo-full.png";
import logoSmall from "../../assets/logo-small.png";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

interface MenuItems {
  activeIcon: string | undefined;
  icon: string | undefined;
  name: string;
  path: string;
}

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
  const role = useRole();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);

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

  return (
    <div className="font-jakarta h-full">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-0 left-0 h-screen w-64 overflow-y-auto bg-white custom-shadow z-40 md:hidden"
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
            <div className="flex flex-col p-2 mt-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "bg-primary text-white"
                      : "hover:bg-primary/25 text-[#3F3F46]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img
                    src={
                      location.pathname === item.path
                        ? item.activeIcon
                        : item.icon
                    }
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

      {/* Desktop sidebar*/}
      <div
        className={`hidden md:block h-scree bg-white mt-6 border-r border-gray-100 transition-all duration-600 ease-in-out ${
          isCollapsed ? "w-16" : "w-60"
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
        <div className="flex flex-col p-2 mt-3 overflow-hidden">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "hover:bg-primary/25 text-[#3F3F46]"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <img
                src={
                  location.pathname === item.path ? item.activeIcon : item.icon
                }
                className="w-[20px]"
                alt={item.name}
              />
              {!isCollapsed && (
                <span className="text-sm whitespace-nowrap">{item.name}</span>
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

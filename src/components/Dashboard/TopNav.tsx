// import { Bell, Menu, X, User, LogOut, Settings } from "lucide-react";
// import hospitalLogo from "../../assets/ribiero.png";
// import { useAuthStore } from "../../store/_auth/useAuthStore";
// import { useProfileStore } from "../../store/super-admin/useProfileStore";
// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { useGlobalStore } from "../../store/super-admin/useGlobal";

// // Import notification sound
// import notificationSound from "../../assets/bell-notification-337658.mp3";

// interface TopNavProps {
//   setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const TopNav: React.FC<TopNavProps> = ({ setIsMobileMenuOpen }) => {
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const notificationRef = useRef<HTMLDivElement>(null);
//   const profileRef = useRef<HTMLDivElement>(null);
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const [prevUnreadCount, setPrevUnreadCount] = useState(0);
//   const [prevNotifications, setPrevNotifications] = useState<any[]>([]);

//   const { getAllNotifications, notifications, unreadCount } = useGlobalStore();

//   const { logout } = useAuthStore();

//   // Request notification permission on component mount
//   useEffect(() => {
//     if ("Notification" in window && Notification.permission === "default") {
//       Notification.requestPermission();
//     }
//   }, []);

//   useEffect(() => {
//     getAllNotifications();
//   }, []);

//   // Show browser notification for new notifications
//   useEffect(() => {
//     if (
//       notifications &&
//       notifications.length > 0 &&
//       prevNotifications.length > 0
//     ) {
//       // Find new notifications by comparing with previous state
//       const newNotifications = notifications.filter(
//         (notification: any) =>
//           !prevNotifications.some(
//             (prevNotification: any) =>
//               prevNotification.data.id === notification.data.id
//           )
//       );

//       // Show browser notification for each new notification
//       newNotifications.forEach((notification: any) => {
//         showBrowserNotification(
//           notification.data.attributes.title,
//           notification.data.attributes.message
//         );
//       });
//     }
//     setPrevNotifications(notifications || []);
//   }, [notifications]);

//   // Play sound when new notifications arrive
//   useEffect(() => {
//     if (unreadCount > prevUnreadCount && prevUnreadCount !== 0) {
//       if (audioRef.current) {
//         audioRef.current.play().catch((error) => {
//           console.error("Failed to play notification sound:", error);
//         });
//       }
//     }
//     setPrevUnreadCount(unreadCount);
//   }, [unreadCount, prevUnreadCount]);

//   const showBrowserNotification = (title: string, message: string) => {
//     // Check if browser supports notifications and permission is granted
//     if ("Notification" in window && Notification.permission === "granted") {
//       const notification = new Notification(title, {
//         body: message,
//         icon: "/favicon.ico", // You can use your hospital logo here
//         badge: "/favicon.ico",
//         tag: "hospital-notification", // Prevents duplicate notifications
//         requireInteraction: true, // Auto-close after a few seconds
//         silent: false, // Allow sound (your audio will still play)
//       });

//       // Optional: Handle notification click
//       notification.onclick = function () {
//         window.focus(); // Focus the browser window
//         notification.close();
//         // You can add more actions here, like navigating to notifications page
//       };

//       // Auto-close after 5 seconds
//       // setTimeout(() => {
//       //   notification.close();
//       // }, 500000);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         notificationRef.current &&
//         !notificationRef.current.contains(event.target as Node)
//       ) {
//         setIsNotificationOpen(false);
//       }
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(event.target as Node)
//       ) {
//         setIsProfileModalOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleNotificationClick = () => {
//     setIsNotificationOpen((prev) => !prev);
//   };

//   const handleProfileClick = () => {
//     setIsProfileModalOpen((prev) => !prev);
//   };

//   const handleLogout = () => {
//     logout();
//     setIsProfileModalOpen(false);
//   };

//   return (
//     <div className="w-full">
//       {/* Audio element for notification sound */}
//       <audio ref={audioRef} src={notificationSound} />

//       <div className="w-full py-2 px-2 sm:px-4 flex justify-between items-center border-0 border-[#009952] bg-white h-[61px] custom-shadow">
//         {/* Mobile menu button */}
//         <button
//           className="md:hidden flex-shrink-0 mr-2 p-1"
//           onClick={() => setIsMobileMenuOpen((prev) => !prev)}
//         >
//           <Menu size={20} />
//         </button>

//         {/* Search input - responsive width */}
//         <div className="flex-1 max-w-md mr-2">
//           <input
//             type="search"
//             placeholder="Type to search"
//             className="border border-gray-200 py-2 px-3 rounded-[10px] w-full text-sm focus:outline-none focus:ring-1 focus:ring-[#009952]"
//           />
//         </div>

//         {/* Right side items */}
//         <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
//           {/* Notification dropdown */}
//           <div className="relative" ref={notificationRef}>
//             <button
//               onClick={handleNotificationClick}
//               className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <Bell className="text-gray-700 w-5 h-5" />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
//                   {unreadCount > 9 ? "9+" : unreadCount}
//                 </span>
//               )}
//             </button>

//             {/* Notification dropdown - responsive positioning */}
//             {isNotificationOpen && (
//               <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-w-[calc(100vw-1rem)]">
//                 <div className="p-3 border-b border-gray-100 flex justify-between items-center">
//                   <h3 className="font-semibold text-sm sm:text-base">
//                     Notifications
//                   </h3>
//                   <button
//                     onClick={() => setIsNotificationOpen(false)}
//                     className="text-gray-500 hover:text-gray-700 p-1"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>

//                 <div className="max-h-80 sm:max-h-96 overflow-y-auto">
//                   {notifications?.length === 0 ? (
//                     <div className="text-center py-6 text-gray-500">
//                       <p className="text-sm">No new notifications</p>
//                     </div>
//                   ) : (
//                     notifications
//                       .slice(0, unreadCount > 0 ? unreadCount : 0)
//                       .map((n: any) => (
//                         <div
//                           key={n.data.id}
//                           className="p-3 border-b border-gray-100 hover:bg-gray-50 bg-blue-50 transition-colors"
//                         >
//                           <div className="flex justify-between items-start mb-1 gap-2">
//                             <h4 className="text-sm font-medium truncate flex-1">
//                               {n.data.attributes.title.slice(0, 24)}
//                               {n.data.attributes.title.length > 24 && "..."}
//                             </h4>
//                             <span className="text-xs text-gray-500 flex-shrink-0">
//                               {n.data.attributes.created_at}
//                             </span>
//                           </div>
//                           <p className="text-xs text-gray-600 line-clamp-2">
//                             {n.data.attributes.message}
//                           </p>
//                         </div>
//                       ))
//                   )}
//                 </div>

//                 <div className="p-3 border-t border-gray-100 text-center">
//                   <Link
//                     to="/dashboard/notifications"
//                     className="text-sm text-[#009952] hover:text-[#007a42] font-medium transition-colors"
//                     onClick={() => setIsNotificationOpen(false)}
//                   >
//                     View all notifications
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Profile dropdown */}
//           <div className="relative" ref={profileRef}>
//             <button
//               onClick={handleProfileClick}
//               className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 hover:bg-gray-300 transition-colors flex items-center justify-center"
//             >
//               <User className="w-4 h-4 text-gray-600" />
//             </button>

//             {/* Profile Modal */}
//             {isProfileModalOpen && (
//               <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
//                 <div className="p-4 border-b border-gray-100">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                       <User className="w-5 h-5 text-gray-600" />
//                     </div>
//                     <div>
//                       {/* <h3 className="font-semibold text-sm text-gray-800">
//                         User Name
//                       </h3>
//                       <p className="text-xs text-gray-500">user@example.com</p> */}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="py-2">
//                   <Link
//                     to="/dashboard/profile"
//                     className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                     onClick={() => setIsProfileModalOpen(false)}
//                   >
//                     <User className="w-4 h-4" />
//                     Profile
//                   </Link>

//                   {/* <Link
//                     to="/dashboard/settings"
//                     className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                     onClick={() => setIsProfileModalOpen(false)}
//                   >
//                     <Settings className="w-4 h-4" />
//                     Settings
//                   </Link> */}
//                 </div>

//                 <div className="border-t border-gray-100 py-2">
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopNav;
import { Bell, Menu, X, User, LogOut, Settings } from "lucide-react";
import hospitalLogo from "../../assets/logo-small.png";
import { useAuthStore } from "../../store/_auth/useAuthStore";
import { useProfileStore } from "../../store/super-admin/useProfileStore";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useGlobalStore } from "../../store/super-admin/useGlobal";

// Import notification sound
import notificationSound from "../../assets/bell-notification-337658.mp3";

interface TopNavProps {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopNav: React.FC<TopNavProps> = ({ setIsMobileMenuOpen }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);
  const [prevNotifications, setPrevNotifications] = useState<any[]>([]);
  const [notificationPermission, setNotificationPermission] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );

  const [notificationSettings, setNotificationSettings] = useState({
    browserNotifications: true,
    sound: true,
    priority: "all", // 'all', 'high', 'urgent'
  });

  const { getAllNotifications, notifications, unreadCount } = useGlobalStore();

  const { logout } = useAuthStore();

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  useEffect(() => {
    getAllNotifications();
  }, []);

  // Show browser notification for new notifications
  useEffect(() => {
    if (
      notifications &&
      notifications.length > 0 &&
      prevNotifications.length > 0
    ) {
      // Find new notifications by comparing with previous state
      const newNotifications = notifications.filter(
        (notification: any) =>
          !prevNotifications.some(
            (prevNotification: any) =>
              prevNotification.data.id === notification.data.id
          )
      );

      // Show browser notification for each new notification (if enabled)
      if (notificationSettings.browserNotifications) {
        newNotifications.forEach((notification: any) => {
          // Check priority filter
          const priority = notification.data.attributes.priority || "normal";
          const shouldShow =
            notificationSettings.priority === "all" ||
            (notificationSettings.priority === "high" &&
              ["high", "urgent"].includes(priority)) ||
            (notificationSettings.priority === "urgent" &&
              priority === "urgent");

          if (shouldShow) {
            showBrowserNotification(
              notification.data.attributes.title,
              notification.data.attributes.message,
              notification.data.id
            );
          }
        });
      }
    }
    setPrevNotifications(notifications || []);
  }, [notifications, notificationSettings]);

  // Play sound when new notifications arrive
  useEffect(() => {
    if (unreadCount > prevUnreadCount && prevUnreadCount !== 0) {
      if (notificationSettings.sound && audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Failed to play notification sound:", error);
        });
      }
    }
    setPrevUnreadCount(unreadCount);
  }, [unreadCount, prevUnreadCount, notificationSettings.sound]);

  const showBrowserNotification = (
    title: string,
    message: string,
    notificationId?: string
  ) => {
    // Check if browser supports notifications and permission is granted
    if ("Notification" in window && Notification.permission === "granted") {
      // Truncate long messages for better display
      const truncatedMessage =
        message.length > 100 ? message.substring(0, 100) + "..." : message;

      const notification = new Notification(title, {
        body: truncatedMessage,
        icon: hospitalLogo, // Use your hospital logo
        badge: hospitalLogo,
        tag: notificationId || `hospital-notification-${Date.now()}`, // Unique tag per notification
        requireInteraction: false,
        silent: false, // Let your audio handle the sound
        // actions: [], // You can add action buttons here if needed
        data: { notificationId }, // Store additional data
      });

      // Handle notification click
      notification.onclick = function (event) {
        event.preventDefault();
        window.focus(); // Focus the browser window

        // Navigate to notifications page
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }

        notification.close();
      };

      // Handle notification close
      notification.onclose = function () {
        console.log("Notification closed");
      };

      // Handle notification error
      notification.onerror = function (error) {
        console.error("Notification error:", error);
      };

      // Auto-close after 8 seconds (longer for better readability)
      // setTimeout(() => {
      //   notification.close();
      // }, 8000);
    }
  };

  // Request notification permission manually
  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        // Show a test notification
        showBrowserNotification(
          "Notifications Enabled!",
          "You will now receive hospital notifications",
          "welcome-notification"
        );
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsProfileModalOpen(false);
  };

  return (
    <div className="w-full">
      {/* Audio element for notification sound */}
      <audio ref={audioRef} src={notificationSound} />

      <div className="w-full py-2 px-2 sm:px-4 flex justify-between items-center border-0 border-[#009952] bg-white h-[61px] custom-shadow">
        {/* Mobile menu button */}
        <button
          className="md:hidden flex-shrink-0 mr-2 p-1"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <Menu size={20} />
        </button>

        {/* Search input - responsive width */}
        <div className="flex-1 max-w-md mr-2">
          <input
            type="search"
            placeholder="Type to search"
            className="border border-gray-200 py-2 px-3 rounded-[10px] w-full text-sm focus:outline-none focus:ring-1 focus:ring-[#009952]"
          />
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Notification dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="text-gray-700 w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown - responsive positioning */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-w-[calc(100vw-1rem)]">
                <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-sm sm:text-base">
                    Notifications
                  </h3>
                  <div className="flex items-center gap-2">
                    {/* Notification permission indicator */}
                    {notificationPermission === "denied" && (
                      <button
                        onClick={requestNotificationPermission}
                        className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
                        title="Click to enable browser notifications"
                      >
                        Enable Notifications
                      </button>
                    )}
                    {notificationPermission === "default" && (
                      <button
                        onClick={requestNotificationPermission}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                        title="Click to enable browser notifications"
                      >
                        Allow Notifications
                      </button>
                    )}
                    {notificationPermission === "granted" && (
                      <span
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                        title="Browser notifications enabled"
                      >
                        ✓ Enabled
                      </span>
                    )}
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                  {/* Notification Settings */}
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">
                        Settings
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Browser Notifications
                        </span>
                        <button
                          onClick={() =>
                            setNotificationSettings((prev) => ({
                              ...prev,
                              browserNotifications: !prev.browserNotifications,
                            }))
                          }
                          className={`w-8 h-4 rounded-full transition-colors ${
                            notificationSettings.browserNotifications
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${
                              notificationSettings.browserNotifications
                                ? "translate-x-4"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Sound</span>
                        <button
                          onClick={() =>
                            setNotificationSettings((prev) => ({
                              ...prev,
                              sound: !prev.sound,
                            }))
                          }
                          className={`w-8 h-4 rounded-full transition-colors ${
                            notificationSettings.sound
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${
                              notificationSettings.sound
                                ? "translate-x-4"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Priority</span>
                        <select
                          value={notificationSettings.priority}
                          onChange={(e) =>
                            setNotificationSettings((prev) => ({
                              ...prev,
                              priority: e.target.value as
                                | "all"
                                | "high"
                                | "urgent",
                            }))
                          }
                          className="text-xs border border-gray-200 rounded px-2 py-1"
                        >
                          <option value="all">All</option>
                          <option value="high">High+</option>
                          <option value="urgent">Urgent Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {notifications?.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">No new notifications</p>
                    </div>
                  ) : (
                    notifications
                      .slice(0, unreadCount > 0 ? unreadCount : 0)
                      .map((n: any) => (
                        <div
                          key={n.data.id}
                          className="p-3 border-b border-gray-100 hover:bg-gray-50 bg-blue-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h4 className="text-sm font-medium truncate flex-1">
                              {n.data.attributes.title.slice(0, 24)}
                              {n.data.attributes.title.length > 24 && "..."}
                            </h4>
                            <div className="flex items-center gap-1">
                              {/* Priority indicator */}
                              {n.data.attributes.priority === "urgent" && (
                                <span
                                  className="w-2 h-2 bg-red-500 rounded-full"
                                  title="Urgent"
                                />
                              )}
                              {n.data.attributes.priority === "high" && (
                                <span
                                  className="w-2 h-2 bg-orange-500 rounded-full"
                                  title="High Priority"
                                />
                              )}
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {n.data.attributes.created_at}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {n.data.attributes.message}
                          </p>
                        </div>
                      ))
                  )}
                </div>

                <div className="p-3 border-t border-gray-100 text-center">
                  <Link
                    to="/dashboard/notifications"
                    className="text-sm text-[#009952] hover:text-[#007a42] font-medium transition-colors"
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <User className="w-4 h-4 text-gray-600" />
            </button>

            {/* Profile Modal */}
            {isProfileModalOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      {/* <h3 className="font-semibold text-sm text-gray-800">
                        User Name
                      </h3>
                      <p className="text-xs text-gray-500">user@example.com</p> */}
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileModalOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>

                  {/* <Link
                    to="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileModalOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link> */}
                </div>

                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;

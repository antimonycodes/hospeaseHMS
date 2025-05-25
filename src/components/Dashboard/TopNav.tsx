import { Bell, Menu, X, User, LogOut, Settings } from "lucide-react";
import hospitalLogo from "../../assets/ribiero.png";
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

  const { getAllNotifications, notifications, unreadCount } = useGlobalStore();

  const { logout } = useAuthStore();

  useEffect(() => {
    getAllNotifications();
  }, []);

  // Play sound when new notifications arrive
  useEffect(() => {
    if (unreadCount > prevUnreadCount && prevUnreadCount !== 0) {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Failed to play notification sound:", error);
        });
      }
    }
    setPrevUnreadCount(unreadCount);
  }, [unreadCount, prevUnreadCount]);

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
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="max-h-80 sm:max-h-96 overflow-y-auto">
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
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {n.data.attributes.created_at}
                            </span>
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

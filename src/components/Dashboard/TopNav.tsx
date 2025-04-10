import { Bell, Menu, X } from "lucide-react";
import hospitalLogo from "../../assets/ribiero.png";
import { useAuthStore } from "../../store/_auth/useAuthStore";
import { useProfileStore } from "../../store/super-admin/useProfileStore";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useGlobalStore } from "../../store/super-admin/useGlobal";

interface TopNavProps {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopNav: React.FC<TopNavProps> = ({ setIsMobileMenuOpen }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const {
    getAllNotifications,
    getUnreadNotificationCount,
    notifications,
    unreadCount,
  } = useGlobalStore();

  useEffect(() => {
    getAllNotifications();
    getUnreadNotificationCount();
  }, [getAllNotifications, getUnreadNotificationCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <div className="w-full z-10">
      <div className="w-full py-2 px-4 flex justify-between items-center border-0 border-[#009952] bg-white z-20 h-[61px] custom-shadow">
        <button
          className="md:hidden mr-2"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <Menu size={24} />
        </button>
        <input
          type="search"
          placeholder="Type to search"
          className="border border-gray-200 py-2 px-4 rounded-[10px] w-[70%] shrink-0 mr-2"
        />
        <div className="flex items-center gap-6">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <Bell className="text-gray-700 w-5" />
              {unreadCount?.all_count > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount.all_count > 9 ? "9+" : unreadCount.all_count}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-30">
                <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications?.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <p>No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((n: any) => (
                      <div
                        key={n.data.id}
                        className="p-3 border-b border-gray-100 hover:bg-gray-50 bg-blue-50"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-medium">
                            {n.data.attributes.title.slice(0, 24)}.
                          </h4>
                          <span className="text-xs text-gray-500">
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
                    className="text-sm text-primary hover:text-0 font-medium"
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="size-8">{/* Profile image placeholder */}</div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;

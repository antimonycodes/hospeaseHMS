import { Bell, ChevronLeft, Check, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../store/super-admin/useGlobal";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: "alert" | "info" | "success" | "warning";
}

const NotificationPage = () => {
  const navigate = useNavigate();
  const { notifications } = useGlobalStore();
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(
    []
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (notifications.length) {
      const mapped = notifications.map((item: any) => ({
        id: item.data.id,
        title: item.data.attributes.title,
        message: item.data.attributes.message,
        createdAt: item.data.attributes.created_at,
        isRead: false,
        type: "info" as "alert" | "info" | "success" | "warning",
      }));
      setLocalNotifications(mapped);
    }
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setLocalNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const handleDelete = (id: string) => {
    setLocalNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications =
    filter === "all"
      ? localNotifications
      : localNotifications.filter((n) => !n.isRead);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return diffInHours === 0
        ? "Just now"
        : `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    const base = "p-2 rounded-full";
    const styles: Record<string, string> = {
      alert: "bg-red-100 text-red-500",
      warning: "bg-yellow-100 text-yellow-500",
      success: "bg-green-100 text-green-500",
      info: "bg-blue-100 text-blue-500",
    };
    return (
      <div className={`${base} ${styles[type] || styles.info}`}>
        <Bell className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Notifications</h1>
          <div className="ml-auto flex items-center gap-2">
            {/* <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
            >
              Mark all as read
            </button> */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "unread")}
              className="bg-gray-100 border-0 text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="divide-y divide-gray-100">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="mx-auto mb-4 text-gray-400 w-12 h-12" />
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 flex items-start gap-3 hover:bg-gray-50 ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
            >
              {getNotificationIcon(notification.type)}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3
                    className={`text-sm ${
                      !notification.isRead ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {notification.message}
                </p>

                <div className="flex gap-2 mt-1">
                  {/* {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                    >
                      <Check size={14} className="mr-1" />
                      Mark as read
                    </button>
                  )} */}
                  {/* <button
                    onClick={() => handleDelete(notification.id)}
                    className="flex items-center text-xs text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </button> */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

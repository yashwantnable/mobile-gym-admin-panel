import React, { useEffect, useMemo } from "react";
import { GoBell } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import moment from "moment";
import { useNotification } from "../contexts/NotificationContext";
import { serverUrl } from "../../config";
          
const NotificationProvider = ({ userId }) => {
  const navigate = useNavigate();
  const {
    notificationData,
    handleMarkAllAsRead,
    updateNotification,
    setNotificationData,
  } = useNotification();
console.log("notificationData:",notificationData)
  useEffect(() => {
    const socket = io(serverUrl, { transports: ["websocket"] });

    if (userId) {
      socket.emit("join", userId);
    }

    const handleNotification = (newNotification) => {
      setNotificationData((prev = []) => [newNotification, ...prev]);

      if (Notification.permission === "granted") {
        new Notification(newNotification.title, {
          body: newNotification.message,
        });
      }
    };

    socket.on("notification", handleNotification);
    socket.on("joined", (data) => console.log("Joined:", data));
    socket.on("connect_error", (error) =>
      console.error("Socket connection error:", error)
    );
    socket.on("error", (error) => console.error("Socket error:", error));

    // Request permission if not granted yet
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => {
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, [userId, setNotificationData]);

  const unreadCount = useMemo(
    () => notificationData?.filter((n) => !n.isRead).length || 0,
    [notificationData]
  );

  const groupedNotifications = useMemo(() => {
    const groups = {};
    (notificationData || [])
      .filter((n) => !n.isRead)
      .forEach((n) => {
        const date = moment(n.createdAt).format("YYYY-MM-DD");
        if (!groups[date]) groups[date] = [];
        groups[date].push(n);
      });

    return Object.entries(groups).map(([date, notifs]) => ({
      dateLabel: moment(date).calendar(null, {
        sameDay: "[Today]",
        lastDay: "[Yesterday]",
        lastWeek: "dddd",
        sameElse: "DD MMM YYYY",
      }),
      notifications: notifs,
    }));
  }, [notificationData]);

  return (
    <div className="relative group">
      {/* Bell Icon */}
      <div className="text-2xl text-white cursor-pointer hover:text-yellow-400 transition-all relative">
        <GoBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown */}
      <div
        className={`
          absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 border 
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-1
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-300 text-sm font-semibold text-primary">
          <span>Notifications</span>
          <div className="space-x-2 text-xs text-blue-400">
            <button
              onClick={handleMarkAllAsRead}
              className="hover:underline cursor-pointer"
              disabled={notificationData?.length === 0}
            >
              Mark all as read
            </button>
            <button
              onClick={() => navigate("notifications")}
              className="hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto text-sm text-black">
          {unreadCount > 0 ? (
            groupedNotifications.map((group, i) => (
              <div key={i}>
                <div className="sticky top-0 px-4 py-1 bg-gray-100 text-xs font-medium text-gray-500 z-10">
                  {group.dateLabel}
                </div>
                {group.notifications.map((n) => (
                  <div
                    key={n._id}
                    className="p-3 border-b border-gray-200 bg-blue-50 cursor-pointer"
                    onClick={() => updateNotification(n._id)}
                  >
                    <div className="flex space-x-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                          </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {n.senderId?.firstName} {n.senderId?.lastName}
                          </p>
                          <span className="text-xs text-gray-500">
                            {moment(n.createdAt).format("h:mm A")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {n.title}
                          {n.projectId?.name && (
                            <span className="font-semibold text-blue-600">
                              {" "}
                              @ {n.projectId.name}
                            </span>
                          )}
                        </p>
                        {n.message && (
                          <div className="mt-2 p-2 bg-white/50 rounded border border-gray-200 text-sm">
                            {n.message}
                          </div>
                        )}
                        <div className="mt-2 flex justify-between">
                          <span className="text-xs text-gray-500">
                            {moment(n.createdAt).fromNow()}
                          </span>
                          {n.projectId?.priority && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                {
                                  high: "bg-red-100 text-red-800",
                                  medium: "bg-yellow-100 text-yellow-800",
                                  low: "bg-green-100 text-green-800",
                                }[n.projectId.priority] || ""
                              }`}
                            >
                              {n.projectId.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 mb-3 text-gray-300">
                <GoBell size={64} />
              </div>
              <h3 className="text-base font-medium text-gray-700">
                No unread notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationProvider;

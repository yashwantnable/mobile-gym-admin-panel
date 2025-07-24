"use client";
import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { NotificationApi } from "../../Api/Notificatiom.Api";
import { useLoading } from "../../Components/loader/LoaderContext";

const Notification = () => {
  const [activeTab, setActiveTab] = useState("unread");
  const [notificationData, setNotificationData] = useState([]);
  const { handleLoading } = useLoading();

  

  const handleAllRead =async () => {
      try {
        handleLoading(true);
        const res = await NotificationApi.updateAllNotification();
        // setNotificationData(res?.data?.data || []);
        console.log("updateAllNotification:",res?.data?.data)
      } catch (error) {
        toast.error("Error fetching notifications");
      } finally {
        handleLoading(false);
        allNotification();
      }
    };

  const allNotification =async () => {
      try {
        handleLoading(true);
        const res = await NotificationApi.getAllNotification();
        setNotificationData(res?.data?.data || []);
        console.log("res?.data?.data noti:",res?.data?.data)
      } catch (error) {
        toast.error("Error fetching notifications");
      } finally {
        handleLoading(false);
      }
    };


  const unreadNotifications = notificationData.filter(
    (notification) => !notification.isRead
  );

  const readNotifications = notificationData.filter(
    (notification) => notification.isRead
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const NotificationItem = ({ notification, isUnread }) => {
    const formattedDate = moment(notification.createdAt).format(
      "MMM D, h:mm A"
    );
    const timeAgo = moment(notification.createdAt).fromNow();

  
    return (
      <div
        className={`flex items-start p-4 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
          isUnread
            ? "bg-blue-50 border-l-4 border-primary cursor-pointer"
            : "bg-white"
        }`}
      >
        <div className="relative flex-shrink-0 mr-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isUnread
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
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
          {isUnread && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <p
                className={`text-sm font-medium ${
                  isUnread ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {notification.title}
              </p>
            </div>
            <div className="text-xs text-gray-500">{timeAgo}</div>
          </div>

          <div
            className={`mt-2 p-3 rounded-lg text-sm ${
              isUnread
                ? "bg-white border border-gray-200 text-gray-700"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            {notification.message}
          </div>

          <div className="mt-2 text-xs text-gray-400">{formattedDate}</div>
        </div>
      </div>
    );
  };

  const EmptyState = ({ iconPath, title, description }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-24 h-24 mb-4 text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-full h-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d={iconPath}
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md">{description}</p>
    </div>
  );

    useEffect(()=>{
      allNotification();
    },[])

  return (
    <div className="w-full mx-auto max-w-4xl p-4 md:p-6 h-[calc(100vh-80px)] overflow-hidden flex flex-col bg-white rounded-lg shadow-sm">
      {/* Notification Header */}
      <div className="mb-6 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
            {unreadNotifications.length > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadNotifications.length} new
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {unreadNotifications.length > 0 && (
              <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              onClick={handleAllRead}>
                Mark all as read
              </button>
            )}
            <button className="text-sm cursor-pointer hover:underline text-gray-600 hover:text-gray-800 flex items-center">
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </>
            </button>
          </div>
        </div>

        <div className="mt-6 border-b border-gray-200">
          <nav className="flex space-x-4">
            <button
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors duration-200 cursor-pointer ${
                activeTab === "unread"
                  ? "border-third text-third"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("unread")}
            >
              Unread
              {unreadNotifications.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
            <button
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors duration-200 cursor-pointer ${
                activeTab === "read"
                  ? "border-third text-third"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("read")}
            >
              Read
              {readNotifications.length > 0 && (
                <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {readNotifications.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Notifications Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {activeTab === "unread" ? (
            unreadNotifications.length > 0 ? (
              <>
                <div className="text-xs text-gray-500 mb-2 px-2">
                  {unreadNotifications.length} unread notification
                  {unreadNotifications.length !== 1 ? "s" : ""}
                </div>
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    isUnread={true}
                  />
                ))}
              </>
            ) : (
              <EmptyState
                iconPath="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                title="All caught up!"
                description="You don't have any unread notifications right now."
              />
            )
          ) : readNotifications.length > 0 ? (
            <>
              <div className="text-xs text-gray-500 mb-2 px-2">
                {readNotifications.length} read notification
                {readNotifications.length !== 1 ? "s" : ""}
              </div>
              {readNotifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  isUnread={false}
                />
              ))}
            </>
          ) : (
            <EmptyState
              iconPath="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              title="No read notifications"
              description="Your read notifications will appear here."
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default Notification;

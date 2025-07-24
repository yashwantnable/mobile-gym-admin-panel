import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useLoading } from "../../Components/loader/LoaderContext";
import { NotificationApi } from "../../Api/Notificatiom.Api";
import { toast } from "react-toastify";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notificationData, setNotificationData] = useState([]);
 const { handleLoading } = useLoading();

  const getAllNotification = useCallback(async () => {
    try {
      handleLoading(true);
      const res = await NotificationApi.getAllNotification();
      setNotificationData(res?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching notifications");
    } finally {
      handleLoading(false);
    }
  }, [handleLoading]);
const updateNotification = useCallback(
  async (id) => {
    try {
      handleLoading(true); // was showLoading()
      await NotificationApi.updateNotification(id, { isRead: true });
      setNotificationData((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      toast.error("Failed to mark notification as read.");
    } finally {
      handleLoading(false); // was hideLoading()
    }
  },
  [handleLoading]
);

const handleMarkAllAsRead = useCallback(async () => {
  try {
    handleLoading(true); // was showLoading()
    await NotificationApi.updateAllNotification();
    setNotificationData((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  } catch (error) {
    toast.error("Failed to mark all as read.");
  } finally {
    handleLoading(false); // was hideLoading()
  }
}, [handleLoading]);

  const value = useMemo(
    () => ({
      notificationData,
      setNotificationData,
      getAllNotification,
      updateNotification,
      handleMarkAllAsRead,
    }),
    [
      notificationData,
      getAllNotification,
      updateNotification,
      handleMarkAllAsRead,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === null) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

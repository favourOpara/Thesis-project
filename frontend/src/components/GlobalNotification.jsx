import React, { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import "./GlobalNotification.css";

const GlobalNotification = () => {
  const { notification } = useContext(NotificationContext);

  return (
    <>
      {notification.message && (
        <div key={notification.id} className="notification-container">
          {notification.message}
        </div>
      )}
    </>
  );
};

export default GlobalNotification;

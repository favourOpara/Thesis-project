import React, { createContext, useState, useRef } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Store notification as an object with a message and unique id
  const [notification, setNotification] = useState({ message: "", id: 0 });
  const timeoutRef = useRef(null);

  const showNotification = (msg, duration = 6000) => {
    // Clear any existing timeout so that the timer resets
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Use a unique id (timestamp works) to force a state update
    setNotification({ message: msg, id: Date.now() });
    timeoutRef.current = setTimeout(() => {
      setNotification({ message: "", id: 0 });
      timeoutRef.current = null;
    }, duration);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

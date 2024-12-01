import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToNotifications } from '../firebase/firebase';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications(setNotifications);
    return () => unsubscribe();
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);

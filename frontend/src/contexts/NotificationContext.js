import React, { createContext, useContext } from 'react';
import { useNotifications } from '@/hooks/useNotifications.js';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const notifications = useNotifications();
  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);

export default NotificationContext;

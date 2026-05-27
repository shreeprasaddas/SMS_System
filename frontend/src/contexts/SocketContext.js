import React, { createContext, useContext } from 'react';
import socketService from '@/services/socket.service.js';

const SocketContext = createContext(socketService);

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socketService}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);

export default SocketContext;

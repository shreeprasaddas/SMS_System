import { useEffect } from 'react';
import socketService from '@/services/socket.service.js';
import { useSelector } from 'react-redux';

export const useSocket = (event, callback) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // Connect if not already connected
    socketService.connect(token);

    if (event && callback) {
      socketService.on(event, callback);
    }

    return () => {
      if (event && callback) {
        socketService.off(event, callback);
      }
    };
  }, [event, callback, token, isAuthenticated]);

  return socketService;
};

export default useSocket;

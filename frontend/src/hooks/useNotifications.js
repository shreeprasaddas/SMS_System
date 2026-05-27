import { useSelector, useDispatch } from 'react-redux';
import {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} from '@/store/slices/notificationSlice.js';
import notificationService from '@/services/notification.service.js';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.notification);

  const triggerToast = (type, message, options = {}) => {
    switch (type) {
      case 'success':
        notificationService.success(message, options);
        break;
      case 'error':
        notificationService.error(message, options);
        break;
      case 'info':
        notificationService.info(message, options);
        break;
      case 'loading':
        return notificationService.loading(message, options);
      default:
        break;
    }
  };

  return {
    ...state,
    setNotifications: (notifications) => dispatch(setNotifications(notifications)),
    addNotification: (notification) => dispatch(addNotification(notification)),
    markAsRead: (id) => dispatch(markAsRead(id)),
    markAllAsRead: () => dispatch(markAllAsRead()),
    clearNotifications: () => dispatch(clearNotifications()),
    toast: triggerToast,
    dismissToast: (id) => notificationService.dismiss(id),
  };
};

export default useNotifications;

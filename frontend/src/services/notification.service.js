import { toast } from 'react-hot-toast';

const notificationService = {
  success: (message, options = {}) => {
    return toast.success(message, {
      id: message, // prevent duplicates if same message is fired
      ...options,
    });
  },

  error: (message, options = {}) => {
    return toast.error(message || 'An error occurred. Please try again.', {
      id: message,
      ...options,
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      id: message,
      icon: 'ℹ️',
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, options);
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  promise: (promise, messages = { loading: 'Loading...', success: 'Success!', error: 'Error!' }, options = {}) => {
    return toast.promise(promise, messages, options);
  }
};

export default notificationService;

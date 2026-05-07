import { useSelector } from 'react-redux';
import { PERMISSIONS } from '../utils/permissions.js';

export const usePermission = () => {
  const { user } = useSelector((state) => state.auth);

  const can = (action) => {
    if (!user) return false;
    const rolePermissions = PERMISSIONS[user.role] || [];
    return rolePermissions.includes(action);
  };

  const canAny = (...actions) => {
    return actions.some((action) => can(action));
  };

  const canAll = (...actions) => {
    return actions.every((action) => can(action));
  };

  return {
    can,
    canAny,
    canAll,
    role: user?.role,
    user,
  };
};

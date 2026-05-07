// RBAC Permissions mapping
// Maps user roles to allowed actions
export const PERMISSIONS = {
  SUPER_ADMIN: [
    // All permissions
    'VIEW_DASHBOARD',
    'VIEW_STUDENTS',
    'CREATE_STUDENT',
    'EDIT_STUDENT',
    'DELETE_STUDENT',
    'VIEW_TEACHERS',
    'CREATE_TEACHER',
    'EDIT_TEACHER',
    'DELETE_TEACHER',
    'VIEW_FEES',
    'CREATE_FEE',
    'EDIT_FEE',
    'DELETE_FEE',
    'COLLECT_PAYMENT',
    'VIEW_ANALYTICS',
    'VIEW_ATTENDANCE',
    'MARK_ATTENDANCE',
    'VIEW_GRADES',
    'ENTER_GRADES',
    'VIEW_SETTINGS',
    'EDIT_SETTINGS',
  ],

  ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_STUDENTS',
    'CREATE_STUDENT',
    'EDIT_STUDENT',
    'DELETE_STUDENT',
    'VIEW_TEACHERS',
    'CREATE_TEACHER',
    'EDIT_TEACHER',
    'DELETE_TEACHER',
    'VIEW_FEES',
    'CREATE_FEE',
    'EDIT_FEE',
    'DELETE_FEE',
    'COLLECT_PAYMENT',
    'VIEW_ANALYTICS',
    'VIEW_ATTENDANCE',
    'MARK_ATTENDANCE',
    'VIEW_GRADES',
    'ENTER_GRADES',
    'VIEW_SETTINGS',
  ],

  PRINCIPAL: [
    'VIEW_DASHBOARD',
    'VIEW_STUDENTS',
    'VIEW_TEACHERS',
    'VIEW_FEES',
    'VIEW_ANALYTICS',
    'VIEW_ATTENDANCE',
    'VIEW_GRADES',
    'VIEW_SETTINGS',
  ],

  VICE_PRINCIPAL: [
    'VIEW_DASHBOARD',
    'VIEW_STUDENTS',
    'VIEW_TEACHERS',
    'VIEW_ATTENDANCE',
    'VIEW_GRADES',
  ],

  TEACHER: [
    'VIEW_DASHBOARD',
    'VIEW_STUDENTS',
    'VIEW_ATTENDANCE',
    'MARK_ATTENDANCE',
    'VIEW_GRADES',
    'ENTER_GRADES',
  ],

  STUDENT: [
    'VIEW_DASHBOARD',
    'VIEW_GRADES',
    'VIEW_ATTENDANCE',
  ],

  PARENT: [
    'VIEW_DASHBOARD',
    'VIEW_GRADES',
    'VIEW_ATTENDANCE',
  ],

  ACCOUNTANT: [
    'VIEW_DASHBOARD',
    'VIEW_FEES',
    'CREATE_FEE',
    'EDIT_FEE',
    'COLLECT_PAYMENT',
    'VIEW_ANALYTICS',
  ],

  LIBRARIAN: [
    'VIEW_DASHBOARD',
  ],

  ADMISSION_OFFICER: [
    'VIEW_DASHBOARD',
    'VIEW_STUDENTS',
    'CREATE_STUDENT',
  ],
};

// Helper function to check permission
export const hasPermission = (userRole, action) => {
  const permissions = PERMISSIONS[userRole] || [];
  return permissions.includes(action);
};

// Helper function to check any permission
export const hasAnyPermission = (userRole, actions) => {
  return actions.some((action) => hasPermission(userRole, action));
};

// Helper function to check all permissions
export const hasAllPermissions = (userRole, actions) => {
  return actions.every((action) => hasPermission(userRole, action));
};

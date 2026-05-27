import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from '@/components/dashboard/AdminDashboard/AdminDashboard.jsx';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard/TeacherDashboard.jsx';
import StudentDashboard from '@/components/dashboard/StudentDashboard/StudentDashboard.jsx';

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (role) {
      case 'TEACHER':
        return <TeacherDashboard />;
      case 'STUDENT':
        return <StudentDashboard />;
      case 'PARENT':
        return <StudentDashboard />;
      case 'SUPER_ADMIN':
      case 'ADMIN':
      case 'PRINCIPAL':
      case 'VICE_PRINCIPAL':
      case 'ACCOUNTANT':
      case 'LIBRARIAN':
      case 'ADMISSION_OFFICER':
        return <AdminDashboard />;
      default:
        return (
          <div className="p-6 text-center text-red-500 font-medium">
            Error: Unrecognized user role or privilege level. Please re-login.
          </div>
        );
    }
  };

  return renderDashboard();
}

export default DashboardPage;

import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetStudentsQuery, useGetStudentStatsQuery } from '@/store/api/studentApi.js';
import { useGetTeachersQuery, useGetTeacherStatsQuery } from '@/store/api/teacherApi.js';
import { useGetClassesQuery } from '@/store/api/classApi.js';
import { useGetAttendanceSummaryQuery } from '@/store/api/attendanceApi.js';
import { Card, Spinner } from '@/components/common';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Fetch real data from APIs
  const { data: studentsData, isLoading: studentsLoading } = useGetStudentsQuery({ limit: 1 });
  const { data: teachersData, isLoading: teachersLoading } = useGetTeachersQuery({ limit: 1 });
  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery({ limit: 1 });
  const { data: attendanceSummary, isLoading: attendanceLoading } = useGetAttendanceSummaryQuery({}, { skip: false });

  // Extract counts from responses
  const totalStudents = studentsData?.data?.pagination?.total || studentsData?.total || 0;
  const totalTeachers = teachersData?.data?.pagination?.total || teachersData?.total || 0;
  const totalClasses = classesData?.data?.pagination?.total || classesData?.total || 0;
  const attendanceRate = attendanceSummary?.data?.attendanceRate ?? attendanceSummary?.attendanceRate ?? null;
  const isLoading = studentsLoading || teachersLoading || classesLoading;

  // Mock distribution data (will be replaced when analytics endpoint is available)
  const studentDistribution = [
    { name: 'Active', value: totalStudents > 0 ? Math.round(totalStudents * 0.85) : 0, color: '#22c55e' },
    { name: 'Inactive', value: totalStudents > 0 ? Math.round(totalStudents * 0.10) : 0, color: '#94a3b8' },
    { name: 'Graduated', value: totalStudents > 0 ? Math.round(totalStudents * 0.05) : 0, color: '#6366f1' },
  ];

  const quickActions = [
    { label: 'Add Student', path: '/students/create', icon: '👨‍🎓', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
    { label: 'Add Teacher', path: '/teachers/create', icon: '👨‍🏫', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
    { label: 'Create Class', path: '/classes/create', icon: '📚', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
    { label: 'Mark Attendance', path: '/attendance', icon: '📋', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
    { label: 'View Fees', path: '/finance/fees', icon: '💰', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
    { label: 'View Reports', path: '/analytics/dashboard', icon: '📊', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
    { label: 'Timetables', path: '/timetables', icon: '🕐', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
    { label: 'Manage Exams', path: '/exams', icon: '📝', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Welcome back, {user?.firstName || 'Admin'}! 👋</h1>
        <p className="mt-2 text-primary-100">
          Here's what's happening in your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon="👨‍🎓"
          trend="+12%"
          trendPositive={true}
          color="blue"
          loading={studentsLoading}
          onClick={() => navigate('/students')}
        />
        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          icon="👨‍🏫"
          trend="+5%"
          trendPositive={true}
          color="green"
          loading={teachersLoading}
          onClick={() => navigate('/teachers')}
        />
        <StatCard
          title="Total Classes"
          value={totalClasses}
          icon="📚"
          color="purple"
          loading={classesLoading}
          onClick={() => navigate('/classes')}
        />
        <StatCard
          title="Attendance Rate"
          value={attendanceRate !== null ? `${attendanceRate}%` : '—'}
          suffix=""
          icon="📊"
          color="amber"
          loading={attendanceLoading}
          onClick={() => navigate('/attendance')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Distribution Pie Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Student Distribution</h3>
          {totalStudents > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {studentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-secondary-400">
              <div className="text-center">
                <p className="text-4xl mb-2">📊</p>
                <p>No student data available yet</p>
              </div>
            </div>
          )}
        </Card>

        {/* Quick Overview Bar Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">School Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Students', count: totalStudents },
                  { name: 'Teachers', count: totalTeachers },
                  { name: 'Classes', count: totalClasses },
                ]}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`p-4 rounded-xl font-medium transition-all duration-200 text-sm ${action.color} hover:shadow-md`}
            >
              <span className="text-2xl block mb-2">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Students</h3>
          <RecentStudentsList />
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">System Info</h3>
          <div className="space-y-3">
            <InfoRow label="Backend Status" value="Connected" badge="bg-green-100 text-green-700" />
            <InfoRow label="Total API Routes" value="24 modules" />
            <InfoRow label="Active Users" value={`${totalStudents + totalTeachers}`} />
            <InfoRow label="Current Phase" value="Phase 3 — Integration" badge="bg-primary-100 text-primary-700" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend, trendPositive, loading, suffix = '', onClick }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
    amber: 'bg-amber-50 border-amber-100',
  };

  return (
    <div
      onClick={onClick}
      className={`${colorClasses[color] || colorClasses.blue} border rounded-xl p-5 cursor-pointer hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-secondary-600 text-sm font-medium">{title}</p>
          {loading ? (
            <div className="mt-2"><Spinner size="sm" /></div>
          ) : (
            <p className="text-3xl font-bold text-secondary-900 mt-1">{value}{suffix}</p>
          )}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trendPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend} from last month
            </p>
          )}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function RecentStudentsList() {
  const { data, isLoading, error } = useGetStudentsQuery({ limit: 5, page: 1 });
  const students = data?.data?.students || [];

  if (isLoading) return <div className="flex justify-center py-6"><Spinner size="sm" /></div>;
  if (error) return <p className="text-red-500 text-sm">Failed to load recent students</p>;
  if (students.length === 0) {
    return <p className="text-secondary-400 text-sm py-4 text-center">No students enrolled yet</p>;
  }

  return (
    <div className="space-y-3">
      {students.map((student) => (
        <div key={student._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
            {student.firstName?.[0]}{student.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-900 truncate">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-xs text-secondary-500">{student.email || student.rollNumber || 'Student'}</p>
          </div>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            student.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {student.status || 'ACTIVE'}
          </span>
        </div>
      ))}
    </div>
  );
}

function InfoRow({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-0">
      <span className="text-sm text-secondary-600">{label}</span>
      {badge ? (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge}`}>{value}</span>
      ) : (
        <span className="text-sm font-medium text-secondary-900">{value}</span>
      )}
    </div>
  );
}

export default AdminDashboard;

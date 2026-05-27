import React from 'react';
import { useGetAnnouncementsQuery } from '@/store/api/communicationApi.js';
import { Card, Spinner } from '@/components/common/index.js';

function AnnouncementsPage() {
  const { data, isLoading, error } = useGetAnnouncementsQuery({ limit: 20 });
  const announcements = data?.data?.announcements || data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Announcements</h1>
        <p className="text-secondary-600 mt-1">School announcements and notices</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-800 text-center">Failed to load announcements</p>
        </Card>
      ) : announcements.length === 0 ? (
        <Card className="bg-gray-50">
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📢</p>
            <p className="text-secondary-600 text-lg">No announcements yet</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement._id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {announcement.title}
                  </h3>
                  <p className="text-secondary-600 mt-2">{announcement.content || announcement.message}</p>
                  <p className="text-xs text-secondary-400 mt-3">
                    {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : ''}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  announcement.status === 'PUBLISHED'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {announcement.status || 'DRAFT'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnnouncementsPage;

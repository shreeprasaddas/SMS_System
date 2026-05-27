import React, { useState } from 'react';
import { useUploadStudentPhotoMutation } from '@/store/api/studentApi.js';
import { Button } from '@/components/common';
import toast from 'react-hot-toast';

function DocumentUpload({ studentId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploadDocument, { isLoading }] = useUploadStudentPhotoMutation(); // Using photo mutation as placeholder for general document

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      await uploadDocument({ studentId, file }).unwrap();
      toast.success('Document uploaded successfully');
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to upload document');
    }
  };

  return (
    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-primary-50 file:text-primary-700
          hover:file:bg-primary-100"
      />
      <Button
        variant="primary"
        onClick={handleUpload}
        disabled={!file}
        loading={isLoading}
      >
        Upload
      </Button>
    </div>
  );
}

export default DocumentUpload;

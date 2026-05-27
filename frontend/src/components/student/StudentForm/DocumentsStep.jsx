import React from 'react';
import { FilePreview, FileUpload } from '@/components/common';

function DocumentsStep({ data = {}, onChange }) {
  const handleFileChange = (field, file) => {
    onChange(field, file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-secondary-800 mb-2">Student Photo</h4>
        <FileUpload
          onFileSelect={(file) => handleFileChange('profileImage', file)}
          accept="image/*"
          label="Choose Student Photo"
        />
        {data.profileImage && (
          <div className="mt-2">
            <FilePreview file={data.profileImage} onRemove={() => handleFileChange('profileImage', null)} />
          </div>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-secondary-800 mb-2">Birth Certificate (PDF/Image)</h4>
        <FileUpload
          onFileSelect={(file) => handleFileChange('birthCertificate', file)}
          accept="image/*,application/pdf"
          label="Choose Birth Certificate"
        />
        {data.birthCertificate && (
          <div className="mt-2">
            <FilePreview file={data.birthCertificate} onRemove={() => handleFileChange('birthCertificate', null)} />
          </div>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-secondary-800 mb-2">Previous Academic Records (Optional)</h4>
        <FileUpload
          onFileSelect={(file) => handleFileChange('previousRecords', file)}
          accept="image/*,application/pdf"
          label="Choose Academic Records"
        />
        {data.previousRecords && (
          <div className="mt-2">
            <FilePreview file={data.previousRecords} onRemove={() => handleFileChange('previousRecords', null)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentsStep;

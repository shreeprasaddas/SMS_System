import React from 'react';
import { Input } from '@/components/common';

function QualificationDetails({ data = {}, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label="Qualification"
        value={data.qualification || ''}
        onChange={(e) => onChange('qualification', e.target.value)}
        required
        placeholder="e.g. M.Sc. in Mathematics, Ph.D. in Physics"
      />
      <Input
        label="Designation"
        value={data.designation || ''}
        onChange={(e) => onChange('designation', e.target.value)}
        required
        placeholder="e.g. Senior Lecturer, Assistant Professor"
      />
      <Input
        label="Salary"
        type="number"
        value={data.salary || ''}
        onChange={(e) => onChange('salary', e.target.value)}
        required
      />
      <Input
        label="Years of Experience"
        type="number"
        value={data.experience || ''}
        onChange={(e) => onChange('experience', e.target.value)}
      />
    </div>
  );
}

export default QualificationDetails;

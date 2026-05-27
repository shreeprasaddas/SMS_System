import React from 'react';
import { Select } from '@/components/common';

function SubjectAssign({ data = {}, onChange, subjects = [], classes = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Select
        label="Assigned Subject"
        value={data.subjectId || ''}
        onChange={(val) => onChange('subjectId', val)}
        options={subjects.map((sub) => ({ label: sub.name, value: sub._id }))}
        placeholder="Select a subject"
      />
      <Select
        label="Assigned Class"
        value={data.classId || ''}
        onChange={(val) => onChange('classId', val)}
        options={classes.map((cls) => ({ label: cls.name, value: cls._id }))}
        placeholder="Select a class"
      />
    </div>
  );
}

export default SubjectAssign;

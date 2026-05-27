import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader/PageHeader.jsx';
import Card from '@/components/common/Card.jsx';
import Table from '@/components/common/Table/Table.jsx';
import Select from '@/components/common/Select.jsx';
import Button from '@/components/common/Button.jsx';
import SearchBar from '@/components/common/SearchBar/SearchBar.jsx';
import { useGetSubjectsQuery } from '@/store/api/subjectApi.js';

const mockQuestions = [
  { id: 1, text: 'Solve for x: 2x + 5 = 15.', subject: 'Mathematics', marks: 5, difficulty: 'Easy' },
  { id: 2, text: 'Explain the process of photosynthesis in detail.', subject: 'Science', marks: 10, difficulty: 'Medium' },
  { id: 3, text: 'Describe the main causes of World War I.', subject: 'Social Studies', marks: 10, difficulty: 'Hard' },
  { id: 4, text: 'Write an essay on the importance of digital literacy.', subject: 'English', marks: 15, difficulty: 'Medium' },
];

function QuestionBankPage() {
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');
  
  const { data: subjectsData } = useGetSubjectsQuery();
  const subjectOptions = (subjectsData?.data || []).map((s) => ({
    label: s.name,
    value: s.name,
  }));

  const filteredQuestions = mockQuestions.filter(
    (q) =>
      (!subject || q.subject === subject) &&
      (!search || q.text.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Bank"
        subtitle="Manage questions for creating tests and examinations"
        actions={<Button variant="primary">+ Create Question</Button>}
      />
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search questions..." className="max-w-xs" />
          <div className="w-48">
            <Select
              value={subject}
              onChange={setSubject}
              options={subjectOptions}
              placeholder="All Subjects"
            />
          </div>
        </div>

        <Table
          headers={['Question', 'Subject', 'Marks', 'Difficulty']}
          data={filteredQuestions}
          renderRow={(row, i) => (
            <>
              <td className="px-6 py-4 font-medium text-secondary-900">{row.text}</td>
              <td className="px-6 py-4">{row.subject}</td>
              <td className="px-6 py-4">{row.marks}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  row.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  row.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {row.difficulty}
                </span>
              </td>
            </>
          )}
        />
      </Card>
    </div>
  );
}

export default QuestionBankPage;

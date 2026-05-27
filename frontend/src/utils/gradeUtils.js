export const getLetterGrade = (marks, scale = 'default') => {
  if (marks === undefined || marks === null) return 'N/A';
  
  if (scale === 'gpa') {
    if (marks >= 3.6) return 'A';
    if (marks >= 3.2) return 'B+';
    if (marks >= 2.8) return 'B';
    if (marks >= 2.4) return 'C+';
    if (marks >= 2.0) return 'C';
    if (marks >= 1.6) return 'D';
    return 'E/F';
  }

  // Default percentage scale
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
};

export const getGPAPoint = (marks) => {
  if (marks === undefined || marks === null) return 0;
  if (marks >= 90) return 4.0;
  if (marks >= 80) return 3.5;
  if (marks >= 70) return 3.0;
  if (marks >= 60) return 2.5;
  if (marks >= 50) return 2.0;
  return 0;
};

export const calculateGPA = (subjects = []) => {
  if (!subjects || subjects.length === 0) return 0;
  const totalPoints = subjects.reduce((sum, sub) => sum + getGPAPoint(sub.marks), 0);
  return parseFloat((totalPoints / subjects.length).toFixed(2));
};

export const isPass = (marks, passMark = 50) => {
  if (marks === undefined || marks === null) return false;
  return marks >= passMark;
};

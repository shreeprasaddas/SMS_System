const Assignment = require('../models/assignment/Assignment.model');
const Submission = require('../models/assignment/Submission.model');
const Evaluation = require('../models/assignment/Evaluation.model');
const Rubric = require('../models/assignment/Rubric.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create assignment
 * @param {string} schoolId
 * @param {Object} data - Assignment data
 * @param {string} userId - Creator user ID
 * @returns {Promise<Object>} Created assignment
 */
exports.createAssignment = async (schoolId, data, userId) => {
  const assignment = await Assignment.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return assignment;
};

/**
 * Get all assignments with pagination
 * @param {string} schoolId
 * @param {Object} filters - { status, subjectId, classId, page, limit }
 * @returns {Promise<{assignments: Array, total: number}>}
 */
exports.getAllAssignments = async (schoolId, filters) => {
  const { status, subjectId, classId, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (status) filterObj.status = status;
  if (subjectId) filterObj.subjectId = subjectId;
  if (classId) filterObj.classId = classId;

  const skip = (page - 1) * limit;

  const [assignments, total] = await Promise.all([
    Assignment.find(filterObj)
      .populate('subjectId', 'subjectName')
      .populate('classId', 'className')
      .populate('teacherId', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ publishedDate: -1 })
      .lean(),
    Assignment.countDocuments(filterObj)
  ]);

  return { assignments, total };
};

/**
 * Get assignment by ID
 * @param {string} schoolId
 * @param {string} assignmentId
 * @returns {Promise<Object>} Assignment record
 */
exports.getAssignmentById = async (schoolId, assignmentId) => {
  const assignment = await Assignment.findOne({
    _id: assignmentId,
    schoolId
  })
    .populate('subjectId')
    .populate('classId')
    .populate('teacherId')
    .populate('rubricId')
    .populate('academicYearId');

  if (!assignment) throw new AppError('Assignment not found', 404);

  return assignment;
};

/**
 * Update assignment
 * @param {string} schoolId
 * @param {string} assignmentId
 * @param {Object} updateData
 * @returns {Promise<Object>} Updated assignment
 */
exports.updateAssignment = async (schoolId, assignmentId, updateData) => {
  const assignment = await Assignment.findOneAndUpdate(
    { _id: assignmentId, schoolId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!assignment) throw new AppError('Assignment not found', 404);

  return assignment;
};

/**
 * Publish assignment
 * @param {string} schoolId
 * @param {string} assignmentId
 * @returns {Promise<Object>} Updated assignment
 */
exports.publishAssignment = async (schoolId, assignmentId) => {
  const assignment = await Assignment.findOneAndUpdate(
    { _id: assignmentId, schoolId },
    { $set: { status: 'PUBLISHED', publishedDate: new Date() } },
    { new: true }
  );

  if (!assignment) throw new AppError('Assignment not found', 404);

  return assignment;
};

/**
 * Close assignment for submissions
 * @param {string} schoolId
 * @param {string} assignmentId
 * @returns {Promise<Object>} Updated assignment
 */
exports.closeAssignment = async (schoolId, assignmentId) => {
  const assignment = await Assignment.findOneAndUpdate(
    { _id: assignmentId, schoolId },
    { $set: { status: 'CLOSED', closedDate: new Date() } },
    { new: true }
  );

  if (!assignment) throw new AppError('Assignment not found', 404);

  return assignment;
};

/**
 * Get student's submissions for assignment
 * @param {string} schoolId
 * @param {string} assignmentId
 * @param {string} studentId
 * @returns {Promise<Array>} Student submissions
 */
exports.getStudentSubmissions = async (schoolId, assignmentId, studentId) => {
  const submissions = await Submission.find({
    assignmentId,
    studentId,
    schoolId
  })
    .populate('evaluationId')
    .sort({ submissionDate: -1 })
    .lean();

  return submissions;
};

/**
 * Submit assignment
 * @param {string} schoolId
 * @param {string} assignmentId
 * @param {string} studentId
 * @param {Object} submissionData
 * @returns {Promise<Object>} Created submission
 */
exports.submitAssignment = async (schoolId, assignmentId, studentId, submissionData) => {
  const assignment = await Assignment.findOne({ _id: assignmentId, schoolId });
  if (!assignment) throw new AppError('Assignment not found', 404);

  // Check if submission is late
  const isLate = new Date() > assignment.dueDate;

  const submission = await Submission.create({
    ...submissionData,
    assignmentId,
    studentId,
    schoolId,
    isLateSubmission: isLate,
    status: 'SUBMITTED'
  });

  // Update assignment submission count
  await Assignment.updateOne(
    { _id: assignmentId },
    { $inc: { submittedCount: 1, totalSubmissions: 1 } }
  );

  return submission;
};

/**
 * Get assignment submissions (for teacher)
 * @param {string} schoolId
 * @param {string} assignmentId
 * @param {Object} filters - { status, page, limit }
 * @returns {Promise<{submissions: Array, total: number}>}
 */
exports.getAssignmentSubmissions = async (schoolId, assignmentId, filters) => {
  const { status, page = 1, limit = 20 } = filters;

  const filterObj = { assignmentId, schoolId };
  if (status) filterObj.status = status;

  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    Submission.find(filterObj)
      .populate('studentId', 'firstName lastName rollNumber')
      .populate('evaluationId')
      .skip(skip)
      .limit(Number(limit))
      .sort({ submissionDate: -1 })
      .lean(),
    Submission.countDocuments(filterObj)
  ]);

  return { submissions, total };
};

/**
 * Create evaluation for submission
 * @param {string} schoolId
 * @param {string} submissionId
 * @param {Object} evaluationData
 * @param {string} userId - Evaluator user ID
 * @returns {Promise<Object>} Created evaluation
 */
exports.createEvaluation = async (schoolId, submissionId, evaluationData, userId) => {
  const submission = await Submission.findOne({ _id: submissionId, schoolId });
  if (!submission) throw new AppError('Submission not found', 404);

  const evaluation = await Evaluation.create({
    ...evaluationData,
    submissionId,
    schoolId,
    evaluatedBy: userId,
    assignmentId: submission.assignmentId,
    studentId: submission.studentId
  });

  // Update submission with evaluation
  await Submission.updateOne(
    { _id: submissionId },
    {
      $set: {
        evaluationId: evaluation._id,
        status: 'GRADED',
        marks: evaluationData.obtainedMarks,
        gradedBy: userId,
        gradingDate: new Date()
      }
    }
  );

  // Update assignment graded count
  await Assignment.updateOne(
    { _id: submission.assignmentId },
    { $inc: { gradedCount: 1 } }
  );

  return evaluation;
};

/**
 * Get evaluation
 * @param {string} schoolId
 * @param {string} evaluationId
 * @returns {Promise<Object>} Evaluation record
 */
exports.getEvaluation = async (schoolId, evaluationId) => {
  const evaluation = await Evaluation.findOne({
    _id: evaluationId,
    schoolId
  })
    .populate('studentId')
    .populate('evaluatedBy')
    .populate('submissionId');

  if (!evaluation) throw new AppError('Evaluation not found', 404);

  return evaluation;
};

/**
 * Update evaluation
 * @param {string} schoolId
 * @param {string} evaluationId
 * @param {Object} updateData
 * @returns {Promise<Object>} Updated evaluation
 */
exports.updateEvaluation = async (schoolId, evaluationId, updateData) => {
  const evaluation = await Evaluation.findOneAndUpdate(
    { _id: evaluationId, schoolId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!evaluation) throw new AppError('Evaluation not found', 404);

  return evaluation;
};

/**
 * Get assignment statistics
 * @param {string} schoolId
 * @param {string} assignmentId
 * @returns {Promise<Object>} Statistics
 */
exports.getAssignmentStatistics = async (schoolId, assignmentId) => {
  const assignment = await Assignment.findOne({ _id: assignmentId, schoolId });
  if (!assignment) throw new AppError('Assignment not found', 404);

  const submissions = await Submission.find({ assignmentId, schoolId });
  const evaluations = await Evaluation.find({ assignmentId, schoolId });

  const marks = evaluations.map(e => e.obtainedMarks);
  const average = marks.length > 0 ? marks.reduce((a, b) => a + b) / marks.length : 0;

  return {
    totalSubmissions: submissions.length,
    gradedSubmissions: evaluations.length,
    pendingGrading: submissions.length - evaluations.length,
    averageMarks: average.toFixed(2),
    highestMarks: Math.max(...marks, 0),
    lowestMarks: Math.min(...marks, 0),
    submissionDeadline: assignment.dueDate,
    lateSubmissions: submissions.filter(s => s.isLateSubmission).length
  };
};

/**
 * Create rubric
 * @param {string} schoolId
 * @param {Object} data - Rubric data
 * @param {string} userId - Creator user ID
 * @returns {Promise<Object>} Created rubric
 */
exports.createRubric = async (schoolId, data, userId) => {
  const rubric = await Rubric.create({
    ...data,
    schoolId,
    createdBy: userId
  });
  return rubric;
};

/**
 * Get all rubrics
 * @param {string} schoolId
 * @param {Object} filters - { isTemplate, status, page, limit }
 * @returns {Promise<{rubrics: Array, total: number}>}
 */
exports.getAllRubrics = async (schoolId, filters) => {
  const { isTemplate, status, page = 1, limit = 20 } = filters;

  const filterObj = { schoolId };
  if (isTemplate !== undefined) filterObj.isTemplate = isTemplate;
  if (status) filterObj.status = status;

  const skip = (page - 1) * limit;

  const [rubrics, total] = await Promise.all([
    Rubric.find(filterObj)
      .populate('createdBy', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),
    Rubric.countDocuments(filterObj)
  ]);

  return { rubrics, total };
};

/**
 * Get rubric by ID
 * @param {string} schoolId
 * @param {string} rubricId
 * @returns {Promise<Object>} Rubric record
 */
exports.getRubricById = async (schoolId, rubricId) => {
  const rubric = await Rubric.findOne({
    _id: rubricId,
    schoolId
  }).populate('createdBy', 'firstName lastName');

  if (!rubric) throw new AppError('Rubric not found', 404);

  return rubric;
};

/**
 * Update rubric
 * @param {string} schoolId
 * @param {string} rubricId
 * @param {Object} updateData
 * @returns {Promise<Object>} Updated rubric
 */
exports.updateRubric = async (schoolId, rubricId, updateData) => {
  const rubric = await Rubric.findOneAndUpdate(
    { _id: rubricId, schoolId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!rubric) throw new AppError('Rubric not found', 404);

  return rubric;
};

module.exports = exports;

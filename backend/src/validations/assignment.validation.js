const Joi = require('joi');

// Create assignment schema
exports.createAssignmentSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim(),
  instructions: Joi.string().trim(),
  subjectId: Joi.string().hex().length(24).required(),
  classId: Joi.string().hex().length(24).required(),
  academicYearId: Joi.string().hex().length(24).required(),
  assignmentType: Joi.string()
    .valid(
      'HOMEWORK',
      'PROJECT',
      'RESEARCH',
      'PROBLEM_SET',
      'ESSAY',
      'PRESENTATION',
      'GROUP_WORK',
      'PRACTICAL',
      'LAB_WORK',
      'QUIZ',
      'OTHER'
    )
    .required(),
  topic: Joi.string().trim(),
  learningObjectives: Joi.array().items(Joi.string()),
  publishedDate: Joi.date().iso(),
  dueDate: Joi.date().iso().required(),
  submissionDeadline: Joi.date().iso().required(),
  allowLateSubmission: Joi.boolean(),
  gracePeriod: Joi.object({
    value: Joi.number().min(1),
    unit: Joi.string().valid('HOURS', 'DAYS')
  }),
  lateSubmissionPenalty: Joi.number().min(0).max(100),
  totalMarks: Joi.number().min(0).required(),
  rubricId: Joi.string().hex().length(24),
  isGroupAssignment: Joi.boolean(),
  groupSize: Joi.object({
    min: Joi.number().min(2),
    max: Joi.number(),
    recommended: Joi.number()
  }),
  allowAttachmentUpload: Joi.boolean(),
  allowTextSubmission: Joi.boolean(),
  maxFileSize: Joi.object({
    value: Joi.number().min(1),
    unit: Joi.string().valid('MB', 'GB')
  }),
  allowedFileTypes: Joi.array().items(Joi.string()),
  checkPlagiarism: Joi.boolean(),
  plagiarismThreshold: Joi.number().min(0).max(100),
  sendReminderEmail: Joi.boolean(),
  reminderBeforeDueDays: Joi.number().min(0)
}).required();

// Update assignment schema
exports.updateAssignmentSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  instructions: Joi.string().trim(),
  dueDate: Joi.date().iso(),
  submissionDeadline: Joi.date().iso(),
  allowLateSubmission: Joi.boolean(),
  lateSubmissionPenalty: Joi.number().min(0).max(100),
  totalMarks: Joi.number().min(0),
  rubricId: Joi.string().hex().length(24),
  checkPlagiarism: Joi.boolean(),
  plagiarismThreshold: Joi.number().min(0).max(100)
}).min(1).required();

// Submit assignment schema
exports.submitAssignmentSchema = Joi.object({
  submissionFile: Joi.array().items(
    Joi.object({
      fileName: Joi.string(),
      fileUrl: Joi.string().uri(),
      fileType: Joi.string()
    })
  ),
  submissionText: Joi.string().trim(),
  submissionLinks: Joi.array().items(
    Joi.object({
      title: Joi.string(),
      url: Joi.string().uri()
    })
  )
}).min(1).required();

// Create evaluation schema
exports.createEvaluationSchema = Joi.object({
  totalMarks: Joi.number().min(0).required(),
  obtainedMarks: Joi.number().min(0).required(),
  rubricScores: Joi.array().items(
    Joi.object({
      criterionName: Joi.string(),
      maxScore: Joi.number(),
      obtainedScore: Joi.number(),
      feedbackLevel: Joi.string().valid('EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT'),
      comments: Joi.string()
    })
  ),
  strengths: Joi.array().items(Joi.string()),
  areasForImprovement: Joi.array().items(Joi.string()),
  overallFeedback: Joi.string().trim(),
  constructiveSuggestions: Joi.string().trim(),
  plagiarismDetected: Joi.boolean(),
  plagiarismSimilarityScore: Joi.number().min(0).max(100),
  cheatingDetected: Joi.boolean(),
  cheatingDetails: Joi.string(),
  status: Joi.string().valid('IN_PROGRESS', 'COMPLETED', 'RETURNED_FOR_REVISION', 'FINALIZED', 'UNDER_REVIEW')
}).required();

// Update evaluation schema
exports.updateEvaluationSchema = Joi.object({
  obtainedMarks: Joi.number().min(0),
  strengths: Joi.array().items(Joi.string()),
  areasForImprovement: Joi.array().items(Joi.string()),
  overallFeedback: Joi.string().trim(),
  constructiveSuggestions: Joi.string().trim(),
  status: Joi.string().valid('IN_PROGRESS', 'COMPLETED', 'RETURNED_FOR_REVISION', 'FINALIZED', 'UNDER_REVIEW'),
  appealed: Joi.boolean(),
  appealedBy: Joi.string().valid('STUDENT', 'PARENT'),
  appealReason: Joi.string().trim()
}).min(1).required();

// Create rubric schema
exports.createRubricSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
  subjectId: Joi.string().hex().length(24),
  classId: Joi.string().hex().length(24),
  academicYearId: Joi.string().hex().length(24),
  rubricType: Joi.string().valid('ANALYTICAL', 'HOLISTIC', 'CHECKLIST'),
  totalPoints: Joi.number().min(1).required(),
  criteria: Joi.array()
    .items(
      Joi.object({
        criterionName: Joi.string().required(),
        description: Joi.string(),
        weight: Joi.number().min(0).max(100).required(),
        maxPoints: Joi.number().min(0).required(),
        levels: Joi.array().items(
          Joi.object({
            levelName: Joi.string().valid('EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR'),
            points: Joi.number().min(0),
            descriptor: Joi.string(),
            indicators: Joi.array().items(Joi.string())
          })
        )
      })
    )
    .required(),
  isTemplate: Joi.boolean(),
  templateTags: Joi.array().items(Joi.string()),
  allowScoreOverride: Joi.boolean(),
  allowCustomComments: Joi.boolean(),
  requireComments: Joi.boolean()
}).required();

// Update rubric schema
exports.updateRubricSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  totalPoints: Joi.number().min(1),
  criteria: Joi.array().items(
    Joi.object({
      criterionName: Joi.string(),
      description: Joi.string(),
      weight: Joi.number().min(0).max(100),
      maxPoints: Joi.number().min(0),
      levels: Joi.array().items(
        Joi.object({
          levelName: Joi.string().valid('EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR'),
          points: Joi.number().min(0),
          descriptor: Joi.string(),
          indicators: Joi.array().items(Joi.string())
        })
      )
    })
  ),
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED'),
  allowScoreOverride: Joi.boolean(),
  allowCustomComments: Joi.boolean(),
  requireComments: Joi.boolean()
}).min(1).required();

// Assignment filters schema
exports.assignmentFiltersSchema = Joi.object({
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'SUBMISSION_OPEN', 'CLOSED', 'GRADING_COMPLETED', 'ARCHIVED'),
  subjectId: Joi.string().hex().length(24),
  classId: Joi.string().hex().length(24),
  assignmentType: Joi.string(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

// Submission filters schema
exports.submissionFiltersSchema = Joi.object({
  status: Joi.string().valid('SUBMITTED', 'PENDING_REVIEW', 'GRADED', 'RETURNED', 'LATE_SUBMITTED', 'NOT_SUBMITTED'),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

// Rubric filters schema
exports.rubricFiltersSchema = Joi.object({
  isTemplate: Joi.boolean(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED'),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

module.exports = exports;

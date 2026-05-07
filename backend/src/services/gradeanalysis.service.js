/**
 * Grade Analysis Service
 * Business logic for performance analytics and trend analysis
 */

const GradeAnalysis = require('../models/academics/GradeAnalysis.model');
const Grade = require('../models/academics/Grade.model');
const ReportCard = require('../models/academics/ReportCard.model');
const { AppError } = require('../utils/errorHelper');

class GradeAnalysisService {
  /**
   * Generate student performance analysis
   */
  static async generateStudentAnalysis(schoolId, studentId, academicYearId, userId) {
    // Get all grades for student
    const grades = await Grade.find({
      schoolId,
      student: studentId,
      academicYear: academicYearId,
    }).populate('subject');

    if (grades.length === 0) {
      throw new AppError('No grades found for analysis', 404);
    }

    // Calculate performance metrics
    const percentages = grades.map((g) => g.percentage || 0);
    const averageScore = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const highestScore = Math.max(...percentages);
    const lowestScore = Math.min(...percentages);

    // Calculate standard deviation
    const variance =
      percentages.reduce((sum, p) => sum + Math.pow(p - averageScore, 2), 0) / percentages.length;
    const standardDeviation = Math.sqrt(variance);

    // Score distribution
    const scoreDistribution = {
      excellent: percentages.filter((p) => p >= 90).length,
      good: percentages.filter((p) => p >= 75 && p < 90).length,
      average: percentages.filter((p) => p >= 60 && p < 75).length,
      belowAverage: percentages.filter((p) => p >= 40 && p < 60).length,
      poor: percentages.filter((p) => p < 40).length,
    };

    // Get term-wise trend
    const reportCards = await ReportCard.find({
      schoolId,
      student: studentId,
      academicYear: academicYearId,
    }).sort({ term: 1 });

    const trend = {
      term1Score: reportCards[0]?.overallPercentage || 0,
      term2Score: reportCards[1]?.overallPercentage || 0,
      term3Score: reportCards[2]?.overallPercentage || 0,
    };

    // Calculate improvement
    if (trend.term1Score && trend.term3Score) {
      trend.improvementPercentage = Math.round(
        ((trend.term3Score - trend.term1Score) / trend.term1Score) * 100
      );

      if (trend.improvementPercentage > 5) {
        trend.trend = 'IMPROVING';
      } else if (trend.improvementPercentage < -5) {
        trend.trend = 'DECLINING';
      } else if (Math.abs(trend.improvementPercentage) <= 5) {
        trend.trend = 'STABLE';
      } else {
        trend.trend = 'FLUCTUATING';
      }
    }

    // Identify strengths and weaknesses
    const strengths = grades
      .filter((g) => g.percentage >= 75)
      .map((g) => g.subject.name);
    const weaknesses = grades
      .filter((g) => g.percentage < 60)
      .map((g) => g.subject.name);

    // Generate recommendations
    const recommendations = [];
    if (weaknesses.length > 0) {
      recommendations.push(`Focus on improving ${weaknesses.join(', ')}`);
    }
    if (standardDeviation > 15) {
      recommendations.push('Performance is inconsistent, work on maintaining consistency');
    }
    if (trend.trend === 'DECLINING') {
      recommendations.push('Performance is declining, seek additional support');
    }
    if (trend.trend === 'IMPROVING') {
      recommendations.push('Great progress! Continue your efforts');
    }

    // Create analysis record
    const analysis = new GradeAnalysis({
      schoolId,
      student: studentId,
      class: grades[0]?.class,
      academicYear: academicYearId,
      analysisType: 'STUDENT_PERFORMANCE',
      performanceMetrics: {
        averageScore: Math.round(averageScore),
        highestScore,
        lowestScore,
        standardDeviation: Math.round(standardDeviation),
        scoreDistribution,
      },
      trend,
      strengths,
      weaknesses,
      recommendations,
      generatedBy: userId,
    });

    await analysis.save();
    return analysis.populate(['student', 'class']);
  }

  /**
   * Generate subject-wise analysis
   */
  static async generateSubjectAnalysis(schoolId, subjectId, academicYearId, userId) {
    const grades = await Grade.find({
      schoolId,
      subject: subjectId,
      academicYear: academicYearId,
    });

    if (grades.length === 0) {
      throw new AppError('No grades found for analysis', 404);
    }

    const percentages = grades.map((g) => g.percentage || 0);
    const averageScore = percentages.reduce((a, b) => a + b, 0) / percentages.length;

    const performanceMetrics = {
      averageScore: Math.round(averageScore),
      highestScore: Math.max(...percentages),
      lowestScore: Math.min(...percentages),
      scoreDistribution: {
        excellent: percentages.filter((p) => p >= 90).length,
        good: percentages.filter((p) => p >= 75 && p < 90).length,
        average: percentages.filter((p) => p >= 60 && p < 75).length,
        belowAverage: percentages.filter((p) => p >= 40 && p < 60).length,
        poor: percentages.filter((p) => p < 40).length,
      },
    };

    const analysis = new GradeAnalysis({
      schoolId,
      subject: subjectId,
      academicYear: academicYearId,
      analysisType: 'SUBJECT_WISE',
      performanceMetrics,
      generatedBy: userId,
    });

    await analysis.save();
    return analysis;
  }

  /**
   * Generate comparative analysis (class-wise)
   */
  static async generateComparativeAnalysis(schoolId, classId, academicYearId, userId) {
    const reportCards = await ReportCard.find({
      schoolId,
      class: classId,
      academicYear: academicYearId,
    });

    if (reportCards.length === 0) {
      throw new AppError('No report cards found for analysis', 404);
    }

    const percentages = reportCards.map((rc) => rc.overallPercentage);
    const classAverage = percentages.reduce((a, b) => a + b, 0) / percentages.length;

    // Get analysis records for all students
    const analyses = await Promise.all(
      reportCards.map((rc) =>
        GradeAnalysis.findOne({
          schoolId,
          student: rc.student,
          academicYear: academicYearId,
        })
      )
    );

    return {
      classId,
      classAverage: Math.round(classAverage),
      totalStudents: reportCards.length,
      highestPercentage: Math.max(...percentages),
      lowestPercentage: Math.min(...percentages),
      topperCount: percentages.filter((p) => p >= 90).length,
      failedCount: percentages.filter((p) => p < 40).length,
      performanceDistribution: {
        excellent: percentages.filter((p) => p >= 90).length,
        good: percentages.filter((p) => p >= 75 && p < 90).length,
        average: percentages.filter((p) => p >= 60 && p < 75).length,
        belowAverage: percentages.filter((p) => p >= 40 && p < 60).length,
        poor: percentages.filter((p) => p < 40).length,
      },
    };
  }

  /**
   * Get student performance comparison
   */
  static async getStudentComparison(schoolId, studentId, classId, academicYearId) {
    const studentGrades = await Grade.find({
      schoolId,
      student: studentId,
      academicYear: academicYearId,
    });

    const classGrades = await Grade.find({
      schoolId,
      class: classId,
      academicYear: academicYearId,
    });

    const studentPercentages = studentGrades.map((g) => g.percentage || 0);
    const classPercentages = classGrades.map((g) => g.percentage || 0);

    const studentAverage =
      studentPercentages.reduce((a, b) => a + b, 0) / studentPercentages.length;
    const classAverage = classPercentages.reduce((a, b) => a + b, 0) / classPercentages.length;

    // Calculate percentile
    const betterPerformers = classPercentages.filter((p) => p > studentAverage).length;
    const percentile = Math.round(((classPercentages.length - betterPerformers) / classPercentages.length) * 100);

    return {
      studentAverage: Math.round(studentAverage),
      classAverage: Math.round(classAverage),
      difference: Math.round(studentAverage - classAverage),
      studentPercentile: percentile,
      rank: betterPerformers + 1,
      totalStudents: classPercentages.length,
    };
  }

  /**
   * Get trend analysis
   */
  static async getTrendAnalysis(schoolId, studentId, academicYears) {
    const trends = await Promise.all(
      academicYears.map(async (yearId) => {
        const reportCard = await ReportCard.findOne({
          schoolId,
          student: studentId,
          academicYear: yearId,
        }).populate('academicYear', 'name');

        return {
          academicYear: reportCard?.academicYear?.name,
          overallPercentage: reportCard?.overallPercentage || 0,
        };
      })
    );

    // Calculate trend
    let trendType = 'STABLE';
    if (trends.length >= 2) {
      const lastPercentage = trends[trends.length - 1].overallPercentage;
      const firstPercentage = trends[0].overallPercentage;
      const change = lastPercentage - firstPercentage;

      if (change > 5) trendType = 'IMPROVING';
      else if (change < -5) trendType = 'DECLINING';
    }

    return {
      trends,
      trendType,
    };
  }

  /**
   * Get class performance insights
   */
  static async getClassPerformanceInsights(schoolId, classId, academicYearId) {
    const reportCards = await ReportCard.find({
      schoolId,
      class: classId,
      academicYear: academicYearId,
    }).populate('student', 'firstName lastName enrollmentNumber');

    if (reportCards.length === 0) {
      throw new AppError('No report cards found', 404);
    }

    const percentages = reportCards.map((rc) => rc.overallPercentage);

    // Identify top performers
    const toppers = reportCards
      .sort((a, b) => b.overallPercentage - a.overallPercentage)
      .slice(0, 5);

    // Identify low performers
    const lowPerformers = reportCards
      .filter((rc) => rc.overallPercentage < 40)
      .map((rc) => ({
        student: rc.student.firstName + ' ' + rc.student.lastName,
        percentage: rc.overallPercentage,
      }));

    return {
      classAverage: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length),
      highestScore: Math.max(...percentages),
      lowestScore: Math.min(...percentages),
      toppers: toppers.map((t) => ({
        name: t.student.firstName + ' ' + t.student.lastName,
        percentage: t.overallPercentage,
      })),
      lowPerformers,
      promotedCount: reportCards.filter((rc) => rc.promotionStatus === 'PROMOTED').length,
      detainedCount: reportCards.filter((rc) => rc.promotionStatus === 'DETAINED').length,
    };
  }
}

module.exports = GradeAnalysisService;

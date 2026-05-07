const Alumni = require('../models/alumni/Alumni.model');
const AlumniEvent = require('../models/alumni/AlumniEvent.model');
const AlumniDonation = require('../models/alumni/AlumniDonation.model');
const AlumniJobPosting = require('../models/alumni/AlumniJobPosting.model');
const AlumniMentor = require('../models/alumni/AlumniMentor.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create Alumni Profile
 * @param {object} data - Alumni details
 * @param {string} schoolId
 * @returns {Promise<object>} Created alumni profile
 */
exports.createAlumni = async (data, schoolId) => {
  const alumni = await Alumni.create({
    ...data,
    schoolId
  });
  return alumni;
};

/**
 * Get All Alumni
 * @param {string} schoolId
 * @param {object} filters - { classYear, status, industry, page, limit }
 * @returns {Promise<object>} { alumni, total, pagination }
 */
exports.getAllAlumni = async (schoolId, filters = {}) => {
  const { classYear, status, industry, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (classYear) query.classYear = classYear;
  if (status) query.status = status;
  if (industry) query.industry = industry;

  const skip = (page - 1) * limit;
  const [alumni, total] = await Promise.all([
    Alumni.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Alumni.countDocuments(query)
  ]);

  return { alumni, total, page: Number(page), limit: Number(limit) };
};

/**
 * Get Alumni by ID
 * @param {string} alumniId
 * @param {string} schoolId
 * @returns {Promise<object>} Alumni profile
 */
exports.getAlumniById = async (alumniId, schoolId) => {
  const alumni = await Alumni.findOne({ _id: alumniId, schoolId }).lean();
  if (!alumni) throw new AppError('Alumni not found', 404);
  return alumni;
};

/**
 * Update Alumni Profile
 * @param {string} alumniId
 * @param {object} data
 * @param {string} schoolId
 * @returns {Promise<object>} Updated alumni
 */
exports.updateAlumni = async (alumniId, data, schoolId) => {
  const alumni = await Alumni.findOneAndUpdate(
    { _id: alumniId, schoolId },
    {
      ...data,
      $push: {
        auditLog: {
          action: 'UPDATE',
          performedBy: data.performedBy,
          changes: data
        }
      }
    },
    { new: true, runValidators: true }
  );
  if (!alumni) throw new AppError('Alumni not found', 404);
  return alumni;
};

/**
 * Create Alumni Event
 * @param {object} data - Event details
 * @param {string} schoolId
 * @returns {Promise<object>} Created event
 */
exports.createEvent = async (data, schoolId) => {
  const event = await AlumniEvent.create({
    ...data,
    schoolId
  });
  return event;
};

/**
 * Get Alumni Events
 * @param {string} schoolId
 * @param {object} filters - { eventType, status, page, limit }
 * @returns {Promise<object>} { events, total, pagination }
 */
exports.getEvents = async (schoolId, filters = {}) => {
  const { eventType, status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (eventType) query.eventType = eventType;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [events, total] = await Promise.all([
    AlumniEvent.find(query)
      .sort({ eventDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    AlumniEvent.countDocuments(query)
  ]);

  return { events, total, page: Number(page), limit: Number(limit) };
};

/**
 * Register for Alumni Event
 * @param {string} eventId
 * @param {string} schoolId
 * @param {object} registrationData - { alumniId }
 * @returns {Promise<object>} Updated event
 */
exports.registerForEvent = async (eventId, schoolId, registrationData) => {
  const event = await AlumniEvent.findOne({ _id: eventId, schoolId });
  if (!event) throw new AppError('Event not found', 404);

  // Check if already registered
  const alreadyRegistered = event.attendees.some(
    att => att.alumniId.toString() === registrationData.alumniId
  );
  if (alreadyRegistered) throw new AppError('Already registered for this event', 400);

  event.attendees.push({
    alumniId: registrationData.alumniId,
    registrationDate: new Date(),
    attendanceStatus: 'REGISTERED'
  });

  await event.save();
  return event;
};

/**
 * Record Donation
 * @param {object} data - Donation details
 * @param {string} schoolId
 * @returns {Promise<object>} Created donation record
 */
exports.recordDonation = async (data, schoolId) => {
  const donation = await AlumniDonation.create({
    ...data,
    schoolId
  });
  return donation;
};

/**
 * Get Donations
 * @param {string} schoolId
 * @param {object} filters - { alumniId, donationStatus, donationType, page, limit }
 * @returns {Promise<object>} { donations, total, pagination }
 */
exports.getDonations = async (schoolId, filters = {}) => {
  const { alumniId, donationStatus, donationType, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (alumniId) query.alumniId = alumniId;
  if (donationStatus) query.donationStatus = donationStatus;
  if (donationType) query.donationType = donationType;

  const skip = (page - 1) * limit;
  const [donations, total] = await Promise.all([
    AlumniDonation.find(query)
      .sort({ donationDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    AlumniDonation.countDocuments(query)
  ]);

  return { donations, total, page: Number(page), limit: Number(limit) };
};

/**
 * Post Job Opportunity
 * @param {object} data - Job details
 * @param {string} schoolId
 * @returns {Promise<object>} Created job posting
 */
exports.postJob = async (data, schoolId) => {
  const job = await AlumniJobPosting.create({
    ...data,
    schoolId
  });
  return job;
};

/**
 * Get Job Postings
 * @param {string} schoolId
 * @param {object} filters - { jobCategory, experienceLevel, status, page, limit }
 * @returns {Promise<object>} { jobs, total, pagination }
 */
exports.getJobPostings = async (schoolId, filters = {}) => {
  const { jobCategory, experienceLevel, status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (jobCategory) query.jobCategory = jobCategory;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    AlumniJobPosting.find(query)
      .sort({ postingDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    AlumniJobPosting.countDocuments(query)
  ]);

  return { jobs, total, page: Number(page), limit: Number(limit) };
};

/**
 * Create Mentorship Program
 * @param {object} data - Mentorship details
 * @param {string} schoolId
 * @returns {Promise<object>} Created mentorship record
 */
exports.createMentorship = async (data, schoolId) => {
  const mentorship = await AlumniMentor.create({
    ...data,
    schoolId
  });
  return mentorship;
};

/**
 * Get Mentorships
 * @param {string} schoolId
 * @param {object} filters - { alumniId, menteeId, status, page, limit }
 * @returns {Promise<object>} { mentorships, total, pagination }
 */
exports.getMentorships = async (schoolId, filters = {}) => {
  const { alumniId, menteeId, status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (alumniId) query.alumniId = alumniId;
  if (menteeId) query.menteeId = menteeId;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [mentorships, total] = await Promise.all([
    AlumniMentor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    AlumniMentor.countDocuments(query)
  ]);

  return { mentorships, total, page: Number(page), limit: Number(limit) };
};

/**
 * Get Alumni Statistics
 * @param {string} schoolId
 * @returns {Promise<object>} Statistics
 */
exports.getStatistics = async (schoolId) => {
  const [totalAlumni, activeAlumni, totalDonations, upcomingEvents] = await Promise.all([
    Alumni.countDocuments({ schoolId }),
    Alumni.countDocuments({ schoolId, status: 'ACTIVE' }),
    AlumniDonation.countDocuments({ schoolId }),
    AlumniEvent.countDocuments({ schoolId, status: { $in: ['PLANNING', 'REGISTRATION_OPEN'] } })
  ]);

  // Get total donation amount
  const donationAmount = await AlumniDonation.aggregate([
    { $match: { schoolId, donationStatus: 'RECEIVED' } },
    { $group: { _id: null, totalAmount: { $sum: '$donationAmount' } } }
  ]);

  // Get active mentorships
  const activeMentorships = await AlumniMentor.countDocuments({
    schoolId,
    status: 'ACTIVE'
  });

  // Get open job postings
  const openJobs = await AlumniJobPosting.countDocuments({
    schoolId,
    status: 'ACTIVE'
  });

  return {
    totalAlumni,
    activeAlumni,
    totalDonations,
    totalDonationAmount: donationAmount[0]?.totalAmount || 0,
    upcomingEvents,
    activeMentorships,
    openJobPostings: openJobs,
    timestamp: new Date()
  };
};

module.exports = exports;
      .lean(),
    Alumni.countDocuments(filterObj)
  ]);

  return { alumni, total };
};

/**
 * Get alumni by ID with full details
 * @param {string} schoolId
 * @param {string} alumniId
 * @returns {Promise<Object>} Alumni record with populated references
 */
exports.getAlumniById = async (schoolId, alumniId) => {
  const alumni = await Alumni.findOne({
    _id: alumniId,
    schoolId
  }).populate('studentId academicYear');

  if (!alumni) throw new AppError('Alumni not found', 404);

  return alumni;
};

/**
 * Update alumni record
 * @param {string} schoolId
 * @param {string} alumniId
 * @param {Object} updateData
 * @returns {Promise<Object>} Updated alumni record
 */
exports.updateAlumni = async (schoolId, alumniId, updateData) => {
  const alumni = await Alumni.findOneAndUpdate(
    { _id: alumniId, schoolId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!alumni) throw new AppError('Alumni not found', 404);

  return alumni;
};

/**
 * Delete alumni record
 * @param {string} schoolId
 * @param {string} alumniId
 * @returns {Promise<void>}
 */
exports.deleteAlumni = async (schoolId, alumniId) => {
  const alumni = await Alumni.findOneAndDelete({
    _id: alumniId,
    schoolId
  });

  if (!alumni) throw new AppError('Alumni not found', 404);
};

/**
 * Get alumni statistics
 * @param {string} schoolId
 * @returns {Promise<Object>} Statistics data
 */
exports.getAlumniStatistics = async (schoolId) => {
  const stats = await Alumni.aggregate([
    { $match: { schoolId: mongoose.Types.ObjectId(schoolId) } },
    {
      $facet: {
        totalAlumni: [{ $count: 'count' }],
        byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
        byCareerField: [{ $group: { _id: '$careerField', count: { $sum: 1 } } }],
        byGraduationYear: [{ $group: { _id: '$graduationYear', count: { $sum: 1 } } }],
        activeInNetwork: [
          { $match: { status: 'ACTIVE' } },
          { $count: 'count' }
        ]
      }
    }
  ]);

  return stats[0];
};

/**
 * Record a placement for alumni
 * @param {string} schoolId
 * @param {string} alumniId
 * @param {Object} placementData
 * @returns {Promise<Object>} Created placement record
 */
exports.recordPlacement = async (schoolId, alumniId, placementData) => {
  const alumni = await Alumni.findOne({ _id: alumniId, schoolId });
  if (!alumni) throw new AppError('Alumni not found', 404);

  const placement = await Placement.create({
    ...placementData,
    alumniId,
    schoolId
  });

  return placement;
};

/**
 * Get all placements for an alumni
 * @param {string} schoolId
 * @param {string} alumniId
 * @returns {Promise<Array>} Placements array
 */
exports.getAlumniPlacements = async (schoolId, alumniId) => {
  const placements = await Placement.find({
    alumniId,
    schoolId
  })
    .populate('alumniId', 'alumniCode currentCompany')
    .sort({ joiningDate: -1 })
    .lean();

  return placements;
};

/**
 * Register alumni for event
 * @param {string} schoolId
 * @param {string} alumniId
 * @param {string} eventId
 * @returns {Promise<Object>} Updated event
 */
exports.registerAlumniForEvent = async (schoolId, alumniId, eventId) => {
  const alumni = await Alumni.findOne({ _id: alumniId, schoolId });
  if (!alumni) throw new AppError('Alumni not found', 404);

  const event = await AlumniEvent.findOne({ _id: eventId, schoolId });
  if (!event) throw new AppError('Event not found', 404);

  // Check if already registered
  const alreadyRegistered = event.attendees.some((a) => a.alumni.toString() === alumniId);
  if (alreadyRegistered) throw new AppError('Alumni already registered for this event', 409);

  // Check capacity
  if (event.capacity && event.attendees.length >= event.capacity) {
    throw new AppError('Event capacity full', 409);
  }

  event.attendees.push({
    alumni: alumniId,
    registrationDate: new Date(),
    status: 'REGISTERED'
  });

  await event.save();
  return event;
};

/**
 * Create mentorship relationship
 * @param {string} schoolId
 * @param {Object} mentorshipData - { mentor, mentee, subject, goals, duration }
 * @returns {Promise<Object>} Created mentorship
 */
exports.createMentorship = async (schoolId, mentorshipData) => {
  const mentor = await Alumni.findOne({ _id: mentorshipData.mentor, schoolId });
  if (!mentor) throw new AppError('Mentor not found', 404);

  const mentorship = await Mentorship.create({
    ...mentorshipData,
    schoolId
  });

  return mentorship;
};

/**
 * Record mentorship session
 * @param {string} schoolId
 * @param {string} mentorshipId
 * @param {Object} sessionData
 * @returns {Promise<Object>} Updated mentorship
 */
exports.recordMentorshipSession = async (schoolId, mentorshipId, sessionData) => {
  const mentorship = await Mentorship.findOne({
    _id: mentorshipId,
    schoolId
  });

  if (!mentorship) throw new AppError('Mentorship not found', 404);

  const sessionNumber = (mentorship.sessions?.length || 0) + 1;
  mentorship.sessions.push({
    sessionNumber,
    ...sessionData,
    status: 'COMPLETED'
  });

  mentorship.sessionsCompleted = sessionNumber;
  mentorship.progressPercentage = (sessionNumber / (mentorship.totalSessionsPlanned || 10)) * 100;

  await mentorship.save();
  return mentorship;
};

/**
 * Process donation from alumni
 * @param {string} schoolId
 * @param {string} alumniId
 * @param {Object} donationData
 * @returns {Promise<Object>} Created donation
 */
exports.processDonation = async (schoolId, alumniId, donationData) => {
  const alumni = await Alumni.findOne({ _id: alumniId, schoolId });
  if (!alumni) throw new AppError('Alumni not found', 404);

  const donation = await Donation.create({
    ...donationData,
    alumniId,
    schoolId
  });

  // Update alumni engagement
  await Alumni.findByIdAndUpdate(alumniId, {
    $inc: { 'engagement.donationCount': 1 },
    $set: { 'engagement.lastEngagementDate': new Date() }
  });

  return donation;
};

/**
 * Get donation history for alumni
 * @param {string} schoolId
 * @param {string} alumniId
 * @returns {Promise<Array>} Donations array
 */
exports.getAlumniDonations = async (schoolId, alumniId) => {
  const donations = await Donation.find({
    alumniId,
    schoolId
  })
    .sort({ donationDate: -1 })
    .lean();

  return donations;
};

/**
 * Create networking connection between two alumni
 * @param {string} schoolId
 * @param {string} alumni1Id
 * @param {string} alumni2Id
 * @param {Object} connectionData
 * @returns {Promise<Object>} Created networking record
 */
exports.createNetworkingConnection = async (schoolId, alumni1Id, alumni2Id, connectionData) => {
  const alumni1 = await Alumni.findOne({ _id: alumni1Id, schoolId });
  const alumni2 = await Alumni.findOne({ _id: alumni2Id, schoolId });

  if (!alumni1 || !alumni2) throw new AppError('One or both alumni not found', 404);

  // Check if connection already exists
  const existing = await Networking.findOne({
    schoolId,
    $or: [
      { alumni1: alumni1Id, alumni2: alumni2Id },
      { alumni1: alumni2Id, alumni2: alumni1Id }
    ]
  });

  if (existing) throw new AppError('Connection already exists between these alumni', 409);

  const networking = await Networking.create({
    alumni1: alumni1Id,
    alumni2: alumni2Id,
    schoolId,
    ...connectionData
  });

  return networking;
};

/**
 * Get network of alumni (connections)
 * @param {string} schoolId
 * @param {string} alumniId
 * @returns {Promise<Array>} Network connections
 */
exports.getAlumniNetwork = async (schoolId, alumniId) => {
  const connections = await Networking.find({
    schoolId,
    $or: [{ alumni1: alumniId }, { alumni2: alumniId }]
  })
    .populate('alumni1', 'alumniCode currentCompany careerField')
    .populate('alumni2', 'alumniCode currentCompany careerField')
    .sort({ connectedDate: -1 })
    .lean();

  return connections;
};

/**
 * Get pending mentorship requests
 * @param {string} schoolId
 * @returns {Promise<Array>} Pending mentorships
 */
exports.getPendingMentorships = async (schoolId) => {
  const mentorships = await Mentorship.find({
    schoolId,
    status: 'ACTIVE'
  })
    .populate('mentor', 'alumniCode currentPosition')
    .populate('mentee', 'firstName lastName classId')
    .sort({ startDate: -1 })
    .lean();

  return mentorships;
};

/**
 * Get upcoming alumni events
 * @param {string} schoolId
 * @returns {Promise<Array>} Upcoming events
 */
exports.getUpcomingEvents = async (schoolId) => {
  const now = new Date();
  const events = await AlumniEvent.find({
    schoolId,
    eventDate: { $gte: now },
    status: { $in: ['PLANNING', 'REGISTRATION_OPEN'] }
  })
    .populate('organizer', 'firstName lastName')
    .sort({ eventDate: 1 })
    .limit(10)
    .lean();

  return events;
};

/**
 * Calculate alumni engagement score
 * @param {string} schoolId
 * @param {string} alumniId
 * @returns {Promise<number>} Engagement score
 */
exports.calculateEngagementScore = async (schoolId, alumniId) => {
  const alumni = await Alumni.findOne({ _id: alumniId, schoolId });
  if (!alumni) throw new AppError('Alumni not found', 404);

  let score = 0;

  // Event participation (25 points per event)
  score += alumni.engagement.eventAttendance * 25;

  // Donations (1 point per 1000 INR donated)
  const donations = await Donation.aggregate([
    { $match: { alumniId: mongoose.Types.ObjectId(alumniId), schoolId: mongoose.Types.ObjectId(schoolId) } },
    { $group: { _id: null, totalDonated: { $sum: '$donationAmount' } } }
  ]);

  if (donations.length > 0) {
    score += Math.floor(donations[0].totalDonated / 1000);
  }

  // Mentorship (50 points per mentorship completed)
  score += alumni.engagement.mentorshipCount * 50;

  // Referrals (30 points per referral)
  score += alumni.engagement.referralCount * 30;

  // Cap score at 500
  return Math.min(score, 500);
};

/**
 * Get alumni directory export
 * @param {string} schoolId
 * @returns {Promise<Array>} Alumni directory
 */
exports.getAlumniDirectory = async (schoolId) => {
  const alumni = await Alumni.find({
    schoolId,
    status: 'ACTIVE'
  })
    .select('alumniCode studentId currentCompany currentPosition careerField contactDetails')
    .populate('studentId', 'firstName lastName')
    .sort({ graduationYear: -1 })
    .lean();

  return alumni;
};

/**
 * Get alumni contributions report
 * @param {string} schoolId
 * @returns {Promise<Object>} Contributions report
 */
exports.getContributionsReport = async (schoolId) => {
  const report = await Donation.aggregate([
    { $match: { schoolId: mongoose.Types.ObjectId(schoolId), status: 'RECEIVED' } },
    {
      $facet: {
        totalDonations: [
          { $group: { _id: null, total: { $sum: '$donationAmount' }, count: { $sum: 1 } } }
        ],
        byPurpose: [{ $group: { _id: '$donationPurpose', total: { $sum: '$donationAmount' }, count: { $sum: 1 } } }],
        byYear: [
          {
            $group: {
              _id: { $year: '$donationDate' },
              total: { $sum: '$donationAmount' },
              count: { $sum: 1 }
            }
          }
        ],
        topDonors: [
          { $sort: { donationAmount: -1 } },
          { $limit: 10 },
          { $group: { _id: '$donorName', total: { $sum: '$donationAmount' }, count: { $sum: 1 } } }
        ]
      }
    }
  ]);

  return report[0];
};

module.exports = exports;

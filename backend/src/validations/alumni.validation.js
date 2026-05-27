const Joi = require('joi');

// Create Alumni Profile
exports.createAlumniSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().max(20),
  alternatePhone: Joi.string().max(20),
  dateOfBirth: Joi.date(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  currentAddress: Joi.object({
    street: Joi.string().max(200),
    city: Joi.string().max(50),
    state: Joi.string().max(50),
    postalCode: Joi.string().max(20),
    country: Joi.string().max(50)
  }),
  highestQualification: Joi.string().valid('HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER'),
  collegeName: Joi.string().max(200),
  graduationYear: Joi.number().integer().min(1900).max(2100),
  classYear: Joi.string().required(),
  currentCompany: Joi.string().max(200),
  currentDesignation: Joi.string().max(100),
  industry: Joi.string().valid('TECHNOLOGY', 'FINANCE', 'HEALTHCARE', 'EDUCATION', 'ENGINEERING', 'BUSINESS', 'GOVERNMENT', 'SELF_EMPLOYED', 'STUDENT', 'RETIRED', 'OTHER'),
  linkedInProfile: Joi.string(),
  bio: Joi.string().max(1000),
  interests: Joi.array().items(Joi.string()),
  socials: Joi.object({
    facebook: Joi.string(),
    twitter: Joi.string(),
    instagram: Joi.string(),
    youtube: Joi.string()
  })
});

// Create Alumni Event
exports.createEventSchema = Joi.object({
  eventName: Joi.string().min(5).max(200).required(),
  eventType: Joi.string().valid('REUNION', 'NETWORKING', 'WORKSHOP', 'SEMINAR', 'CAREER_TALK', 'FUNDRAISER', 'SPORTS', 'CULTURAL', 'OTHER').required(),
  description: Joi.string().max(1000),
  eventDate: Joi.date().required(),
  eventEndDate: Joi.date(),
  startTime: Joi.string(),
  endTime: Joi.string(),
  registrationStartDate: Joi.date(),
  registrationEndDate: Joi.date(),
  location: Joi.object({
    venue: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string()
  }),
  isVirtual: Joi.boolean(),
  virtualDetails: Joi.object({
    platform: Joi.string().valid('ZOOM', 'GOOGLE_MEET', 'MICROSOFT_TEAMS', 'OTHER'),
    meetingLink: Joi.string(),
    meetingId: Joi.string()
  }),
  capacity: Joi.number().integer().min(1),
  status: Joi.string().valid('PLANNING', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
});

// Record Donation
exports.recordDonationSchema = Joi.object({
  alumniId: Joi.string().hex().length(24).required(),
  donationDate: Joi.date(),
  donationAmount: Joi.number().min(0).required(),
  currency: Joi.string().valid('INR', 'USD', 'EUR', 'GBP'),
  donationType: Joi.string().valid('MONETARY', 'MATERIAL', 'SCHOLARSHIP', 'INFRASTRUCTURE', 'TECHNOLOGY', 'OTHER').required(),
  donationCategory: Joi.string().valid('ANNUAL_FUND', 'SCHOLARSHIP', 'INFRASTRUCTURE', 'RESEARCH', 'SPORTS', 'EVENTS', 'OTHER').required(),
  description: Joi.string().max(1000),
  paymentMethod: Joi.string().valid('CASH', 'CHEQUE', 'BANK_TRANSFER', 'ONLINE', 'CARD', 'CRYPTOCURRENCY', 'OTHER').required(),
  transactionId: Joi.string(),
  receiptNumber: Joi.string(),
  isRecurring: Joi.boolean(),
  recurringFrequency: Joi.string().valid('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'),
  anonymousDonation: Joi.boolean(),
  displayName: Joi.string().max(200)
});

// Post Job Opportunity
exports.postJobSchema = Joi.object({
  postedByAlumniId: Joi.string().hex().length(24).required(),
  jobTitle: Joi.string().min(5).max(200).required(),
  company: Joi.string().min(2).max(200).required(),
  jobDescription: Joi.string().min(20).max(5000).required(),
  requiredQualifications: Joi.array().items(Joi.string()),
  preferredQualifications: Joi.array().items(Joi.string()),
  experienceLevel: Joi.string().valid('FRESHER', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'MANAGER', 'EXECUTIVE').required(),
  yearsOfExperienceRequired: Joi.object({
    min: Joi.number().min(0),
    max: Joi.number().min(0)
  }),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'OTHER').required(),
  jobCategory: Joi.string().valid('TECHNOLOGY', 'FINANCE', 'HEALTHCARE', 'EDUCATION', 'ENGINEERING', 'SALES', 'MARKETING', 'HR', 'OPERATIONS', 'OTHER').required(),
  location: Joi.object({
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    isRemote: Joi.boolean()
  }),
  salaryRange: Joi.object({
    min: Joi.number(),
    max: Joi.number(),
    currency: Joi.string().valid('INR', 'USD', 'EUR', 'GBP'),
    isPublic: Joi.boolean()
  }),
  benefits: Joi.array().items(Joi.string()),
  skills: Joi.array().items(Joi.string()),
  applicationDeadline: Joi.date().required(),
  contactEmail: Joi.string().email(),
  contactPhone: Joi.string()
});

// Create Mentorship
exports.createMentorshipSchema = Joi.object({
  alumniId: Joi.string().hex().length(24).required(),
  menteeId: Joi.string().hex().length(24).required(),
  mentorshipType: Joi.string().valid('ACADEMIC', 'CAREER', 'PERSONAL', 'SKILL_DEVELOPMENT', 'PLACEMENT', 'ENTREPRENEURSHIP', 'OTHER').required(),
  focusAreas: Joi.array().items(Joi.string()),
  menteeGoals: Joi.string().max(1000),
  mentorshipDuration: Joi.string().valid('3_MONTHS', '6_MONTHS', '1_YEAR', '2_YEARS', 'ONGOING'),
  meetingFrequency: Joi.string().valid('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'AS_NEEDED').required(),
  preferredCommunicationMode: Joi.string().valid('EMAIL', 'PHONE', 'VIDEO_CALL', 'IN_PERSON', 'HYBRID').required()
});

// Register for Event
exports.registerForEventSchema = Joi.object({
  alumniId: Joi.string().hex().length(24).required()
});

// List Alumni
exports.listAlumniSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  classYear: Joi.string(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'DECEASED', 'UNVERIFIED'),
  industry: Joi.string()
});

// List Events
exports.listEventsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  eventType: Joi.string(),
  status: Joi.string().valid('PLANNING', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
});

// List Donations
exports.listDonationsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  alumniId: Joi.string().hex().length(24),
  donationStatus: Joi.string().valid('PENDING', 'RECEIVED', 'PROCESSED', 'ACKNOWLEDGED', 'CANCELLED'),
  donationType: Joi.string()
});

// List Job Postings
exports.listJobsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  jobCategory: Joi.string(),
  experienceLevel: Joi.string(),
  status: Joi.string().valid('ACTIVE', 'CLOSED', 'FILLED', 'EXPIRED')
});

// List Mentorships
exports.listMentorshipsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  alumniId: Joi.string().hex().length(24),
  menteeId: Joi.string().hex().length(24),
  status: Joi.string().valid('ACTIVE', 'ON_HOLD', 'COMPLETED', 'TERMINATED')
});

// Update Alumni Profile
exports.updateAlumniSchema = Joi.object({
  careerField: Joi.string()
    .valid(
      'ENGINEERING',
      'MEDICINE',
      'LAW',
      'BUSINESS',
      'EDUCATION',
      'ARTS',
      'SCIENCE',
      'TECHNOLOGY',
      'FINANCE',
      'HEALTHCARE',
      'GOVERNMENT',
      'SELF_EMPLOYED',
      'UNEMPLOYED',
      'FURTHER_STUDIES',
      'OTHER'
    ),
  currentCompany: Joi.string().trim().max(100),
  currentPosition: Joi.string().trim().max(100),
  designation: Joi.string().trim().max(100),
  yearsOfExperience: Joi.number().min(0),
  currentLocation: Joi.object({
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string()
  }),
  jobType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'SELF_EMPLOYED', 'UNEMPLOYED', 'NOT_SPECIFIED'),
  contactDetails: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\d{10}$/),
    alternatePhone: Joi.string().pattern(/^\d{10}$/),
    linkedInProfile: Joi.string().uri(),
    twitterHandle: Joi.string()
  }).min(1),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'LOST_CONTACT', 'DECEASED'),
  achievements: Joi.array().items(
    Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      awardedDate: Joi.date().iso(),
      category: Joi.string().valid('ACADEMIC', 'PROFESSIONAL', 'SOCIAL', 'SPORTS', 'ARTS', 'OTHER')
    })
  ),
  bio: Joi.string().max(500),
  profilePhoto: Joi.string().uri(),
  interests: Joi.array().items(
    Joi.string().valid(
      'MENTORING',
      'EVENT_PARTICIPATION',
      'FUNDRAISING',
      'NETWORKING',
      'SKILL_SHARING',
      'INTERNSHIP_PLACEMENT',
      'RECRUITMENT',
      'COMMUNITY_SERVICE'
    )
  )
}).min(1);


// Placement validation schemas
exports.recordPlacementSchema = Joi.object({
  placementYear: Joi.number().min(2000).required(),
  status: Joi.string()
    .valid('PLACED', 'NOT_PLACED', 'PURSUING_FURTHER_STUDIES', 'SELF_EMPLOYED', 'UNKNOWN')
    .required(),
  company: Joi.object({
    name: Joi.string().trim().required(),
    industry: Joi.string()
      .valid(
        'IT',
        'FINANCE',
        'HEALTHCARE',
        'EDUCATION',
        'MANUFACTURING',
        'RETAIL',
        'TELECOMMUNICATIONS',
        'ENERGY',
        'GOVERNMENT',
        'NGO',
        'STARTUP',
        'LOGISTICS',
        'REAL_ESTATE',
        'HOSPITALITY',
        'AGRICULTURE',
        'OTHER'
      ),
    location: Joi.object({
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string()
    })
  }).required(),
  position: Joi.string().trim().required(),
  jobType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'PROJECT_BASED'),
  salary: Joi.object({
    amount: Joi.number().min(0),
    currency: Joi.string().valid('INR', 'USD', 'EUR', 'GBP', 'OTHER'),
    frequency: Joi.string().valid('ANNUAL', 'MONTHLY', 'HOURLY')
  }),
  joiningDate: Joi.date().iso().required(),
  endDate: Joi.date().iso(),
  placementType: Joi.string().valid('ON_CAMPUS', 'OFF_CAMPUS', 'DIRECT_PLACEMENT', 'POOL_CAMPUS'),
  placementTypeDetails: Joi.string(),
  skillsUtilized: Joi.array().items(
    Joi.object({
      skill: Joi.string(),
      proficiency: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')
    })
  ),
  responsibilities: Joi.array().items(Joi.string()),
  referralContact: Joi.object({
    name: Joi.string(),
    designation: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\d{10}$/)
  })
}).required();

// Event registration schema
exports.registerEventSchema = Joi.object({
  eventId: Joi.string().hex().length(24).required()
}).required();

// Mentorship creation schema
exports.createMentorshipSchema = Joi.object({
  mentor: Joi.string().hex().length(24).required(),
  mentee: Joi.string().hex().length(24).required(),
  subject: Joi.string()
    .valid(
      'ACADEMIC',
      'CAREER_GUIDANCE',
      'PERSONAL_DEVELOPMENT',
      'PROFESSIONAL_SKILLS',
      'TECHNICAL_SKILLS',
      'SOFT_SKILLS',
      'ENTREPRENEURSHIP',
      'ENTRANCE_EXAM_PREPARATION',
      'INTERNSHIP_GUIDANCE',
      'PLACEMENT_PREPARATION',
      'HIGHER_EDUCATION',
      'LIFE_COACHING',
      'OTHER'
    )
    .required(),
  description: Joi.string().trim(),
  goals: Joi.array().items(
    Joi.object({
      goal: Joi.string(),
      description: Joi.string(),
      targetDate: Joi.date().iso()
    })
  ),
  startDate: Joi.date().iso().required(),
  expectedEndDate: Joi.date().iso(),
  duration: Joi.object({
    value: Joi.number().min(1),
    unit: Joi.string().valid('WEEKS', 'MONTHS', 'YEARS')
  }),
  sessionFrequency: Joi.string().valid('WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'AS_NEEDED'),
  sessionDuration: Joi.number().min(15),
  totalSessionsPlanned: Joi.number().min(1),
  communicationMode: Joi.string().valid('IN_PERSON', 'ONLINE', 'PHONE', 'EMAIL', 'MIXED')
}).required();

// Mentorship session recording schema
exports.recordSessionSchema = Joi.object({
  sessionDate: Joi.date().iso().required(),
  startTime: Joi.string(),
  endTime: Joi.string(),
  duration: Joi.number().min(0),
  mode: Joi.string().valid('IN_PERSON', 'ONLINE', 'PHONE', 'EMAIL').required(),
  meetingLink: Joi.string().uri(),
  location: Joi.string(),
  topicCovered: Joi.string(),
  notes: Joi.string(),
  mentorFeedback: Joi.string(),
  menteeFeedback: Joi.string(),
  attachments: Joi.array().items(Joi.string().uri())
}).required();

// Donation schema
exports.processDonationSchema = Joi.object({
  donorName: Joi.string().required(),
  donorEmail: Joi.string().email(),
  donorPhone: Joi.string().pattern(/^\d{10}$/),
  donationAmount: Joi.number().min(0).required(),
  currency: Joi.string().valid('INR', 'USD', 'EUR', 'GBP', 'OTHER'),
  donationType: Joi.string()
    .valid('CASH', 'CHECK', 'ONLINE', 'BANK_TRANSFER', 'CARD', 'CRYPTOCURRENCY', 'IN_KIND')
    .required(),
  paymentGateway: Joi.object({
    gatewayName: Joi.string(),
    transactionId: Joi.string(),
    transactionDate: Joi.date().iso()
  }),
  checkDetails: Joi.object({
    checkNumber: Joi.string(),
    bankName: Joi.string(),
    chequeDate: Joi.date().iso()
  }),
  donationPurpose: Joi.string()
    .valid(
      'SCHOLARSHIP',
      'INFRASTRUCTURE',
      'SPORTS',
      'LIBRARY',
      'LABORATORY',
      'TECHNOLOGY',
      'HEALTHCARE',
      'EVENTS',
      'RESEARCH',
      'GENERAL_FUND',
      'DISASTER_RELIEF',
      'STUDENT_WELFARE',
      'TEACHER_WELFARE',
      'OTHER'
    )
    .required(),
  purposeDescription: Joi.string(),
  isAnonymous: Joi.boolean(),
  allowPublicRecognition: Joi.boolean(),
  taxReceiptRequired: Joi.boolean(),
  isRecurringDonation: Joi.boolean(),
  recurringDetails: Joi.object({
    frequency: Joi.string().valid('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'),
    totalDonationsPlanned: Joi.number().min(1),
    endDate: Joi.date().iso()
  })
}).required();

// Networking connection schema
exports.createNetworkingSchema = Joi.object({
  alumni2Id: Joi.string().hex().length(24).required(),
  connectionType: Joi.string()
    .valid(
      'BATCH_MATE',
      'SAME_DEPARTMENT',
      'PROFESSIONAL_COLLEAGUE',
      'BUSINESS_PARTNER',
      'MENTOR_MENTEE',
      'FRIEND',
      'REFERENCE',
      'NETWORKING_EVENT',
      'MUTUAL_FRIEND',
      'OTHER'
    )
    .required(),
  connectionStrength: Joi.string().valid('WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG'),
  connectionSource: Joi.string()
    .valid(
      'ALUMNI_EVENT',
      'MENTORSHIP_PROGRAM',
      'SOCIAL_MEDIA',
      'PROFESSIONAL_NETWORK',
      'REFERRAL',
      'CASUAL_MEETING',
      'ONLINE_PLATFORM',
      'OTHER'
    ),
  connectionSourceDetails: Joi.string(),
  mutualInterests: Joi.array().items(
    Joi.object({
      category: Joi.string().valid('PROFESSIONAL', 'ACADEMIC', 'HOBBY', 'SOCIAL_SERVICE', 'SPORTS', 'ARTS', 'OTHER'),
      interest: Joi.string()
    })
  ),
  communicationPreferences: Joi.object({
    preferredChannel: Joi.string().valid('EMAIL', 'PHONE', 'VIDEO_CALL', 'IN_PERSON', 'SOCIAL_MEDIA', 'NO_PREFERENCE'),
    frequencyOfContact: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'AS_NEEDED'),
    bestTimeToContact: Joi.string()
  })
}).required();

// Alumni event schema
exports.createEventSchema = Joi.object({
  eventName: Joi.string().trim().required(),
  eventType: Joi.string()
    .valid(
      'REUNION',
      'NETWORKING',
      'WORKSHOP',
      'SEMINAR',
      'SKILL_DEVELOPMENT',
      'FUNDRAISER',
      'SPORTS',
      'CULTURAL',
      'ALUMNI_MEET',
      'MENTORSHIP_SESSION',
      'CAREER_TALK',
      'BATCH_REUNION',
      'SOCIAL_SERVICE',
      'OTHER'
    )
    .required(),
  description: Joi.string().trim(),
  eventDate: Joi.date().iso().required(),
  eventEndDate: Joi.date().iso(),
  startTime: Joi.string(),
  endTime: Joi.string(),
  registrationStartDate: Joi.date().iso(),
  registrationEndDate: Joi.date().iso(),
  location: Joi.object({
    venue: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string()
  }),
  isVirtual: Joi.boolean(),
  virtualEventDetails: Joi.object({
    platform: Joi.string().valid('ZOOM', 'GOOGLE_MEET', 'MICROSOFT_TEAMS', 'CUSTOM_PLATFORM', 'OTHER'),
    meetingLink: Joi.string().uri()
  }),
  capacity: Joi.number().min(1),
  expectedAttendees: Joi.number().min(0),
  isFree: Joi.boolean(),
  registrationFee: Joi.object({
    amount: Joi.number().min(0),
    currency: Joi.string().valid('INR', 'USD', 'EUR', 'GBP', 'OTHER')
  }),
  agenda: Joi.array().items(
    Joi.object({
      time: Joi.string(),
      activity: Joi.string(),
      duration: Joi.string()
    })
  ),
  speakers: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      designation: Joi.string(),
      organization: Joi.string(),
      bio: Joi.string()
    })
  ),
  budget: Joi.object({
    estimatedBudget: Joi.number().min(0),
    currency: Joi.string().valid('INR', 'USD', 'EUR', 'GBP', 'OTHER')
  })
}).required();

// Filters and search schemas
exports.alumniFiltersSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'LOST_CONTACT', 'DECEASED'),
  careerField: Joi.string(),
  graduationYear: Joi.number(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  search: Joi.string()
}).required();

exports.placementsFiltersSchema = Joi.object({
  status: Joi.string().valid('PLACED', 'NOT_PLACED', 'PURSUING_FURTHER_STUDIES', 'SELF_EMPLOYED', 'UNKNOWN'),
  placementYear: Joi.number(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100)
}).required();

module.exports = exports;

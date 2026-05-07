const Hostel = require('../models/hostel/Hostel.model');
const Room = require('../models/hostel/Room.model');
const StudentHostel = require('../models/hostel/StudentHostel.model');
const HostelFee = require('../models/hostel/HostelFee.model');
const HostelComplaint = require('../models/hostel/HostelComplaint.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create hostel
 * @param {object} data - Hostel details
 * @param {string} schoolId
 * @returns {Promise<object>} Created hostel
 */
exports.createHostel = async (data, schoolId) => {
  const hostel = await Hostel.create({
    ...data,
    schoolId
  });
  return hostel;
};

/**
 * Get all hostels
 * @param {string} schoolId
 * @param {object} filters - { hostelType, status, page, limit }
 * @returns {Promise<object>} { hostels, total, pagination }
 */
exports.getAllHostels = async (schoolId, filters = {}) => {
  const { hostelType, status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (hostelType) query.hostelType = hostelType;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [hostels, total] = await Promise.all([
    Hostel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Hostel.countDocuments(query)
  ]);

  return { hostels, total, page: Number(page), limit: Number(limit) };
};

/**
 * Get hostel by ID
 * @param {string} hostelId
 * @param {string} schoolId
 * @returns {Promise<object>} Hostel details
 */
exports.getHostelById = async (hostelId, schoolId) => {
  const hostel = await Hostel.findOne({ _id: hostelId, schoolId }).lean();
  if (!hostel) throw new AppError('Hostel not found', 404);
  return hostel;
};

/**
 * Update hostel
 * @param {string} hostelId
 * @param {object} data
 * @param {string} schoolId
 * @returns {Promise<object>} Updated hostel
 */
exports.updateHostel = async (hostelId, data, schoolId) => {
  const hostel = await Hostel.findOneAndUpdate(
    { _id: hostelId, schoolId },
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
  if (!hostel) throw new AppError('Hostel not found', 404);
  return hostel;
};

/**
 * Add room to hostel
 * @param {object} data - Room details
 * @param {string} schoolId
 * @returns {Promise<object>} Created room
 */
exports.addRoom = async (data, schoolId) => {
  const hostel = await Hostel.findOne({ _id: data.hostelId, schoolId });
  if (!hostel) throw new AppError('Hostel not found', 404);

  const room = await Room.create({
    ...data,
    schoolId,
    hostelName: hostel.hostelName
  });

  // Update hostel capacity
  await Hostel.findByIdAndUpdate(
    hostel._id,
    { $inc: { totalRooms: 1, totalCapacity: data.capacity } }
  );

  return room;
};

/**
 * Get rooms
 * @param {string} schoolId
 * @param {object} filters - { hostelId, roomType, status, page, limit }
 * @returns {Promise<object>} { rooms, total, pagination }
 */
exports.getRooms = async (schoolId, filters = {}) => {
  const { hostelId, roomType, status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (hostelId) query.hostelId = hostelId;
  if (roomType) query.roomType = roomType;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [rooms, total] = await Promise.all([
    Room.find(query)
      .sort({ floor: 1, roomNumber: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Room.countDocuments(query)
  ]);

  return { rooms, total, page: Number(page), limit: Number(limit) };
};

/**
 * Allocate student to room
 * @param {object} data - Allocation details
 * @param {string} schoolId
 * @returns {Promise<object>} Created allocation
 */
exports.allocateStudent = async (data, schoolId) => {
  const room = await Room.findOne({ _id: data.roomId, schoolId });
  if (!room) throw new AppError('Room not found', 404);

  if (room.currentOccupancy >= room.capacity) {
    throw new AppError('Room is at full capacity', 400);
  }

  const allocation = await StudentHostel.create({
    ...data,
    schoolId
  });

  // Update room occupancy
  await Room.findByIdAndUpdate(
    room._id,
    { $inc: { currentOccupancy: 1, occupiedBeds: 1 } }
  );

  // Update hostel occupancy
  const hostel = await Hostel.findById(room.hostelId);
  await Hostel.findByIdAndUpdate(
    hostel._id,
    { $inc: { currentOccupancy: 1 } }
  );

  return allocation;
};

/**
 * Get student allocations
 * @param {string} schoolId
 * @param {object} filters - { hostelId, allocationStatus, academicYear, page, limit }
 * @returns {Promise<object>} { allocations, total, pagination }
 */
exports.getAllocations = async (schoolId, filters = {}) => {
  const { hostelId, allocationStatus, academicYear, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (hostelId) query.hostelId = hostelId;
  if (allocationStatus) query.allocationStatus = allocationStatus;
  if (academicYear) query.academicYear = academicYear;

  const skip = (page - 1) * limit;
  const [allocations, total] = await Promise.all([
    StudentHostel.find(query)
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    StudentHostel.countDocuments(query)
  ]);

  return { allocations, total, page: Number(page), limit: Number(limit) };
};

/**
 * Record hostel fee
 * @param {object} data - Fee details
 * @param {string} schoolId
 * @returns {Promise<object>} Created fee record
 */
exports.recordFee = async (data, schoolId) => {
  const fee = await HostelFee.create({
    ...data,
    schoolId
  });
  return fee;
};

/**
 * Get hostel fees
 * @param {string} schoolId
 * @param {object} filters - { studentId, paymentStatus, feeType, page, limit }
 * @returns {Promise<object>} { fees, total, pagination }
 */
exports.getFees = async (schoolId, filters = {}) => {
  const { studentId, paymentStatus, feeType, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (studentId) query.studentId = studentId;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (feeType) query.feeType = feeType;

  const skip = (page - 1) * limit;
  const [fees, total] = await Promise.all([
    HostelFee.find(query)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    HostelFee.countDocuments(query)
  ]);

  return { fees, total, page: Number(page), limit: Number(limit) };
};

/**
 * File complaint
 * @param {object} data - Complaint details
 * @param {string} schoolId
 * @returns {Promise<object>} Created complaint
 */
exports.fileComplaint = async (data, schoolId) => {
  const complaint = await HostelComplaint.create({
    ...data,
    schoolId
  });
  return complaint;
};

/**
 * Get complaints
 * @param {string} schoolId
 * @param {object} filters - { complaintStatus, priority, studentId, page, limit }
 * @returns {Promise<object>} { complaints, total, pagination }
 */
exports.getComplaints = async (schoolId, filters = {}) => {
  const { complaintStatus, priority, studentId, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (complaintStatus) query.complaintStatus = complaintStatus;
  if (priority) query.priority = priority;
  if (studentId) query.studentId = studentId;

  const skip = (page - 1) * limit;
  const [complaints, total] = await Promise.all([
    HostelComplaint.find(query)
      .sort({ complaintDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    HostelComplaint.countDocuments(query)
  ]);

  return { complaints, total, page: Number(page), limit: Number(limit) };
};

/**
 * Update complaint status
 * @param {string} complaintId
 * @param {string} schoolId
 * @param {object} updateData
 * @returns {Promise<object>} Updated complaint
 */
exports.updateComplaintStatus = async (complaintId, schoolId, updateData) => {
  const complaint = await HostelComplaint.findOneAndUpdate(
    { _id: complaintId, schoolId },
    {
      ...updateData,
      $push: {
        auditLog: {
          action: 'STATUS_UPDATE',
          performedBy: updateData.performedBy,
          timestamp: new Date()
        }
      }
    },
    { new: true }
  );
  if (!complaint) throw new AppError('Complaint not found', 404);
  return complaint;
};

/**
 * Get hostel statistics
 * @param {string} schoolId
 * @returns {Promise<object>} Statistics
 */
exports.getStatistics = async (schoolId) => {
  const [totalHostels, activeAllocations, pendingFees, openComplaints] = await Promise.all([
    Hostel.countDocuments({ schoolId, status: 'ACTIVE' }),
    StudentHostel.countDocuments({ schoolId, allocationStatus: 'ACTIVE' }),
    HostelFee.countDocuments({ schoolId, paymentStatus: 'PENDING' }),
    HostelComplaint.countDocuments({ schoolId, complaintStatus: { $in: ['OPEN', 'IN_PROGRESS'] } })
  ]);

  // Get total rooms and occupancy
  const roomStats = await Hostel.aggregate([
    { $match: { schoolId, status: 'ACTIVE' } },
    { $group: { _id: null, totalRooms: { $sum: '$totalRooms' }, totalCapacity: { $sum: '$totalCapacity' }, totalOccupancy: { $sum: '$currentOccupancy' } } }
  ]);

  // Get pending fee amount
  const feeAmount = await HostelFee.aggregate([
    { $match: { schoolId, paymentStatus: 'PENDING' } },
    { $group: { _id: null, totalAmount: { $sum: '$totalAmount' } } }
  ]);

  return {
    totalHostels,
    activeAllocations,
    pendingFees,
    openComplaints,
    roomStats: roomStats[0] || {},
    pendingFeeAmount: feeAmount[0]?.totalAmount || 0,
    timestamp: new Date()
  };
};

module.exports = exports;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get rooms with filters
   */
  static async getRooms(schoolId, filters = {}) {
    try {
      const { page = 1, limit = 10, hostel, status, type } = filters;

      const query = { schoolId };

      if (hostel) query.hostel = hostel;
      if (status) query.status = status;
      if (type) query.type = type;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { floor: 1, roomNumber: 1 },
        populate: [
          { path: 'hostel', select: 'hostelName hostelCode type' }
        ]
      };

      const result = await Room.paginate(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Assign student to hostel
   */
  static async assignStudentHostel(schoolId, hostelData, userId) {
    try {
      // Check if student already has hostel assignment for this academic year
      const existingAssignment = await StudentHostel.findOne({
        schoolId,
        student: hostelData.student,
        academicYear: hostelData.academicYear
      });

      if (existingAssignment) {
        throw new AppError('Student already has hostel assignment for this academic year', 400);
      }

      // Check room availability
      const room = await Room.findById(hostelData.room);
      if (!room || room.status !== 'AVAILABLE' || room.currentOccupancy >= room.capacity) {
        throw new AppError('Room is not available or at full capacity', 400);
      }

      const studentHostel = new StudentHostel({
        ...hostelData,
        schoolId,
        addedBy: userId,
      });

      await studentHostel.save();

      // Update room occupancy
      await Room.findByIdAndUpdate(hostelData.room, {
        $inc: { currentOccupancy: 1 },
        status: room.currentOccupancy + 1 >= room.capacity ? 'OCCUPIED' : 'AVAILABLE'
      });

      // Update hostel occupancy
      await Hostel.findByIdAndUpdate(hostelData.hostel, { $inc: { currentOccupancy: 1 } });

      return await StudentHostel.findById(studentHostel._id)
        .populate('student', 'name admissionNumber')
        .populate('hostel', 'hostelName hostelCode')
        .populate('room', 'roomNumber floor');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get student hostel assignments
   */
  static async getStudentHostels(schoolId, filters = {}) {
    try {
      const { page = 1, limit = 10, student, hostel, room, status, academicYear } = filters;

      const query = { schoolId };

      if (student) query.student = student;
      if (hostel) query.hostel = hostel;
      if (room) query.room = room;
      if (status) query.status = status;
      if (academicYear) query.academicYear = academicYear;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { admissionDate: -1 },
        populate: [
          { path: 'student', select: 'name admissionNumber class' },
          { path: 'hostel', select: 'hostelName hostelCode type' },
          { path: 'room', select: 'roomNumber floor type' }
        ]
      };

      const result = await StudentHostel.paginate(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get hostel statistics
   */
  static async getHostelStats(schoolId) {
    try {
      const [
        totalHostels,
        activeHostels,
        totalRooms,
        availableRooms,
        totalStudents,
        activeStudents
      ] = await Promise.all([
        Hostel.countDocuments({ schoolId }),
        Hostel.countDocuments({ schoolId, status: 'ACTIVE' }),
        Room.countDocuments({ schoolId }),
        Room.countDocuments({ schoolId, status: 'AVAILABLE' }),
        StudentHostel.countDocuments({ schoolId }),
        StudentHostel.countDocuments({ schoolId, status: 'ACTIVE' })
      ]);

      return {
        hostels: { total: totalHostels, active: activeHostels },
        rooms: { total: totalRooms, available: availableRooms },
        students: { total: totalStudents, active: activeStudents }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HostelService;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get rooms with filters
   */
  static async getRooms(schoolId, filters = {}) {
    try {
      const { page = 1, limit = 10, hostel, status, type } = filters;

      const query = { schoolId };

      if (hostel) query.hostel = hostel;
      if (status) query.status = status;
      if (type) query.type = type;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { floor: 1, roomNumber: 1 },
        populate: [
          { path: 'hostel', select: 'hostelName hostelCode type' }
        ]
      };

      const result = await Room.paginate(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Assign student to hostel
   */
  static async assignStudentHostel(schoolId, hostelData, userId) {
    try {
      // Check if student already has hostel assignment for this academic year
      const existingAssignment = await StudentHostel.findOne({
        schoolId,
        student: hostelData.student,
        academicYear: hostelData.academicYear
      });

      if (existingAssignment) {
        throw new AppError('Student already has hostel assignment for this academic year', 400);
      }

      // Check room availability
      const room = await Room.findById(hostelData.room);
      if (!room || room.status !== 'AVAILABLE' || room.currentOccupancy >= room.capacity) {
        throw new AppError('Room is not available or at full capacity', 400);
      }

      const studentHostel = new StudentHostel({
        ...hostelData,
        schoolId,
        addedBy: userId,
      });

      await studentHostel.save();

      // Update room occupancy
      await Room.findByIdAndUpdate(hostelData.room, {
        $inc: { currentOccupancy: 1 },
        status: room.currentOccupancy + 1 >= room.capacity ? 'OCCUPIED' : 'AVAILABLE'
      });

      // Update hostel occupancy
      await Hostel.findByIdAndUpdate(hostelData.hostel, { $inc: { currentOccupancy: 1 } });

      return await StudentHostel.findById(studentHostel._id)
        .populate('student', 'name admissionNumber')
        .populate('hostel', 'hostelName hostelCode')
        .populate('room', 'roomNumber floor');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get student hostel assignments
   */
  static async getStudentHostels(schoolId, filters = {}) {
    try {
      const { page = 1, limit = 10, student, hostel, room, status, academicYear } = filters;

      const query = { schoolId };

      if (student) query.student = student;
      if (hostel) query.hostel = hostel;
      if (room) query.room = room;
      if (status) query.status = status;
      if (academicYear) query.academicYear = academicYear;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { admissionDate: -1 },
        populate: [
          { path: 'student', select: 'name admissionNumber class' },
          { path: 'hostel', select: 'hostelName hostelCode type' },
          { path: 'room', select: 'roomNumber floor type' }
        ]
      };

      const result = await StudentHostel.paginate(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get hostel statistics
   */
  static async getHostelStats(schoolId) {
    try {
      const [
        totalHostels,
        activeHostels,
        totalRooms,
        availableRooms,
        totalStudents,
        activeStudents
      ] = await Promise.all([
        Hostel.countDocuments({ schoolId }),
        Hostel.countDocuments({ schoolId, status: 'ACTIVE' }),
        Room.countDocuments({ schoolId }),
        Room.countDocuments({ schoolId, status: 'AVAILABLE' }),
        StudentHostel.countDocuments({ schoolId }),
        StudentHostel.countDocuments({ schoolId, status: 'ACTIVE' })
      ]);

      return {
        hostels: { total: totalHostels, active: activeHostels },
        rooms: { total: totalRooms, available: availableRooms },
        students: { total: totalStudents, active: activeStudents }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HostelService;

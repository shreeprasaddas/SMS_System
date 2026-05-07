const Route = require('../models/transport/Route.model');
const Bus = require('../models/transport/Bus.model');
const Driver = require('../models/transport/Driver.model');
const StudentTransport = require('../models/transport/StudentTransport.model');
const TransportLog = require('../models/transport/TransportLog.model');
const { AppError } = require('../utils/errorHelper');

/**
 * Create a new transport route
 * @param {object} data - Route details
 * @param {string} schoolId - School ID for multi-tenancy
 * @returns {Promise<object>} Created route
 */
exports.createRoute = async (data, schoolId) => {
  const route = await Route.create({
    ...data,
    schoolId
  });
  return route;
};

/**
 * Get all routes for a school with filters
 * @param {string} schoolId
 * @param {object} filters - { status, routeType, page, limit }
 * @returns {Promise<object>} { routes, total, pagination }
 */
exports.getAllRoutes = async (schoolId, filters = {}) => {
  const { status, routeType, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (status) query.status = status;
  if (routeType) query.routeType = routeType;

  const skip = (page - 1) * limit;
  const [routes, total] = await Promise.all([
    Route.find(query)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Route.countDocuments(query)
  ]);

  return { routes, total, page: Number(page), limit: Number(limit) };
};

/**
 * Get route by ID
 * @param {string} routeId
 * @param {string} schoolId
 * @returns {Promise<object>} Route details
 */
exports.getRouteById = async (routeId, schoolId) => {
  const route = await Route.findOne({ _id: routeId, schoolId }).lean();
  if (!route) throw new AppError('Route not found', 404);
  return route;
};

/**
 * Update route details
 * @param {string} routeId
 * @param {object} data
 * @param {string} schoolId
 * @returns {Promise<object>} Updated route
 */
exports.updateRoute = async (routeId, data, schoolId) => {
  const route = await Route.findOneAndUpdate(
    { _id: routeId, schoolId },
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
  if (!route) throw new AppError('Route not found', 404);
  return route;
};

/**
 * Register a new bus
 * @param {object} data - Bus details
 * @param {string} schoolId
 * @returns {Promise<object>} Created bus
 */
exports.registerBus = async (data, schoolId) => {
  const existingBus = await Bus.findOne({
    schoolId,
    $or: [
      { busNumber: data.busNumber },
      { registrationNumber: data.registrationNumber }
    ]
  });

  if (existingBus) {
    throw new AppError('Bus number or registration already exists', 400);
  }

  const bus = await Bus.create({
    ...data,
    schoolId
  });
  return bus;
};

/**
 * Get all buses for a school
 * @param {string} schoolId
 * @param {object} filters - { status, page, limit }
 * @returns {Promise<object>} { buses, total, pagination }
 */
exports.getAllBuses = async (schoolId, filters = {}) => {
  const { status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [buses, total] = await Promise.all([
    Bus.find(query)
      .populate('driverId', 'firstName lastName email')
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Bus.countDocuments(query)
  ]);

  return { buses, total, page: Number(page), limit: Number(limit) };
};

/**
 * Get bus by ID
 * @param {string} busId
 * @param {string} schoolId
 * @returns {Promise<object>} Bus details
 */
exports.getBusById = async (busId, schoolId) => {
  const bus = await Bus.findOne({ _id: busId, schoolId })
    .populate('driverId', 'firstName lastName email')
    .populate('routeId', 'routeName')
    .lean();
  if (!bus) throw new AppError('Bus not found', 404);
  return bus;
};

/**
 * Update bus details
 * @param {string} busId
 * @param {object} data
 * @param {string} schoolId
 * @returns {Promise<object>} Updated bus
 */
exports.updateBus = async (busId, data, schoolId) => {
  const bus = await Bus.findOneAndUpdate(
    { _id: busId, schoolId },
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
  if (!bus) throw new AppError('Bus not found', 404);
  return bus;
};

/**
 * Register a driver
 * @param {object} data - Driver details
 * @param {string} schoolId
 * @returns {Promise<object>} Created driver
 */
exports.registerDriver = async (data, schoolId) => {
  const existingDriver = await Driver.findOne({
    schoolId,
    licenseNumber: data.licenseNumber
  });

  if (existingDriver) {
    throw new AppError('License number already exists', 400);
  }

  const driver = await Driver.create({
    ...data,
    schoolId
  });
  return driver;
};

/**
 * Get all drivers for a school
 * @param {string} schoolId
 * @param {object} filters - { status, page, limit }
 * @returns {Promise<object>} { drivers, total, pagination }
 */
exports.getAllDrivers = async (schoolId, filters = {}) => {
  const { status, page = 1, limit = 20 } = filters;
  const query = { schoolId };
  
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [drivers, total] = await Promise.all([
    Driver.find(query)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Driver.countDocuments(query)
  ]);

  return { drivers, total, page: Number(page), limit: Number(limit) };
};

/**
 * Assign student to route
 * @param {string} studentId
 * @param {object} data - Assignment details (routeId, busId, etc.)
 * @param {string} schoolId
 * @returns {Promise<object>} Created assignment
 */
exports.assignStudentToRoute = async (studentId, data, schoolId) => {
  const allocation = await StudentTransport.create({
    studentId,
    ...data,
    schoolId
  });
  return allocation;
};

/**
 * Get student's transport allocation
 * @param {string} studentId
 * @param {string} schoolId
 * @returns {Promise<object>} Transport allocation
 */
exports.getStudentTransportAllocation = async (studentId, schoolId) => {
  const allocation = await StudentTransport.findOne({ 
    studentId, 
    schoolId,
    allocationStatus: 'ACTIVE'
  })
    .populate('routeId', 'routeName pickupTime dropoffTime')
    .populate('busId', 'busNumber capacity')
    .lean();
  if (!allocation) throw new AppError('Transport allocation not found', 404);
  return allocation;
};

/**
 * Get all transport allocations for a route
 * @param {string} routeId
 * @param {string} schoolId
 * @returns {Promise<Array>} Allocations on this route
 */
exports.getRouteAllocations = async (routeId, schoolId) => {
  const allocations = await StudentTransport.find({
    routeId,
    schoolId,
    allocationStatus: 'ACTIVE'
  })
    .populate('studentId', 'firstName lastName rollNumber')
    .lean();
  return allocations;
};

/**
 * Add transport attendance record
 * @param {object} data - Attendance details
 * @param {string} schoolId
 * @returns {Promise<object>} Created log
 */
exports.addTransportAttendance = async (data, schoolId) => {
  const log = await TransportLog.create({
    ...data,
    schoolId
  });
  return log;
};

/**
 * Get transport logs for a bus
 * @param {string} busId
 * @param {string} schoolId
 * @param {object} filters - { startDate, endDate, page, limit }
 * @returns {Promise<object>} { logs, total, pagination }
 */
exports.getBusTransportLogs = async (busId, schoolId, filters = {}) => {
  const { startDate, endDate, page = 1, limit = 20 } = filters;
  const query = { busId, schoolId };

  if (startDate || endDate) {
    query.logDate = {};
    if (startDate) query.logDate.$gte = new Date(startDate);
    if (endDate) query.logDate.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    TransportLog.find(query)
      .sort({ logDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    TransportLog.countDocuments(query)
  ]);

  return { logs, total, page: Number(page), limit: Number(limit) };
};

/**
 * Collect transport fee for a student
 * @param {string} studentId
 * @param {number} amount
 * @param {string} schoolId
 * @returns {Promise<object>} Updated allocation
 */
exports.collectTransportFee = async (studentId, amount, schoolId) => {
  const allocation = await StudentTransport.findOneAndUpdate(
    { studentId, schoolId, allocationStatus: 'ACTIVE' },
    { 
      feePaymentStatus: 'PAID',
      $push: {
        auditLog: {
          action: 'FEE_COLLECTED',
          performedBy: null,
          timestamp: new Date(),
          changes: { amount }
        }
      }
    },
    { new: true }
  );
  if (!allocation) throw new AppError('Transport allocation not found', 404);
  return allocation;
};

/**
 * Get transport statistics for school
 * @param {string} schoolId
 * @returns {Promise<object>} Statistics
 */
exports.getTransportStatistics = async (schoolId) => {
  const [totalRoutes, totalBuses, totalDrivers, totalAllocations] = await Promise.all([
    Route.countDocuments({ schoolId, status: 'ACTIVE' }),
    Bus.countDocuments({ schoolId, status: 'ACTIVE' }),
    Driver.countDocuments({ schoolId, status: 'ACTIVE' }),
    StudentTransport.countDocuments({ schoolId, allocationStatus: 'ACTIVE' })
  ]);

  return {
    totalRoutes,
    totalBuses,
    totalDrivers,
    totalStudentsAllocated: totalAllocations,
    timestamp: new Date()
  };
};

/**
 * Deactivate driver
 * @param {string} driverId
 * @param {string} schoolId
 * @param {object} reason
 * @returns {Promise<object>} Updated driver
 */
exports.deactivateDriver = async (driverId, schoolId, reason) => {
  const driver = await Driver.findOneAndUpdate(
    { _id: driverId, schoolId },
    {
      status: 'INACTIVE',
      $push: {
        auditLog: {
          action: 'DEACTIVATE',
          performedBy: null,
          timestamp: new Date(),
          changes: { reason }
        }
      }
    },
    { new: true }
  );
  if (!driver) throw new AppError('Driver not found', 404);
  return driver;
};

/**
 * Deactivate route
 * @param {string} routeId
 * @param {string} schoolId
 * @returns {Promise<object>} Updated route
 */
exports.deactivateRoute = async (routeId, schoolId) => {
  const route = await Route.findOneAndUpdate(
    { _id: routeId, schoolId },
    {
      status: 'INACTIVE',
      $push: {
        auditLog: {
          action: 'DEACTIVATE',
          performedBy: null,
          timestamp: new Date()
        }
      }
    },
    { new: true }
  );
  if (!route) throw new AppError('Route not found', 404);
  return route;
};

module.exports = exports;
        schoolId,
        student: transportData.student,
        academicYear: transportData.academicYear
      });

      if (existingTransport) {
        throw new AppError('Student already has transport assigned for this academic year', 400);
      }

      const studentTransport = new StudentTransport({
        ...transportData,
        schoolId,
        addedBy: userId,
      });

      await studentTransport.save();

      // Update route and bus occupancy
      await Route.findByIdAndUpdate(transportData.route, { $inc: { totalStudents: 1 } });
      await Bus.findByIdAndUpdate(transportData.bus, { $inc: { currentOccupancy: 1 } });

      return await StudentTransport.findById(studentTransport._id)
        .populate('student', 'name admissionNumber')
        .populate('route', 'routeName routeNumber')
        .populate('bus', 'busNumber');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get transport statistics
   */
  static async getTransportStats(schoolId) {
    try {
      const [
        totalBuses,
        activeBuses,
        totalDrivers,
        activeDrivers,
        totalRoutes,
        activeRoutes,
        totalStudents,
        activeStudents
      ] = await Promise.all([
        Bus.countDocuments({ schoolId }),
        Bus.countDocuments({ schoolId, status: 'ACTIVE' }),
        Driver.countDocuments({ schoolId }),
        Driver.countDocuments({ schoolId, status: 'ACTIVE' }),
        Route.countDocuments({ schoolId }),
        Route.countDocuments({ schoolId, status: 'ACTIVE' }),
        StudentTransport.countDocuments({ schoolId }),
        StudentTransport.countDocuments({ schoolId, status: 'ACTIVE' })
      ]);

      return {
        buses: { total: totalBuses, active: activeBuses },
        drivers: { total: totalDrivers, active: activeDrivers },
        routes: { total: totalRoutes, active: activeRoutes },
        students: { total: totalStudents, active: activeStudents }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TransportService;

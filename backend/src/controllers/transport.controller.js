/**
 * Transport Controller
 * Route, bus, driver management and vehicle assignments
 */

const Route = require('../models/transport/Route.model');
const Bus = require('../models/transport/Bus.model');
const Driver = require('../models/transport/Driver.model');
const StudentTransport = require('../models/transport/StudentTransport.model');
const responseHelper = require('../utils/responseHelper');
const { AppError, ValidationError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

class TransportController {
  /**
   * Create transport route
   */
  static async createRoute(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { routeName, routeNumber, startPoint, endPoint, stops, distance, capacity, fee } = req.body;

      if (!routeName || !routeNumber) {
        throw new ValidationError('Route name and number are required');
      }

      const route = new Route({
        schoolId,
        routeName,
        routeNumber,
        startPoint,
        endPoint,
        stops,
        distance,
        capacity,
        fee,
        createdBy: req.user.userId,
        status: 'ACTIVE'
      });

      await route.save();

      return responseHelper.created(res, route, 'Transport route created successfully');
    } catch (error) {
      logger.error('Error creating route', error);
      next(error);
    }
  }

  /**
   * Get routes
   */
  static async getRoutes(req, res, next) {
    try {
      const { page = 1, limit = 12, search = '', status = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { routeName: { $regex: search, $options: 'i' } },
          { routeNumber: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Route.countDocuments(filter);
      const routes = await Route.find(filter)
        .populate('driverId', 'firstName lastName phoneNumber')
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, routes, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching routes', error);
      next(error);
    }
  }

  /**
   * Update route
   */
  static async updateRoute(req, res, next) {
    try {
      const { routeId } = req.params;
      const schoolId = req.user.schoolId;
      const updateData = req.body;

      const route = await Route.findOneAndUpdate(
        { _id: routeId, schoolId },
        updateData,
        { new: true }
      );

      if (!route) throw new AppError('Route not found', 404);

      return responseHelper.success(res, route, 'Route updated successfully');
    } catch (error) {
      logger.error('Error updating route', error);
      next(error);
    }
  }

  /**
   * Delete route
   */
  static async deleteRoute(req, res, next) {
    try {
      const { routeId } = req.params;
      const schoolId = req.user.schoolId;

      const route = await Route.findOneAndDelete({ _id: routeId, schoolId });

      if (!route) throw new AppError('Route not found', 404);

      return responseHelper.noContent(res, 'Route deleted successfully');
    } catch (error) {
      logger.error('Error deleting route', error);
      next(error);
    }
  }

  /**
   * Create bus
   */
  static async createBus(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { busNumber, registrationNumber, model, manufacturer, yearOfManufacture, capacity, fuelType } = req.body;

      if (!busNumber || !registrationNumber) {
        throw new ValidationError('Bus number and registration number are required');
      }

      const bus = new Bus({
        schoolId,
        busNumber,
        registrationNumber,
        model,
        manufacturer,
        yearOfManufacture,
        capacity,
        fuelType,
        createdBy: req.user.userId,
        status: 'ACTIVE'
      });

      await bus.save();

      return responseHelper.created(res, bus, 'Bus created successfully');
    } catch (error) {
      logger.error('Error creating bus', error);
      next(error);
    }
  }

  /**
   * Get buses
   */
  static async getBuses(req, res, next) {
    try {
      const { page = 1, limit = 12, status = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Bus.countDocuments(filter);
      const buses = await Bus.find(filter)
        .populate('driverId', 'firstName lastName phoneNumber')
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, buses, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching buses', error);
      next(error);
    }
  }

  /**
   * Assign driver to bus
   */
  static async assignDriver(req, res, next) {
    try {
      const { busId } = req.params;
      const { driverId } = req.body;
      const schoolId = req.user.schoolId;

      if (!driverId) throw new ValidationError('Driver ID is required');

      const bus = await Bus.findOneAndUpdate(
        { _id: busId, schoolId },
        { driverId },
        { new: true }
      ).populate('driverId', 'firstName lastName phoneNumber');

      if (!bus) throw new AppError('Bus not found', 404);

      return responseHelper.success(res, bus, 'Driver assigned successfully');
    } catch (error) {
      logger.error('Error assigning driver', error);
      next(error);
    }
  }

  /**
   * Assign student to route
   */
  static async assignStudentToRoute(req, res, next) {
    try {
      const schoolId = req.user.schoolId;
      const { student, route, pickupPoint, dropPoint, academicYear } = req.body;

      if (!student || !route) {
        throw new ValidationError('Student and route are required');
      }

      const assignment = new StudentTransport({
        schoolId,
        student,
        route,
        pickupPoint,
        dropPoint,
        academicYear,
        status: 'ACTIVE'
      });

      await assignment.save();

      return responseHelper.created(res, assignment, 'Student assigned to route successfully');
    } catch (error) {
      logger.error('Error assigning student', error);
      next(error);
    }
  }

  /**
   * Get student transport assignments
   */
  static async getStudentTransports(req, res, next) {
    try {
      const { page = 1, limit = 12, student = '', route = '', status = '' } = req.query;
      const schoolId = req.user.schoolId;

      const filter = { schoolId };
      if (student) filter.student = student;
      if (route) filter.route = route;
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await StudentTransport.countDocuments(filter);
      const assignments = await StudentTransport.find(filter)
        .populate('student', 'firstName lastName rollNumber')
        .populate('route', 'routeName routeNumber')
        .lean()
        .skip(skip)
        .limit(parseInt(limit));

      return responseHelper.paginated(res, assignments, { page: parseInt(page), limit: parseInt(limit), total });
    } catch (error) {
      logger.error('Error fetching student transports', error);
      next(error);
    }
  }

  /**
   * Get route statistics
   */
  static async getRouteStatistics(req, res, next) {
    try {
      const { routeId } = req.params;
      const schoolId = req.user.schoolId;

      const route = await Route.findOne({ _id: routeId, schoolId }).lean();
      if (!route) throw new AppError('Route not found', 404);

      const students = await StudentTransport.countDocuments({
        schoolId,
        route: routeId,
        status: 'ACTIVE'
      });

      const statistics = {
        routeId,
        routeName: route.routeName,
        totalCapacity: route.capacity,
        assignedStudents: students,
        availableSeats: route.capacity - students,
        occupancyPercentage: Math.round((students / route.capacity) * 100)
      };

      return responseHelper.success(res, statistics, 'Route statistics retrieved successfully');
    } catch (error) {
      logger.error('Error fetching route statistics', error);
      next(error);
    }
  }

  /**
   * Get bus maintenance schedule
   */
  static async getBusMaintenanceSchedule(req, res, next) {
    try {
      const { busId } = req.params;
      const schoolId = req.user.schoolId;

      const bus = await Bus.findOne({ _id: busId, schoolId }).lean();

      if (!bus) throw new AppError('Bus not found', 404);

      const schedule = {
        busId,
        busNumber: bus.busNumber,
        lastMaintenanceDate: bus.lastMaintenanceDate,
        nextMaintenanceDate: bus.nextMaintenanceDate,
        insuranceExpiryDate: bus.insuranceExpiryDate,
        fitnessExpiryDate: bus.fitnessExpiryDate,
        permitExpiryDate: bus.permitExpiryDate,
        daysUntilNextMaintenance: bus.nextMaintenanceDate ? Math.ceil((new Date(bus.nextMaintenanceDate) - new Date()) / (1000 * 60 * 60 * 24)) : null
      };

      return responseHelper.success(res, schedule, 'Bus maintenance schedule retrieved successfully');
    } catch (error) {
      logger.error('Error fetching maintenance schedule', error);
      next(error);
    }
  }

  /**
   * Update bus mileage
   */
  static async updateBusMileage(req, res, next) {
    try {
      const { busId } = req.params;
      const { currentMileage } = req.body;
      const schoolId = req.user.schoolId;

      if (!currentMileage || currentMileage < 0) {
        throw new ValidationError('Valid mileage is required');
      }

      const bus = await Bus.findOneAndUpdate(
        { _id: busId, schoolId },
        { currentMileage },
        { new: true }
      );

      if (!bus) throw new AppError('Bus not found', 404);

      return responseHelper.success(res, bus, 'Bus mileage updated successfully');
    } catch (error) {
      logger.error('Error updating mileage', error);
      next(error);
    }
  }
}

module.exports = TransportController;
    const route = await transportService.createRoute(req.body, req.user.schoolId);
    return responseHelper.created(res, route, 'Route created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get all transport routes
 * GET /api/v1/transport/routes
 */
exports.getAllRoutes = async (req, res, next) => {
  try {
    const { routes, total, page, limit } = await transportService.getAllRoutes(req.user.schoolId, req.query);
    return responseHelper.paginated(res, routes, { page, limit, total });
  } catch (err) {
    next(err);
  }
};

/**
 * Get route by ID
 * GET /api/v1/transport/routes/:id
 */
exports.getRouteById = async (req, res, next) => {
  try {
    const route = await transportService.getRouteById(req.params.id, req.user.schoolId);
    return responseHelper.success(res, route);
  } catch (err) {
    next(err);
  }
};

/**
 * Update route
 * PUT /api/v1/transport/routes/:id
 */
exports.updateRoute = async (req, res, next) => {
  try {
    const route = await transportService.updateRoute(
      req.params.id,
      { ...req.body, performedBy: req.user.userId },
      req.user.schoolId
    );
    return responseHelper.success(res, route, 'Route updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Register a new bus
 * POST /api/v1/transport/buses
 */
exports.registerBus = async (req, res, next) => {
  try {
    const bus = await transportService.registerBus(req.body, req.user.schoolId);
    return responseHelper.created(res, bus, 'Bus registered successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get all buses
 * GET /api/v1/transport/buses
 */
exports.getAllBuses = async (req, res, next) => {
  try {
    const { buses, total, page, limit } = await transportService.getAllBuses(req.user.schoolId, req.query);
    return responseHelper.paginated(res, buses, { page, limit, total });
  } catch (err) {
    next(err);
  }
};

/**
 * Get bus by ID
 * GET /api/v1/transport/buses/:id
 */
exports.getBusById = async (req, res, next) => {
  try {
    const bus = await transportService.getBusById(req.params.id, req.user.schoolId);
    return responseHelper.success(res, bus);
  } catch (err) {
    next(err);
  }
};

/**
 * Update bus
 * PUT /api/v1/transport/buses/:id
 */
exports.updateBus = async (req, res, next) => {
  try {
    const bus = await transportService.updateBus(
      req.params.id,
      { ...req.body, performedBy: req.user.userId },
      req.user.schoolId
    );
    return responseHelper.success(res, bus, 'Bus updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Register a driver
 * POST /api/v1/transport/drivers
 */
exports.registerDriver = async (req, res, next) => {
  try {
    const driver = await transportService.registerDriver(req.body, req.user.schoolId);
    return responseHelper.created(res, driver, 'Driver registered successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get all drivers
 * GET /api/v1/transport/drivers
 */
exports.getAllDrivers = async (req, res, next) => {
  try {
    const { drivers, total, page, limit } = await transportService.getAllDrivers(req.user.schoolId, req.query);
    return responseHelper.paginated(res, drivers, { page, limit, total });
  } catch (err) {
    next(err);
  }
};

/**
 * Assign student to route
 * POST /api/v1/transport/allocations
 */
exports.assignStudentToRoute = async (req, res, next) => {
  try {
    const { studentId, ...allocationData } = req.body;
    const allocation = await transportService.assignStudentToRoute(
      studentId,
      allocationData,
      req.user.schoolId
    );
    return responseHelper.created(res, allocation, 'Student assigned to route successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get student's transport allocation
 * GET /api/v1/transport/allocations/student/:studentId
 */
exports.getStudentAllocation = async (req, res, next) => {
  try {
    const allocation = await transportService.getStudentTransportAllocation(
      req.params.studentId,
      req.user.schoolId
    );
    return responseHelper.success(res, allocation);
  } catch (err) {
    next(err);
  }
};

/**
 * Get route allocations
 * GET /api/v1/transport/routes/:routeId/allocations
 */
exports.getRouteAllocations = async (req, res, next) => {
  try {
    const allocations = await transportService.getRouteAllocations(
      req.params.routeId,
      req.user.schoolId
    );
    return responseHelper.success(res, allocations);
  } catch (err) {
    next(err);
  }
};

/**
 * Add transport attendance
 * POST /api/v1/transport/attendance
 */
exports.addTransportAttendance = async (req, res, next) => {
  try {
    const log = await transportService.addTransportAttendance(req.body, req.user.schoolId);
    return responseHelper.created(res, log, 'Attendance recorded successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get bus transport logs
 * GET /api/v1/transport/buses/:busId/logs
 */
exports.getBusLogs = async (req, res, next) => {
  try {
    const { logs, total, page, limit } = await transportService.getBusTransportLogs(
      req.params.busId,
      req.user.schoolId,
      req.query
    );
    return responseHelper.paginated(res, logs, { page, limit, total });
  } catch (err) {
    next(err);
  }
};

/**
 * Collect transport fee
 * POST /api/v1/transport/allocations/:studentId/collect-fee
 */
exports.collectTransportFee = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const allocation = await transportService.collectTransportFee(
      req.params.studentId,
      amount,
      req.user.schoolId
    );
    return responseHelper.success(res, allocation, 'Transport fee collected successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get transport statistics
 * GET /api/v1/transport/statistics
 */
exports.getTransportStatistics = async (req, res, next) => {
  try {
    const stats = await transportService.getTransportStatistics(req.user.schoolId);
    return responseHelper.success(res, stats);
  } catch (err) {
    next(err);
  }
};

/**
 * Deactivate driver
 * PUT /api/v1/transport/drivers/:driverId/deactivate
 */
exports.deactivateDriver = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const driver = await transportService.deactivateDriver(
      req.params.driverId,
      req.user.schoolId,
      reason
    );
    return responseHelper.success(res, driver, 'Driver deactivated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Deactivate route
 * PUT /api/v1/transport/routes/:routeId/deactivate
 */
exports.deactivateRoute = async (req, res, next) => {
  try {
    const route = await transportService.deactivateRoute(
      req.params.routeId,
      req.user.schoolId
    );
    return responseHelper.success(res, route, 'Route deactivated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
      const { schoolId } = req.user;
      const { busId } = req.params;

      const bus = await TransportService.getBusById(schoolId, busId);

      responseHelper.success(res, bus, 'Bus retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update bus
   * PUT /api/v1/transport/buses/:busId
   */
  static async updateBus(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { busId } = req.params;
      const updateData = req.body;

      const bus = await TransportService.updateBus(schoolId, busId, updateData);

      responseHelper.success(res, bus, 'Bus updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete bus
   * DELETE /api/v1/transport/buses/:busId
   */
  static async deleteBus(req, res, next) {
    try {
      const { schoolId } = req.user;
      const { busId } = req.params;

      const result = await TransportService.deleteBus(schoolId, busId);

      responseHelper.success(res, result, 'Bus deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add driver
   * POST /api/v1/transport/drivers
   */
  static async addDriver(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const driverData = req.body;

      const driver = await TransportService.addDriver(schoolId, driverData, userId);

      responseHelper.created(res, driver, 'Driver added successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get drivers
   * GET /api/v1/transport/drivers
   */
  static async getDrivers(req, res, next) {
    try {
      const { schoolId } = req.user;
      const filters = req.query;

      const result = await TransportService.getDrivers(schoolId, filters);

      responseHelper.paginated(res, result.data, result.pagination, 'Drivers retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assign student transport
   * POST /api/v1/transport/assignments
   */
  static async assignStudentTransport(req, res, next) {
    try {
      const { schoolId, userId } = req.user;
      const transportData = req.body;

      const studentTransport = await TransportService.assignStudentTransport(schoolId, transportData, userId);

      responseHelper.created(res, studentTransport, 'Student transport assigned successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transport statistics
   * GET /api/v1/transport/stats
   */
  static async getTransportStats(req, res, next) {
    try {
      const { schoolId } = req.user;

      const stats = await TransportService.getTransportStats(schoolId);

      responseHelper.success(res, stats, 'Transport statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransportController;

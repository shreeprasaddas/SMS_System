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

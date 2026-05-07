/**
 * Socket.IO Server Configuration
 * Aggregates all socket event handlers
 */

const logger = require('../utils/logger');

module.exports = (io) => {
  // Middleware: Attach user info from JWT token
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        logger.warn('Socket connection without token', { socketId: socket.id });
        return next(new Error('Authentication token required'));
      }

      // TODO: Verify JWT token and attach user info
      socket.userId = socket.handshake.auth.userId || 'anonymous';
      socket.schoolId = socket.handshake.auth.schoolId || 'default';
      socket.userRole = socket.handshake.auth.userRole || 'guest';

      logger.debug('Socket authenticated', {
        socketId: socket.id,
        userId: socket.userId,
        role: socket.userRole,
      });

      next();
    } catch (error) {
      logger.error('Socket authentication error', { error: error.message });
      next(new Error('Socket authentication failed'));
    }
  });

  // Connection event
  io.on('connection', (socket) => {
    logger.info('User connected', {
      socketId: socket.id,
      userId: socket.userId,
      timestamp: new Date().toISOString(),
    });

    // Join room for user
    socket.join(`user-${socket.userId}`);
    socket.join(`school-${socket.schoolId}`);

    // Emit connection success
    socket.emit('connected', {
      success: true,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });

    // ============================================================
    // NOTIFICATION EVENTS
    // ============================================================

    socket.on('notify:send', (data) => {
      try {
        logger.debug('Notification event received', { data });
        // Emit to specific user or broadcast to school
        if (data.recipientId) {
          io.to(`user-${data.recipientId}`).emit('notify:receive', {
            message: data.message,
            type: data.type,
            sender: socket.userId,
            timestamp: new Date(),
          });
        } else if (data.schoolWide) {
          io.to(`school-${socket.schoolId}`).emit('notify:receive', {
            message: data.message,
            type: data.type,
            sender: socket.userId,
            schoolWide: true,
            timestamp: new Date(),
          });
        }
        socket.emit('notify:sent', { success: true });
      } catch (error) {
        logger.error('Error sending notification', { error: error.message });
        socket.emit('notify:error', { error: error.message });
      }
    });

    // ============================================================
    // ATTENDANCE EVENTS
    // ============================================================

    socket.on('attendance:sync', (data) => {
      try {
        logger.debug('Attendance sync requested', { classId: data.classId });
        // Broadcast to class room
        io.to(`class-${data.classId}`).emit('attendance:updated', {
          classId: data.classId,
          timestamp: new Date(),
          status: 'synced',
        });
        socket.emit('attendance:sync-complete', { success: true });
      } catch (error) {
        logger.error('Error syncing attendance', { error: error.message });
        socket.emit('attendance:error', { error: error.message });
      }
    });

    socket.on('attendance:join-class', (data) => {
      socket.join(`class-${data.classId}`);
      logger.debug('User joined class room', { classId: data.classId, userId: socket.userId });
      io.to(`class-${data.classId}`).emit('class:user-joined', {
        userId: socket.userId,
        timestamp: new Date(),
      });
    });

    socket.on('attendance:leave-class', (data) => {
      socket.leave(`class-${data.classId}`);
      logger.debug('User left class room', { classId: data.classId, userId: socket.userId });
      io.to(`class-${data.classId}`).emit('class:user-left', {
        userId: socket.userId,
        timestamp: new Date(),
      });
    });

    // ============================================================
    // CHAT EVENTS
    // ============================================================

    socket.on('chat:send', (data) => {
      try {
        logger.debug('Chat message sent', { recipientId: data.recipientId });
        const timestamp = new Date();
        
        // Store message (TODO: Implement message storage)
        const message = {
          senderId: socket.userId,
          recipientId: data.recipientId,
          content: data.content,
          timestamp,
          read: false,
        };

        // Send to recipient
        io.to(`user-${data.recipientId}`).emit('chat:receive', message);
        socket.emit('chat:sent', { success: true, timestamp });
      } catch (error) {
        logger.error('Error sending chat message', { error: error.message });
        socket.emit('chat:error', { error: error.message });
      }
    });

    socket.on('chat:typing', (data) => {
      io.to(`user-${data.recipientId}`).emit('chat:user-typing', {
        userId: socket.userId,
        typing: data.typing,
      });
    });

    // ============================================================
    // GRADES & RESULTS EVENTS
    // ============================================================

    socket.on('grades:publish', (data) => {
      try {
        logger.info('Grades published', { examId: data.examId });
        // Broadcast to all students in this class
        io.to(`class-${data.classId}`).emit('grades:available', {
          examId: data.examId,
          publishedAt: new Date(),
          message: 'Grades have been published',
        });
      } catch (error) {
        logger.error('Error publishing grades', { error: error.message });
      }
    });

    // ============================================================
    // FEES PAYMENT EVENTS
    // ============================================================

    socket.on('payment:initiated', (data) => {
      try {
        logger.info('Payment initiated', { studentId: data.studentId });
        io.to(`user-${data.studentId}`).emit('payment:tracking', {
          transactionId: data.transactionId,
          status: 'initiated',
          amount: data.amount,
        });
      } catch (error) {
        logger.error('Error tracking payment', { error: error.message });
      }
    });

    socket.on('payment:completed', (data) => {
      try {
        logger.info('Payment completed', { transactionId: data.transactionId });
        io.to(`school-${socket.schoolId}`).emit('payment:success', {
          studentId: data.studentId,
          amount: data.amount,
          timestamp: new Date(),
        });
      } catch (error) {
        logger.error('Error on payment completion', { error: error.message });
      }
    });

    // ============================================================
    // DOCUMENT UPLOAD EVENTS
    // ============================================================

    socket.on('document:upload-progress', (data) => {
      socket.emit('document:progress', {
        fileId: data.fileId,
        progress: data.progress,
      });
    });

    socket.on('document:uploaded', (data) => {
      try {
        logger.info('Document uploaded', { documentId: data.documentId });
        // Notify relevant users
        if (data.schoolWide) {
          io.to(`school-${socket.schoolId}`).emit('document:available', {
            documentId: data.documentId,
            documentName: data.documentName,
          });
        }
      } catch (error) {
        logger.error('Error on document upload', { error: error.message });
      }
    });

    // ============================================================
    // REAL-TIME DASHBOARD UPDATES
    // ============================================================

    socket.on('dashboard:subscribe', (data) => {
      socket.join(`dashboard-${data.dashboardType}`);
      logger.debug('User subscribed to dashboard', { dashboardType: data.dashboardType });
    });

    socket.on('dashboard:unsubscribe', (data) => {
      socket.leave(`dashboard-${data.dashboardType}`);
      logger.debug('User unsubscribed from dashboard', { dashboardType: data.dashboardType });
    });

    // Emit dashboard updates (Can be triggered by services)
    socket.on('dashboard:update', (data) => {
      io.to(`dashboard-${data.dashboardType}`).emit('dashboard:refreshed', {
        dashboardType: data.dashboardType,
        data: data.metrics,
        timestamp: new Date(),
      });
    });

    // ============================================================
    // NOTICE & CIRCULAR EVENTS
    // ============================================================

    socket.on('notice:published', (data) => {
      try {
        logger.info('Notice published', { noticeId: data.noticeId });
        // Broadcast to relevant audience
        const targetAudience = data.targetAudience || 'school';
        if (targetAudience === 'school') {
          io.to(`school-${socket.schoolId}`).emit('notice:new', {
            noticeId: data.noticeId,
            title: data.title,
            publishedAt: new Date(),
          });
        }
      } catch (error) {
        logger.error('Error publishing notice', { error: error.message });
      }
    });

    // ============================================================
    // DISCONNECT EVENT
    // ============================================================

    socket.on('disconnect', () => {
      logger.info('User disconnected', {
        socketId: socket.id,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // ============================================================
    // ERROR HANDLING
    // ============================================================

    socket.on('error', (error) => {
      logger.error('Socket error', {
        socketId: socket.id,
        error: error.message,
      });
    });
  });

  logger.info('Socket.IO configured successfully');
};

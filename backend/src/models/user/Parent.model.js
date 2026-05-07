/**
 * Parent Model
 * Extended user model for parent/guardian accounts
 */

const mongoose = require('mongoose');
const User = require('./User.model');

const parentSchema = new mongoose.Schema(
  {
    // Professional Information
    occupation: String,
    company: String,
    designation: String,

    // Relationship
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Contact Preference
    preferredContactMethod: {
      type: String,
      enum: ['EMAIL', 'PHONE', 'SMS'],
      default: 'EMAIL',
    },
    communicationLanguage: {
      type: String,
      default: 'EN',
    },

    // Status
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

// Indexes
parentSchema.index({ children: 1 });
parentSchema.index({ schoolId: 1 });

module.exports = User.discriminator('PARENT', parentSchema);

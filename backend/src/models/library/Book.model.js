const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    isbn: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      min: 3,
      max: 200
    },
    authors: [{
      type: String,
      required: true
    }],
    publisher: {
      type: String,
      required: true
    },
    publishedDate: {
      type: Date
    },
    edition: {
      type: String
    },
    category: {
      type: String,
      enum: ['FICTION', 'NON_FICTION', 'ACADEMIC', 'REFERENCE', 'SCIENCE', 'HISTORY', 'ARTS', 'MATHEMATICS', 'SPORTS', 'GENERAL'],
      default: 'GENERAL',
      index: true
    },
    language: {
      type: String,
      enum: ['ENGLISH', 'HINDI', 'SPANISH', 'FRENCH', 'GERMAN', 'OTHER'],
      default: 'ENGLISH'
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0
    },
    location: {
      shelf: String,
      rack: String,
      section: String
    },
    condition: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'],
      default: 'GOOD'
    },
    acquisitionDate: {
      type: Date,
      required: true
    },
    acquisitionCost: {
      type: Number,
      required: true
    },
    pages: {
      type: Number
    },
    description: {
      type: String,
      max: 2000
    },
    tags: [String],
    coverImageURL: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    },
    auditLog: [{
      action: String,
      performedBy: mongoose.Schema.Types.ObjectId,
      timestamp: {
        type: Date,
        default: Date.now
      },
      changes: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true,
    virtuals: {
      issuedCopies: {
        get() {
          return this.totalCopies - this.availableCopies;
        }
      }
    }
  }
);

// Pre-save middleware: auto-generate code
bookSchema.pre('save', async function(next) {
  if (!this.code) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Book').countDocuments({ schoolId: this.schoolId });
    this.code = `BOOK-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
bookSchema.index({ schoolId: 1, status: 1 });
bookSchema.index({ schoolId: 1, category: 1 });
bookSchema.index({ schoolId: 1, isbn: 1 });
bookSchema.index({ schoolId: 1, title: 1 });

module.exports = mongoose.model('Book', bookSchema);

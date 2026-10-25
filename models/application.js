
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must contain at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address'
      ]
    },

    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
      maxlength: 30,
      match: [
        /^[A-Za-z0-9/_-]+$/,
        'Invalid roll number format'
      ]
    },

    selectedInternship: {
      type: String,
      required: [true, 'Please select an internship'],
      enum: [
        'web-development',
        'data-science',
        'java-development',
        'ui-ux-design'
      ]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Application', applicationSchema);

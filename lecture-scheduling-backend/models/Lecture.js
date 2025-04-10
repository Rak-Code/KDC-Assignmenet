// models/Lecture.js
const mongoose = require('mongoose');

const lectureSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    batch: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      required: [true, 'Please add a date for the lecture'],
    },
    startTime: {
      type: String,
      required: [true, 'Please add a start time'],
    },
    endTime: {
      type: String,
      required: [true, 'Please add an end time'],
    },
    details: {
      type: String,
    },
    location: {
      type: String,
      default: 'Online',
    },
  },
  {
    timestamps: true,
  }
);

// Create a custom pre-save hook to check for scheduling conflicts
lectureSchema.pre('save', async function (next) {
  if (this.isModified('instructor') || this.isModified('date')) {
    // Format the date to start of day
    const lectureDate = new Date(this.date);
    const startOfDay = new Date(lectureDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(this.date).setHours(23, 59, 59, 999));

    // Check if instructor already has a lecture on this date
    const existingLecture = await this.constructor.findOne({
      _id: { $ne: this._id }, // Exclude current lecture when updating
      instructor: this.instructor,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingLecture) {
      throw new Error('Instructor already has a lecture scheduled on this date');
    }
  }
  next();
});

module.exports = mongoose.model('Lecture', lectureSchema);
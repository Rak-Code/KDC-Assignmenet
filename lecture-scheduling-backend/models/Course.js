// models/Course.js
const mongoose = require('mongoose');

const batchSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a batch name'],
  },
  description: {
    type: String,
  },
});

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a course name'],
      trim: true,
    },
    level: {
      type: String,
      required: [true, 'Please add a level'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    imageUrl: {
      type: String,
      default: 'no-image.jpg',
    },
    batches: [batchSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
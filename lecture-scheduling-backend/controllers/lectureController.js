// controllers/lectureController.js
const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all lectures
// @route   GET /api/lectures
// @access  Private/Admin
const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({})
      .populate('course', 'name level')
      .populate('instructor', 'name email');
    
    res.json(lectures);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get instructor lectures
// @route   GET /api/lectures/instructor
// @access  Private/Instructor
const getInstructorLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ instructor: req.user._id })
      .populate('course', 'name level description imageUrl')
      .sort({ date: 1 });
    
    res.json(lectures);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get lecture by ID
// @route   GET /api/lectures/:id
// @access  Private
const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id)
      .populate('course', 'name level description imageUrl')
      .populate('instructor', 'name email');
    
    // Check lecture exists
    if (!lecture) {
      res.status(404);
      throw new Error('Lecture not found');
    }

    // Check if user is admin or the instructor assigned to the lecture
    if (req.user.role === 'admin' || lecture.instructor._id.toString() === req.user._id.toString()) {
      res.json(lecture);
    } else {
      res.status(401);
      throw new Error('Not authorized');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create a lecture
// @route   POST /api/lectures
// @access  Private/Admin
const createLecture = async (req, res) => {
  try {
    console.log('Received lecture data:', req.body);
    
    const { course, instructor, date, startTime, endTime, details, location } = req.body;

    // Check if course exists
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      console.log('Course not found:', course);
      return res.status(404).json({ message: `Course not found with id: ${course}` });
    }

    // Check if instructor exists
    const instructorDoc = await User.findById(instructor);
    if (!instructorDoc) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Create lecture without batch information
    const lecture = new Lecture({
      course,
      instructor,
      date: new Date(date),
      startTime,
      endTime,
      details,
      location: location || 'Online',
    });

    const createdLecture = await lecture.save();
    
    // Populate the course and instructor details
    const populatedLecture = await Lecture.findById(createdLecture._id)
      .populate('course', 'name level')
      .populate('instructor', 'name email');

    res.status(201).json(populatedLecture);
  } catch (error) {
    console.error('Lecture creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a lecture
// @route   PUT /api/lectures/:id
// @access  Private/Admin
const updateLecture = async (req, res) => {
  try {
    const { details } = req.body;

    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      res.status(404);
      throw new Error('Lecture not found');
    }

    // Note: According to requirements, once a lecture is assigned,
    // we cannot modify the instructor or date to avoid scheduling conflicts

    lecture.details = details || lecture.details;
    
    const updatedLecture = await lecture.save();
    res.json(updatedLecture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a lecture
// @route   DELETE /api/lectures/:id
// @access  Private/Admin
// Updated delete method for lectureController.js
const deleteLecture = async (req, res) => {
    try {
      const lecture = await Lecture.findById(req.params.id);
  
      if (!lecture) {
        res.status(404);
        throw new Error('Lecture not found');
      }
  
      await Lecture.deleteOne({ _id: lecture._id });
      res.json({ message: 'Lecture removed' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

module.exports = {
  getLectures,
  getInstructorLectures,
  getLectureById,
  createLecture,
  updateLecture,
  deleteLecture,
};
// controllers/instructorController.js
const User = require('../models/User');

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Private/Admin
const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select('-password');
    res.json(instructors);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get instructor by ID
// @route   GET /api/instructors/:id
// @access  Private/Admin
const getInstructorById = async (req, res) => {
  try {
    const instructor = await User.findById(req.params.id).select('-password');
    
    if (instructor && instructor.role === 'instructor') {
      res.json(instructor);
    } else {
      res.status(404);
      throw new Error('Instructor not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create instructor
// @route   POST /api/instructors
// @access  Private/Admin
const createInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create instructor
    const instructor = await User.create({
      name,
      email,
      password,
      role: 'instructor',
    });

    if (instructor) {
      res.status(201).json({
        _id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        role: instructor.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid instructor data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update instructor
// @route   PUT /api/instructors/:id
// @access  Private/Admin
const updateInstructor = async (req, res) => {
  try {
    const { name, email } = req.body;

    const instructor = await User.findById(req.params.id);

    if (instructor && instructor.role === 'instructor') {
      instructor.name = name || instructor.name;
      instructor.email = email || instructor.email;

      const updatedInstructor = await instructor.save();

      res.json({
        _id: updatedInstructor._id,
        name: updatedInstructor.name,
        email: updatedInstructor.email,
        role: updatedInstructor.role,
      });
    } else {
      res.status(404);
      throw new Error('Instructor not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete instructor
// @route   DELETE /api/instructors/:id
// @access  Private/Admin
// Updated delete method for instructorController.js
const deleteInstructor = async (req, res) => {
    try {
      const instructor = await User.findById(req.params.id);
  
      if (instructor && instructor.role === 'instructor') {
        await User.deleteOne({ _id: instructor._id });
        res.json({ message: 'Instructor removed' });
      } else {
        res.status(404);
        throw new Error('Instructor not found');
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
module.exports = {
  getInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor,
};
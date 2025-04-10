// controllers/courseController.js
const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (course) {
      res.json(course);
    } else {
      res.status(404);
      throw new Error('Course not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const { name, level, description, imageUrl, batches } = req.body;

    const course = new Course({
      name,
      level,
      description,
      imageUrl: imageUrl || 'no-image.jpg',
      batches: batches || [],
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const { name, level, description, imageUrl } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
      course.name = name || course.name;
      course.level = level || course.level;
      course.description = description || course.description;
      course.imageUrl = imageUrl || course.imageUrl;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404);
      throw new Error('Course not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
// Updated delete method for courseController.js
const deleteCourse = async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
  
      if (course) {
        await Course.deleteOne({ _id: course._id });
        res.json({ message: 'Course removed' });
      } else {
        res.status(404);
        throw new Error('Course not found');
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
// @desc    Add batch to course
// @route   POST /api/courses/:id/batches
// @access  Private/Admin
const addBatch = async (req, res) => {
  try {
    const { name, description } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
      const batch = {
        name,
        description,
      };

      course.batches.push(batch);
      await course.save();
      
      res.status(201).json(course);
    } else {
      res.status(404);
      throw new Error('Course not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update batch
// @route   PUT /api/courses/:id/batches/:batchId
// @access  Private/Admin
const updateBatch = async (req, res) => {
  try {
    const { name, description } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
      const batchIndex = course.batches.findIndex(
        (b) => b._id.toString() === req.params.batchId
      );

      if (batchIndex !== -1) {
        course.batches[batchIndex].name = name || course.batches[batchIndex].name;
        course.batches[batchIndex].description = description || course.batches[batchIndex].description;

        await course.save();
        res.json(course);
      } else {
        res.status(404);
        throw new Error('Batch not found');
      }
    } else {
      res.status(404);
      throw new Error('Course not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete batch
// @route   DELETE /api/courses/:id/batches/:batchId
// @access  Private/Admin
const deleteBatch = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      course.batches = course.batches.filter(
        (batch) => batch._id.toString() !== req.params.batchId
      );

      await course.save();
      res.json(course);
    } else {
      res.status(404);
      throw new Error('Course not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addBatch,
  updateBatch,
  deleteBatch,
};
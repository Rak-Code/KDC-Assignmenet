// routes/courseRoutes.js
const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addBatch,
  updateBatch,
  deleteBatch,
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(protect, getCourses)
  .post(protect, admin, createCourse);

router
  .route('/:id')
  .get(protect, getCourseById)
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

router
  .route('/:id/batches')
  .post(protect, admin, addBatch);

router
  .route('/:id/batches/:batchId')
  .put(protect, admin, updateBatch)
  .delete(protect, admin, deleteBatch);

module.exports = router;
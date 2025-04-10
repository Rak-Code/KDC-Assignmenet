// routes/instructorRoutes.js
const express = require('express');
const {
  getInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} = require('../controllers/instructorController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(protect, admin, getInstructors)
  .post(protect, admin, createInstructor);

router
  .route('/:id')
  .get(protect, admin, getInstructorById)
  .put(protect, admin, updateInstructor)
  .delete(protect, admin, deleteInstructor);

module.exports = router;
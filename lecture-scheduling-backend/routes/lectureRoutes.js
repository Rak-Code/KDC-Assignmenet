// routes/lectureRoutes.js
const express = require('express');
const {
  getLectures,
  getInstructorLectures,
  getLectureById,
  createLecture,
  updateLecture,
  deleteLecture,
} = require('../controllers/lectureController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(protect, admin, getLectures)
  .post(protect, admin, createLecture);

router.route('/instructor').get(protect, getInstructorLectures);

router
  .route('/:id')
  .get(protect, getLectureById)
  .put(protect, admin, updateLecture)
  .delete(protect, admin, deleteLecture);

module.exports = router;
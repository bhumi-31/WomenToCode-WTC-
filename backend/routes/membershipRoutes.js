const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
  replyToApplicant
} = require('../controllers/membershipController');
const { protect, authorize } = require('../middleware/auth');

// Public route - anyone can apply
router.post('/', submitApplication);

// Admin routes
router.get('/', protect, authorize('admin'), getAllApplications);
router.put('/:id', protect, authorize('admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('admin'), deleteApplication);
router.post('/reply', protect, authorize('admin'), replyToApplicant);

module.exports = router;

const Membership = require('../models/Membership');
const { sendMembershipReply } = require('../utils/emailService');

// @desc    Submit membership application
// @route   POST /membership
// @access  Public
exports.submitApplication = async (req, res) => {
  try {
    const { name, registrationNo, mobile, email, domain, whyJoin } = req.body;

    // Check if already applied with same email or registration number
    const existingApplication = await Membership.findOne({
      $or: [{ email }, { registrationNo }]
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'An application with this email or registration number already exists'
      });
    }

    const application = await Membership.create({
      name,
      registrationNo,
      mobile,
      email,
      domain,
      whyJoin
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
};

// @desc    Get all membership applications
// @route   GET /membership
// @access  Admin
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Membership.find().sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// @desc    Update application status
// @route   PUT /membership/:id
// @access  Admin
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Membership.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message
    });
  }
};

// @desc    Delete application
// @route   DELETE /membership/:id
// @access  Admin
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Membership.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: error.message
    });
  }
};

// @desc    Reply to applicant via email
// @route   POST /membership/reply
// @access  Admin
exports.replyToApplicant = async (req, res) => {
  try {
    const { email, name, subject, message } = req.body;

    await sendMembershipReply(email, name, subject, message);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error.message
    });
  }
};

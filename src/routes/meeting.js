const express = require('express');
const { createMeetingController, inviteToMeetingController, respondController } = require('../controllers/meeting');
const { authMiddleware } = require('../controllers/middleware');

const router = express.Router();

// All meeting endpoints require authorization
router.use(authMiddleware)

// Create meeting route
router.post('/create', createMeetingController);

// Invite attendees route
router.post('/invite', inviteToMeetingController);

// Respond to meeting route 
router.post('/respond', respondController);

// TODO: 
// router.patch('/update', );

// TODO:
// router.delete('/delete', )

module.exports = router;

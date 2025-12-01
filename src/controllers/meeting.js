const mongoose = require('mongoose');
const Meeting = require('../models/meeting');

const createMeetingController = async (req, res) => {
	try {
		if (!req.body)
			throw new Error(
				'JSON body required containing: title, startTime, endTime, description, host, attendees'
			);

		const { title, startTime, endTime, description, attendees } = req.body;
		const newMeeting = new Meeting({
			title,
			startTime,
			endTime,
			description,
			host: req.user.id,
			attendees,
		});
		await newMeeting.save();
		res.status(201).json({
			message: 'New meeting created',
			meeting: newMeeting,
		});
	} catch (err) {
		err.status = 400;
		throw err;
	}
};

const inviteToMeetingController = async (req, res) => {
	const { meetingId, inviteeIds } = req.body;

	const meeting = await Meeting.findById(meetingId);
	if (!meeting) {
		const error = new Error('No meeting found with provided meetingId');
		error.status = 404;
		throw error;
	}

	if (meeting.host != req.user.id) {
		const error = new Error('Only the meeting host can invite attendees');
		error.status = 403;
		throw error;
	}

	// Loop through provided new attendees and add them to the meeting, unless they're already in it
	let countInvited = 0;
	inviteeIds.forEach((id) => {
		if (
			id &&
			!meeting.attendees.some((att) => att.user.toString() === id)
		) {
			meeting.attendees.push({
				user: new mongoose.Types.ObjectId(id),
			});
			countInvited += 1;
		}
	});

	if (!countInvited) {
		const error = new Error(
			'Unable to invite provided attendees. Are they already invited to the meeting?'
		);
		error.status = 400;
		throw error;
	}
    
	await meeting.save();
	res.status(200).json({
		message: 'User(s) invited succesfully',
		meeting,
	});
};

const respondController = async (req, res) => {
	try {
		const { meetingId, response } = req.body;

		const meeting = await Meeting.findById(meetingId);
		if (!meeting) {
			const error = new Error('No meeting found with provided meetingId');
			error.status = 404;
			throw error;
		}

		// Check that this user is invited to the meeting
		const thisAttendee = meeting.attendees.find(
			(att) => att.user.toString() === req.user.id
		);
		if (!thisAttendee) {
			const error = new Error(
				'Current user is not invited to this meeting'
			);
			error.status = 400;
			throw error;
		}

		thisAttendee.status = response;
		await meeting.save();

		res.status(200).json({
			message: 'Status updated',
			response: thisAttendee,
		});
	} catch (err) {
		err.status = 400;
		throw err;
	}
};

module.exports = {
	createMeetingController,
	inviteToMeetingController,
	respondController,
};

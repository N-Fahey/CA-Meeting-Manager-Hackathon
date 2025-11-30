const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Meeting title is required'],
			maxLength: 250,
		},
		startTime: {
			type: Date,
			required: [true, 'Meeting start time is required'],
			validate: {
				validator: (value) => {
					if (!value) return false;

					// new Date() returns current date/time, so check if provided date is in future & return result
					return value >= new Date();
				},
				message: 'startTime cannot be in the past!',
			},
		},
		endTime: {
			type: Date,
			required: [true, 'Meeting end time is required'],
			validate: {
				validator: function (value) {
					if (!value) return false;

					return value >= this.startTime;
				},
				message: 'endTime cannot be prior to start time!',
			},
		},
		description: {
			type: String,
			default: this.title,
		},
		host: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Host user is required'],
		},
		attendees: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: [true, 'Attending user is required'],
				},
				status: {
					type: String,
					enum: ['accepted', 'declined', 'tentative'],
				},
			},
		],
	},
	{ timestamps: true }
);

// TODO: add normalisation

module.exports = mongoose.model('Meeting', meetingSchema);

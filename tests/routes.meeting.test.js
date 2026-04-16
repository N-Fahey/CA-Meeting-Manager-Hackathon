/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { app } = require('../src/index');
const User = require('../src/models/user');
const Meeting = require('../src/models/meeting');

let insertedUsers = [];
let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

let mongoMemoryServer;

beforeAll(async () => {
	// Inject testing JWT key for auth tests
	process.env.JWT_KEY = 'testingSecretKey';
	// Setup test db for this file
	mongoMemoryServer = await MongoMemoryServer.create();
	const dbUriTest = mongoMemoryServer.getUri() + '-test-auth';

	await mongoose.connect(dbUriTest);

	// Insert seed user data to use in meeting tests
	// TODO:

	const seedUsers = [
		{
			firstName: 'user1fname',
			lastName: 'user1lname',
			email: 'user1@email.com',
			password: 'user1pass',
		},
		{
			firstName: 'user2fname',
			lastName: 'user2lname',
			email: 'user2@email.com',
			password: 'user2pass',
		},
		{
			firstName: 'user3fname',
			lastName: 'user3lname',
			email: 'user3@email.com',
			password: 'user3pass',
		},
	];

	insertedUsers = await User.create(seedUsers);

	// Log in as user 0 for all tests in this file
	var loginRes = await request(app)
		.post('/api/v1/auth/login')
		.send({ email: 'user1@email.com', password: 'user1pass' });

	// Extract cookie from response header
	global.authCookie = loginRes.headers['set-cookie'][0];
});

afterAll(async () => {
	// Drop test database & disconnect
	await mongoose.connection.dropDatabase();
	await mongoose.disconnect();

	mongoMemoryServer.stop();
});

describe('POST /create', () => {
	test('Creating a new meeting should respond 201', async () => {
		const startTime = new Date(tomorrow);
		startTime.setHours(15, 0, 0, 0);
		const endTime = new Date(tomorrow);
		endTime.setHours(15, 30, 0, 0);

		const testMeetingData = {
			title: 'This is a test created meeting',
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
			description: 'I am the meeting description',
			attendees: [
				{ user: insertedUsers[1]._id },
				{ user: insertedUsers[2]._id },
			],
		};

		const response = await request(app)
			.post('/api/v1/meeting/create')
			.set('Cookie', authCookie)
			.send(testMeetingData)
			.expect(201);

		expect(response.body.message).toBe('New meeting created');
		expect(response.body.meeting).toHaveProperty('_id');
		expect(response.body.meeting.title).toBe(testMeetingData.title);
		expect(response.body.meeting.attendees).toHaveLength(2);
	});

	test('Fail to create meeting with missing title', async () => {
		const startTime = new Date(tomorrow);
		startTime.setHours(15, 0, 0, 0);
		const endTime = new Date(tomorrow);
		endTime.setHours(15, 30, 0, 0);

		const badMeetingData = {
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
			description: 'Missing title',
			attendees: [{ user: insertedUsers[1]._id }],
		};
		const response = await request(app)
			.post('/api/v1/meeting/create')
			.set('Cookie', authCookie)
			.send(badMeetingData)
			.expect(400);
		expect(response.body.error).toContain('Meeting title is required');
	});

	test('Fail to create meeting with invalid time range', async () => {
		const startTime = new Date(tomorrow);
		startTime.setHours(16, 0, 0, 0);
		const endTime = new Date(tomorrow);
		endTime.setHours(15, 30, 0, 0);

		const badMeetingData = {
			title: 'Invalid time meeting',
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
			description: 'End time before start time',
			attendees: [{ user: insertedUsers[1]._id }],
		};
		const response = await request(app)
			.post('/api/v1/meeting/create')
			.set('Cookie', authCookie)
			.send(badMeetingData)
			.expect(400);
		expect(response.body.error).toContain(
			'endTime cannot be prior to start time!'
		);
	});
});

describe('POST /invite', () => {
	test('Inviting a new user correctly appends them to invitees', async () => {
		const startTime = new Date(tomorrow);
		startTime.setHours(16, 0, 0, 0);
		const endTime = new Date(tomorrow);
		endTime.setHours(16, 15, 0, 0);

		// Create a meeting to test on
		const testMeetingData = {
			title: 'Testing Meeting Invitations',
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
			attendees: [{ user: insertedUsers[1]._id }],
		};

		const createResponse = await request(app)
			.post('/api/v1/meeting/create')
			.set('Cookie', authCookie)
			.send(testMeetingData)
			.expect(201);

		expect(createResponse.body.meeting.attendees).toHaveLength(1);

		const inviteData = {
			meetingId: createResponse.body.meeting._id,
			inviteeIds: [insertedUsers[1]._id, insertedUsers[2]._id],
		};

		const inviteResponse = await request(app)
			.post('/api/v1/meeting/invite')
			.set('Cookie', authCookie)
			.send(inviteData)
			.expect(200);
		expect(inviteResponse.body.message).toBe('User(s) invited succesfully');
		expect(inviteResponse.body.meeting.attendees).toHaveLength(2);
		expect(inviteResponse.body.meeting.attendees[1].user).toBe(
			insertedUsers[2]._id.toString()
		);
	});

	test('Inviting an already invited user returns 400 error', async () => {
		const startTime = new Date(tomorrow);
		startTime.setHours(17, 0, 0, 0);
		const endTime = new Date(tomorrow);
		endTime.setHours(17, 30, 0, 0);

		// Create a meeting and invite 2nd user
		const testMeetingData = {
			title: 'Duplicate Invite Test',
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
			attendees: [{ user: insertedUsers[1]._id }],
		};
		const createResponse = await request(app)
			.post('/api/v1/meeting/create')
			.set('Cookie', authCookie)
			.send(testMeetingData)
			.expect(201);

		// Attempt to invite 2nd user again
		const inviteData = {
			meetingId: createResponse.body.meeting._id,
			inviteeIds: [insertedUsers[1]._id],
		};
		const failInviteResponse = await request(app)
			.post('/api/v1/meeting/invite')
			.set('Cookie', authCookie)
			.send(inviteData)
			.expect(400);
		expect(failInviteResponse.body.error).toContain(
			'Unable to invite provided attendees'
		);
	});

	test('Inviting users to a meeting not hosted by the user returns an error', async () => {
		const startTime = new Date(tomorrow);
		startTime.setHours(12, 0, 0, 0);
		const endTime = new Date(tomorrow);
		endTime.setHours(12, 30, 0, 0);

		const anotherUsersMeeting = new Meeting({
			title: 'Someone Elses Meeting',
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
			host: insertedUsers[1]._id,
			attendees: [{ user: insertedUsers[0]._id }],
		});
		await anotherUsersMeeting.save();

		const inviteData = {
			meetingId: anotherUsersMeeting._id,
			inviteeIds: [insertedUsers[2]._id],
		};

		const response = await request(app)
			.post('/api/v1/meeting/invite')
			.set('Cookie', authCookie)
			.send(inviteData)
			.expect(403);

		expect(response.body.error).toBe(
			'Only the meeting host can invite attendees'
		);
	});
});

describe('POST /respond', () => {
	test('Responding to invite correctly updates that users status', async () => {
		const startTime = new Date(tomorrow);
		startTime.setHours(18, 0, 0, 0);
		const endTime = new Date(tomorrow);
		endTime.setHours(18, 30, 0, 0);

		// Create a meeting and invite 2nd user
		const testMeetingData = {
			title: 'Respond test meeting',
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
			host: insertedUsers[1]._id,
			attendees: [{ user: insertedUsers[0]._id }],
		};

		// Create a meeting
		const testMeeting = new Meeting(testMeetingData);
		await testMeeting.save();

		expect(testMeeting.attendees[0].status).toBe('invited');

		const testResponseData = {
			meetingId: testMeeting._id,
			response: 'accepted',
		};

		const response = await request(app)
			.post('/api/v1/meeting/respond')
			.set('Cookie', authCookie)
			.send(testResponseData)
			.expect(200);

		expect(response.body.response.status).toBe('accepted');

		// Check the DB directly to confirm meetings attendee status is updated
		const refreshedTestMeeting = await Meeting.findById(testMeeting._id);
		expect(refreshedTestMeeting.attendees[0].status).toBe('accepted');
	});
});

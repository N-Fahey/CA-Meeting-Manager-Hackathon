/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');

const { app } = require('../src/index');
const User = require('../src/models/user');

let insertedUsers = [];

beforeAll(async () => {
	// Inject testing JWT key for auth tests
	process.env.JWT_KEY = 'testingSecretKey';
	// Setup test db for this file
	const dbUriTest =
		(process.env.DB_URI || 'mongodb://127.0.0.1:27017/meeting-manager') +
		'-test-meeting';

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

	insertedUsers = await User.insertMany(seedUsers);
});

afterAll(async () => {
	// Drop test database & disconnect
	await mongoose.connection.dropDatabase();
	await mongoose.disconnect();
});

describe('POST /create', () => {
	test('Creating a new meeting should respond 201', async () => {
		const testMeetingData = {
			title: 'This is a test created meeting',
			startTime: '2026-02-15T15:00:00+11',
			endTime: '2026-02-15T15:30:00+11',
			description: 'I am the meeting description',
			host: insertedUsers[0]._id,
			attendees: [
				{ user: insertedUsers[1]._id },
				{ user: insertedUsers[2]._id },
			],
		};

		const response = await request(app)
			.post('/api/v1/meeting/create')
			.send(testMeetingData)
			.expect(201);

		expect(response.body.message).toBe('Meeting created');
		expect(response.body.meeting).toHaveProperty('id');
		expect(response.body.meeting.title).toBe(testMeetingData.title);
		expect(response.body.meeting.attendees).toHaveLength(2);
	});
});

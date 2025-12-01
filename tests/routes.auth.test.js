/* eslint-disable no-undef */
const request = require('supertest');

const { app } = require('../src/index');
const mongoose = require('mongoose');

beforeAll(async () => {
	// Inject testing JWT key for auth tests
	process.env.JWT_KEY = 'testingSecretKey';
	// Setup test db for this file
	const dbUriTest =
		(process.env.DB_URI || 'mongodb://127.0.0.1:27017/meeting-manager') +
		'-test-auth';

	await mongoose.connect(dbUriTest);
});

afterAll(async () => {
	// Drop test database & disconnect
	await mongoose.connection.dropDatabase();
	await mongoose.disconnect();
});

describe('POST /register', () => {
	test('Adding a new user should respond 201', async () => {
		const testUserValid = {
			firstName: 'testFirstName',
			lastName: 'testLastName',
			email: 'test@email.com',
			password: 'TestPassword123',
		};
		const response = await request(app)
			.post('/api/v1/auth/register')
			.send(testUserValid)
			.expect(201);

		expect(response.body.message).toBe('New user registered');
		expect(response.body.firstName).toBe(testUserValid.firstName);
		expect(response.body.lastName).toBe(testUserValid.lastName);
		expect(response.body.email).toBe(testUserValid.email);
	});

	test('Adding a new user with duplicate email should fail', async () => {
		const testUserDuplicate = {
			firstName: 'userTwo',
			lastName: 'myLastName',
			email: 'test@email.com',
			password: 'InvalidUsersPassw0rd',
		};

		const response = await request(app)
			.post('/api/v1/auth/register')
			.send(testUserDuplicate)
			.expect(400);

		expect(response.body.message).toBe('An error occured');
		expect(response.body.error).toBe('Email must be unique');
		expect(response.body.errorName).toBe('MongooseError');
	});

	test('Sending JSON body with missing required items lists their keys', async () => {
		const invalidBody = {
			invalidKey: 'someValue',
		};

		const response = await request(app)
			.post('/api/v1/auth/register')
			.send(invalidBody)
			.expect(400);

		expect(response.body.message).toBe('An error occured');
		expect(response.body.errorName).toBe('ValidationError');
		expect(response.body.error).toContain('firstName');
		expect(response.body.error).toContain('lastName');
		expect(response.body.error).toContain('email');
		expect(response.body.error).toContain('password');
	});

	test('Sending without JSON body lists required keys', async () => {
		const response = await request(app)
			.post('/api/v1/auth/register')
			.expect(400);

		expect(response.body.message).toBe('An error occured');
		expect(response.body.error).toContain('firstName');
		expect(response.body.error).toContain('lastName');
		expect(response.body.error).toContain('email');
		expect(response.body.error).toContain('password');
	});
});

describe('GET /login', () => {
	test('Succesfull login should return 200', async () => {
		// Add a user to login as first
		await request(app)
			.post('/api/v1/auth/register')
			.send({
				firstName: 'loginUserFName',
				lastName: 'loginUserLName',
				email: 'loginUser@email.com',
				password: 'passwd123',
			})
			.expect(201);

		// Attempt login
		const response = await request(app)
			.post('/api/v1/auth/login')
			.send({ email: 'loginUser@email.com', password: 'passwd123' })
			.expect(200);

		expect(response.body.message).toBe('Login ok');
	});

	test('Attempting login with invalid credentials should fail', async () => {
		const response = await request(app)
			.post('/api/v1/auth/login')
			.send({
				email: 'loginUser@email.com',
				password: 'wrong_password',
			})
			.expect(401);
		
		expect(response.body.message).toBe('An error occured')
		expect(response.body.error).toBe('Email or password is invalid')
	});
});

/* eslint-disable no-undef */
const request = require('supertest');

const { app } = require('../src/index');

beforeEach(() => {
	// Placeholder
});

describe('GET /', () => {
	test('Should respond 200 & status OK', async () => {
		const response = await request(app).get('/').expect(200);

		expect(response.body.status).toBe('Ok');
	});
});



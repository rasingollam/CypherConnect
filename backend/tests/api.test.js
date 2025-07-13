const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {
  it('should return a 200 response for the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  // Add more tests for other API endpoints here
});
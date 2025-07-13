const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {
  it('should return a 200 response for the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should execute a Cypher write query', async () => {
    const query = "CREATE (n:TestNode {name: 'Test'}) RETURN n";
    const response = await request(app)
      .post('/api/cypher/write')
      .send({ query })
      .set('Accept', 'application/json');
    console.log('Query:', query);
    // Unpack and display the node properties if present
    if (
      response.body &&
      response.body.result &&
      Array.isArray(response.body.result) &&
      response.body.result[0] &&
      response.body.result[0].n &&
      response.body.result[0].n.properties
    ) {
      console.log('Returned Node Properties:', response.body.result[0].n.properties);
    } else {
      console.log('Response:', response.body);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('result');
  });
});
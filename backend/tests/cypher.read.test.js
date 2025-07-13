const request = require('supertest');
const app = require('../src/app');

describe('Cypher Read Endpoint', () => {
  it('should read all nodes and relationships', async () => {
    const response = await request(app)
      .get('/api/cypher/read')
      .set('Accept', 'application/json');
    // Unpack and display each node's properties
    if (
      response.body &&
      response.body.result &&
      Array.isArray(response.body.result)
    ) {
      response.body.result.forEach((item, idx) => {
        if (item.n && item.n.properties) {
          console.log(`Node ${idx}:`, item.n.properties);
        }
        if (item.r) {
          console.log(`Relationship ${idx}:`, item.r);
        }
        if (item.m && item.m.properties) {
          console.log(`Related Node ${idx}:`, item.m.properties);
        }
      });
    } else {
      console.log('Read Response:', response.body);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('result');
    expect(Array.isArray(response.body.result)).toBe(true);
  });
});
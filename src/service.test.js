const request = require('supertest');
const app = require('./service'); // Path to your service.js

describe('Service.js API Endpoints', () => {
  // Test for the root endpoint
  test('GET / should return welcome message and version', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'welcome to JWT Pizza');
    expect(res.body).toHaveProperty('version');
  });

  // Test for the API Docs endpoint
  test('GET /api/docs should return API docs with version, endpoints, and config', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('endpoints');
    expect(res.body).toHaveProperty('config');
  });

  // Test for unknown endpoint handling
  test('GET /unknown should return 404 for unknown endpoint', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'unknown endpoint');
  });

  // Test error handling middleware
  test('Error handling middleware should return proper error response', async () => {
    app.use((req, res, next) => {
      const error = new Error('Test error');
      error.statusCode = 500;
      next(error);
    });

    const res = await request(app).get('/api/order');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Test error');
  });
});

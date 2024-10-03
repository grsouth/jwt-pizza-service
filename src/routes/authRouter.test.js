const request = require('supertest');
const app = require('../service');  // Adjust the path as necessary

describe('Auth Router', () => {
  test('POST /api/auth/login should return 400 for missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: '',  // Simulate missing username
      password: 'password123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Missing required fields');
  });

  test('POST /api/auth/login should return 401 for invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'invalidUser',
      password: 'wrongPassword',
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});

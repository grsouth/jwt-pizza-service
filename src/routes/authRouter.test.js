const request = require('supertest');
const app = require('./service'); // Assuming your routes are registered here

describe('Auth Router', () => {
  // Test for a successful login
  test('POST /api/auth/login should return a token for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'validUser',
      password: 'validPassword'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  // Test for invalid credentials
  test('POST /api/auth/login should return 401 for invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'invalidUser',
      password: 'wrongPassword'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  // Test for expired tokens (or other token validation)
  test('GET /api/auth/protected should return 401 for expired token', async () => {
    const expiredToken = 'expiredTokenExample';
    const res = await request(app)
      .get('/api/auth/protected')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Token expired');
  });
});

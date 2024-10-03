const request = require('supertest');
const app = require('../service');

const testUser = { name: 'pizza diner', email: 'reg@test.com', password: 'a' };

beforeAll(async () => {
  // Generate a random test email for each run
  testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
  await request(app).post('/api/auth').send(testUser);
});

test('login', async () => {
  const loginRes = await request(app).put('/api/auth').send(testUser);
  expect(loginRes.status).toBe(200);
  expect(loginRes.body.token).toMatch(/^[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*$/);

  const { email, name, roles } = { ...testUser, roles: [{ role: 'diner' }] };
  expect(loginRes.body.user).toMatchObject({ email, name, roles });
});

// Test for missing email during login
test('should return 400 for missing email during login', async () => {
    const res = await request(app).put('/api/auth').send({
      password: 'password123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Missing required fields');
  });
  
  // Test for invalid email format during login
  test('should return 400 for invalid email format during login', async () => {
    const res = await request(app).put('/api/auth').send({
      email: 'invalidemail',
      password: 'password123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid email format');
  });
  
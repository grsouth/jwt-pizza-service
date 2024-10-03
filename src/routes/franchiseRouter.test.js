const request = require('supertest');
const app = require('../service');     // Adjust path if needed
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config'); // Import jwtSecret from your config

describe('Franchise Router', () => {
  const token = jwt.sign({ id: 'testUserId', role: 'user' }, jwtSecret, { expiresIn: '1h' });

  test('POST /api/franchise should create a new franchise', async () => {
    const res = await request(app)
      .post('/api/franchise')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Franchise',
        location: 'City Center',
        owner: 'John Doe',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('franchiseId');
  });

  test('POST /api/franchise should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/franchise')
      .set('Authorization', `Bearer ${token}`)
      .send({
        location: 'City Center',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Missing required fields');
  });

  test('PUT /api/franchise/:id should return 404 for non-existent franchise', async () => {
    const res = await request(app)
      .put('/api/franchise/999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Nonexistent Franchise',
        location: 'Nowhere',
      });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Franchise not found');
  });
});

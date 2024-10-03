const request = require('supertest');
const app = require('../service');     // Adjust path if needed
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config'); // Import jwtSecret from your config

describe('Order Router', () => {
  const token = jwt.sign({ id: 'testUserId', role: 'user' }, jwtSecret, { expiresIn: '1h' });

  test('POST /api/order should create a new order', async () => {
    const res = await request(app)
      .post('/api/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        pizzaType: 'Margherita',
        size: 'Large',
        quantity: 1,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('orderId');
  });

  test('POST /api/order should return 400 for invalid pizza size', async () => {
    const res = await request(app)
      .post('/api/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        pizzaType: 'Margherita',
        size: 'Extra Large',  // Invalid size
        quantity: 1,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid pizza size');
  });

  test('GET /api/order/:id should return 404 for non-existent order', async () => {
    const res = await request(app)
      .get('/api/order/999')  // Non-existent order ID
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Order not found');
  });
});

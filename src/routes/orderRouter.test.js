const request = require('supertest');  // Import Supertest to handle requests
const app = require('../service');     // Adjust path if needed
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config'); // Import jwtSecret from your config

describe('Order Router', () => {
  // Generate a valid JWT token before running the tests
  const token = jwt.sign({ id: 'testUserId', role: 'user' }, jwtSecret, { expiresIn: '1h' });

  // Test for creating an order successfully
  test('POST /api/order should create a new order', async () => {
    const res = await request(app)
      .post('/api/order')
      .set('Authorization', `Bearer ${token}`)  // Add the token here
      .send({
        pizzaType: 'Margherita',
        size: 'Large',
        quantity: 1,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('orderId');
  });

  // Test for invalid order (missing fields)
  test('POST /api/order should return 400 for invalid data', async () => {
    const res = await request(app)
      .post('/api/order')
      .set('Authorization', `Bearer ${token}`)  // Add the token here
      .send({
        pizzaType: 'Margherita', // Missing required fields
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Missing order details');
  });

  // Test for retrieving an order
  test('GET /api/order/:id should return the order details', async () => {
    const res = await request(app)
      .get('/api/order/123')
      .set('Authorization', `Bearer ${token}`);  // Add the token here
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('pizzaType');
  });
});

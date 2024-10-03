const request = require('supertest');
const app = require('../service');

const testUser = { name: 'order diner', email: 'order@test.com', password: 'a' };
let testUserAuthToken;

beforeAll(async () => {
  // Generate a random test email for each run
  testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
  const registerRes = await request(app).post('/api/auth').send(testUser);
  testUserAuthToken = registerRes.body.token;
});

test('POST /api/order should create a new order', async () => {
  const res = await request(app)
    .post('/api/order')
    .set('Authorization', `Bearer ${testUserAuthToken}`)
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
    .set('Authorization', `Bearer ${testUserAuthToken}`)
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
    .set('Authorization', `Bearer ${testUserAuthToken}`);
  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty('message', 'Order not found');
});

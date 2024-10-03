const request = require('supertest');
const app = require('../service');
const { DB, Role } = require('../database/database');

let adminAuthToken;

beforeAll(async () => {
  // Create an admin user directly in the database
  const adminUser = { name: 'admin user', email: Math.random().toString(36).substring(2, 12) + '@admin.com', password: 'a', roles: [{ role: Role.Admin }] };
  await DB.addUser(adminUser);
  
  // Get the admin user's auth token
  const loginRes = await request(app).put('/api/auth').send({ email: adminUser.email, password: 'a' });
  adminAuthToken = loginRes.body.token;
});

// test('POST /api/franchise should create a new franchise', async () => {
//   const res = await request(app)
//     .post('/api/franchise')
//     .set('Authorization', `Bearer ${adminAuthToken}`)
//     .send({
//       name: 'New Franchise',
//       location: 'City Center',
//       owner: 'John Doe',
//     });
//   expect(res.statusCode).toBe(201);
//   expect(res.body).toHaveProperty('franchiseId');
// });

// test('POST /api/franchise should return 400 for missing fields', async () => {
//   const res = await request(app)
//     .post('/api/franchise')
//     .set('Authorization', `Bearer ${adminAuthToken}`)
//     .send({
//       location: 'City Center',
//     });
//   expect(res.statusCode).toBe(400);
//   expect(res.body).toHaveProperty('message', 'Missing required fields');
// });

test('PUT /api/franchise/:id should return 404 for non-existent franchise', async () => {
  const res = await request(app)
    .put('/api/franchise/999')
    .set('Authorization', `Bearer ${adminAuthToken}`)
    .send({
      name: 'Nonexistent Franchise',
      location: 'Nowhere',
    });
  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty('message', 'unknown endpoint');
});

  

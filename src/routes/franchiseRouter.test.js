describe('Franchise Router', () => {
    // Test for creating a new franchise
    test('POST /api/franchise should create a new franchise', async () => {
      const res = await request(app).post('/api/franchise').send({
        name: 'New Franchise',
        location: 'City Center',
        owner: 'John Doe',
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('franchiseId');
    });
  
    // Test for fetching franchise details
    test('GET /api/franchise/:id should return franchise details', async () => {
      const res = await request(app).get('/api/franchise/123');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('location');
      expect(res.body).toHaveProperty('owner');
    });
  
    // Test for updating a franchise
    test('PUT /api/franchise/:id should update the franchise details', async () => {
      const res = await request(app).put('/api/franchise/123').send({
        name: 'Updated Franchise',
        location: 'New Location',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Franchise updated successfully');
    });
  
    // Test for deleting a franchise
    test('DELETE /api/franchise/:id should delete the franchise', async () => {
      const res = await request(app).delete('/api/franchise/123');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Franchise deleted successfully');
    });
  });
  
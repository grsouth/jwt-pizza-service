const { asyncHandler, StatusCodeError } = require('./endpointHelper');

describe('Endpoint Helper', () => {
  // Test for StatusCodeError
  test('StatusCodeError should correctly set message and statusCode', () => {
    const error = new StatusCodeError('Not Found', 404);
    expect(error.message).toBe('Not Found');
    expect(error.statusCode).toBe(404);
  });

  // Test for asyncHandler with successful execution
  test('asyncHandler should execute the function successfully', async () => {
    const mockFn = jest.fn((req, res) => res.status(200).json({ success: true }));
    const req = {}; // Mock request object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await asyncHandler(mockFn)(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  // Test for asyncHandler with error handling
  test('asyncHandler should pass errors to next middleware', async () => {
    const error = new Error('Test Error');
    const mockFn = jest.fn().mockRejectedValue(error);
    const req = {}; // Mock request object
    const res = {};
    const next = jest.fn();

    await asyncHandler(mockFn)(req, res, next);
    
    expect(next).toHaveBeenCalledWith(error);
  });
});

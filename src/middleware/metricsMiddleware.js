// src/middleware/metricsMiddleware.js
const os = require('os');

let requestCounts = {
  GET: 0,
  POST: 0,
  PUT: 0,
  DELETE: 0,
  total: 0,
};

let authAttempts = {
  successful: 0,
  failed: 0,
};

let activeUsers = new Set();

function requestTracker(req, res, next) {
  requestCounts[req.method] = (requestCounts[req.method] || 0) + 1;
  requestCounts.total += 1;
  next();
}

function authTracker(success) {
  if (success) {
    authAttempts.successful += 1;
  } else {
    authAttempts.failed += 1;
  }
}

function trackActiveUser(userId) {
  activeUsers.add(userId);
}

function getMetrics() {
  const cpuUsage = (os.loadavg()[0] / os.cpus().length) * 100;
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;

  return {
    requestCounts,
    authAttempts,
    activeUsers: activeUsers.size,
    cpuUsage: cpuUsage.toFixed(2),
    memoryUsage: memoryUsage.toFixed(2),
  };
}

function resetMetrics() {
  requestCounts = {
    GET: 0,
    POST: 0,
    PUT: 0,
    DELETE: 0,
    total: 0,
  };
  authAttempts = {
    successful: 0,
    failed: 0,
  };
  activeUsers.clear();
}

module.exports = {
  requestTracker,
  authTracker,
  trackActiveUser,
  getMetrics,
  resetMetrics,
};
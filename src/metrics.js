const os = require('os');
const { performance } = require('perf_hooks');

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
let pizzaMetrics = {
  sold: 0,
  creationFailures: 0,
  revenue: 0,
};

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

function trackPizzaSold(price) {
  pizzaMetrics.sold += 1;
  pizzaMetrics.revenue += price;
}

function trackPizzaCreationFailure() {
  pizzaMetrics.creationFailures += 1;
}

function getCpuUsagePercentage() {
  const cpuUsage = (os.loadavg()[0] / os.cpus().length) * 100;
  return cpuUsage.toFixed(2);
}

function getMemoryUsagePercentage() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsage = (usedMemory / totalMemory) * 100;
  return memoryUsage.toFixed(2);
}

function getMetrics() {
  const cpuUsage = getCpuUsagePercentage();
  const memoryUsage = getMemoryUsagePercentage();

  return {
    requestCounts,
    authAttempts,
    activeUsers: activeUsers.size,
    cpuUsage,
    memoryUsage,
    pizzaMetrics,
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
  pizzaMetrics = {
    sold: 0,
    creationFailures: 0,
    revenue: 0,
  };
}

function sendMetricsPeriodically(period) {
    const timer = setInterval(() => {
      try {
        const buf = new MetricBuilder();
        httpMetrics(buf);
        systemMetrics(buf);
        userMetrics(buf);
        purchaseMetrics(buf);
        authMetrics(buf);
  
        const metrics = buf.toString('\n');
        this.sendMetricToGrafana(metrics);
      } catch (error) {
        console.log('Error sending metrics', error);
      }
    }, period);
  }

module.exports = {
  requestTracker,
  authTracker,
  trackActiveUser,
  trackPizzaSold,
  trackPizzaCreationFailure,
  getMetrics,
  resetMetrics,
  sendMetricsPeriodically,
};
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

class MetricBuilder {
  constructor() {
    this.metrics = [];
  }

  addMetric(name, value) {
    this.metrics.push(`${name} ${value}`);
  }

  toString(separator = '\n') {
    return this.metrics.join(separator);
  }
}

function httpMetrics(buf) {
  buf.addMetric('http_requests_total', requestCounts.total);
  buf.addMetric('http_requests_get', requestCounts.GET);
  buf.addMetric('http_requests_post', requestCounts.POST);
  buf.addMetric('http_requests_put', requestCounts.PUT);
  buf.addMetric('http_requests_delete', requestCounts.DELETE);
}

function systemMetrics(buf) {
  buf.addMetric('cpu_usage_percentage', getCpuUsagePercentage());
  buf.addMetric('memory_usage_percentage', getMemoryUsagePercentage());
}

function userMetrics(buf) {
  buf.addMetric('active_users', activeUsers.size);
}

function purchaseMetrics(buf) {
  buf.addMetric('pizzas_sold', pizzaMetrics.sold);
  buf.addMetric('pizza_creation_failures', pizzaMetrics.creationFailures);
  buf.addMetric('revenue', pizzaMetrics.revenue);
}

function authMetrics(buf) {
  buf.addMetric('auth_attempts_successful', authAttempts.successful);
  buf.addMetric('auth_attempts_failed', authAttempts.failed);
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

class Metrics {
  constructor() {
    this.config = require('./config.json');
  }

  sendMetricToGrafana(metricPrefix, httpMethod, metricName, metricValue) {
    const metric = `${metricPrefix},source=${this.config.source},method=${httpMethod} ${metricName}=${metricValue}`;

    fetch(`${this.config.url}`, {
      method: 'post',
      body: metric,
      headers: { Authorization: `Bearer ${this.config.userId}:${this.config.apiKey}` },
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Failed to push metrics data to Grafana');
        } else {
          console.log(`Pushed ${metric}`);
        }
      })
      .catch((error) => {
        console.error('Error pushing metrics:', error);
      });
  }
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
  Metrics,
};
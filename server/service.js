const express = require('express');

const { env } = require('../config');

const { logger } = require('../server/lib/loggers');

const ServiceRegistry = require('./lib/ServiceRegistry');

const service = express();

// eslint-disable-next-line no-unused-vars
module.exports = (config) => {
  const log = logger();

  const serviceRegistry = new ServiceRegistry(log);

  // Add a request logging middleware in development mode
  if (env === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);

      return next();
    });
  }

  service.put(
    '/register/:serviceName/:serviceVersion/:servicePort',
    (req, res) => {
      const { serviceName, serviceVersion, servicePort } = req.params;

      const ip = req.socket.remoteAddress.includes('::') ? `[${req.socket.remoteAddress}]` : req.socket.remoteAddress;

      const serviceKey = serviceRegistry.register(serviceName, serviceVersion, ip, servicePort);

      return res.json({ result: serviceKey });
    },
  );

  service.delete(
    '/register/:serviceName/:serviceVersion/:servicePort',
    (req, res) => {
      const { serviceName, serviceVersion, servicePort } = req.params;

      const ip = req.socket.remoteAddress.includes('::') ? `[${req.socket.remoteAddress}]` : req.socket.remoteAddress;

      serviceRegistry.unregister(serviceName, serviceVersion, ip, servicePort);

      return res.json({ result: true });
    },
  );

  service.get('/find/:serviceName/:serviceVersion', (req, res) => {
    const { serviceName, serviceVersion } = req.params;

    const svc = serviceRegistry.find(serviceName, serviceVersion);

    if (!svc) {
      return res.status(404).json({ result: 'service not found' });
    }

    return res.json(svc);
  });

  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};

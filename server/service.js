const express = require('express');

const ServiceRegistry = require('./lib/ServiceRegistry');

const service = express();

module.exports = (config) => {
  const log = config.log();

  const serviceRegistry = new ServiceRegistry(log);

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);

      return next();
    });
  }

  service.put(
    '/register/:serviceName/:serviceVersion/:servicePort',
    (req, res) => {
      const { serviceName, serviceVersion, servicePort } = req.params;

      //  @TODO : check if req.connection is deprecated and find solution
      const ip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

      const serviceKey = serviceRegistry.register(serviceName, serviceVersion, ip, servicePort);

      return res.json({ result: serviceKey });
    },
  );

  service.delete(
    '/register/:serviceName/:serviceVersion/:servicePort',
    (req, res) => {
      const { serviceName, serviceVersion, servicePort } = req.params;

      const ip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

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

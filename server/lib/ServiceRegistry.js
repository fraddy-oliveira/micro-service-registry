const semver = require('semver');

class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 30;
  }

  register(serviceName, serviceVersion, serviceIp, servicePort) {
    this.cleanUp();

    const key = serviceName + serviceVersion + serviceIp + servicePort;

    if (!this.services[key]) {
      this.services[key] = {};

      this.services[key].name = serviceName;

      this.services[key].version = serviceVersion;

      this.services[key].ip = serviceIp;

      this.services[key].port = servicePort;

      this.services[key].timestamp = Math.floor(Date.now() / 1000);

      this.log.debug(
        `New service is registered with name: ${serviceName}, version: ${serviceVersion} at ${serviceIp}:${servicePort}`,
      );
    } else {
      this.services[key].timestamp = Math.floor(Date.now() / 1000);

      this.log.debug(
        `Update service with name: ${serviceName}, version: ${serviceVersion} at ${serviceIp}:${servicePort}`,
      );
    }

    return key;
  }

  unregister(name, version, ip, port) {
    const key = name + version + ip + port;

    if (Object.hasOwnProperty.call(this.services, key)) {
      //  service exists
      delete this.services[key];

      this.log.debug(
        `Unregister service with name: ${name}, version: ${version} at ${ip}:${port}`,
      );
    }

    return true;
  }

  find(name, version) {
    this.cleanUp();

    const candidates = Object.values(this.services)
      .filter(servive => servive.name === name && semver.satisfies(servive.version, version));

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  cleanUp() {
    const now = Math.floor(Date.now() / 1000);

    const cleanedSvc = [];

    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout <= now) {
        cleanedSvc.push(this.services[key]);

        this.log.debug(
          `Removed service with name: ${this.services[key].name}, version: ${this.services[key].version} at ${this.services[key].ip}:${this.services[key].port}`,
        );

        delete this.services[key];
      }
    });

    return cleanedSvc;
  }
}

module.exports = ServiceRegistry;

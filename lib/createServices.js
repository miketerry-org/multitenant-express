// createServices.js:

"use strict";

async function createServices(config, services) {
  // Throw error if config is not an object
  if (!config || typeof config !== "object") {
    throw new Error(`"config" must be an object`);
  }

  // Throw error if services is not an object
  if (!services || typeof services !== "object") {
    throw new Error(`"services" must be an object`);
  }

  // Create and assign all services
  for (const key of Object.keys(services)) {
    // Prevent overwriting existing properties in config
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      throw new Error(
        `Cannot assign service "${key}": property already exists on config object`
      );
    }

    // Create the service using the create function passed as the property value
    const service = await services[key](config);

    // Assign the service to the config object
    config[key] = service;
  }

  return config; // Optional: return updated config
}

module.exports = createServices;

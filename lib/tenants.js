// tenants.js:

"use strict";

// Load all necessary modules
const fs = require("fs");
const path = require("path");
const SecretEnv = require("topsecret-env");
const findFiles = require("./findFiles");
const createServices = require("./createServices");

class Tenants {
  // Private fields
  #list = [];
  #encryptKey;
  #schema;
  #services;

  constructor(encryptKey, services = {}, schema = []) {
    // Ensure the encryption key is defined and the correct length
    if (encryptKey && encryptKey.length === 64) {
      this.#encryptKey = encryptKey;
    } else {
      throw new Error(
        "Tenants.constructor requires a valid encryption key of length 64"
      );
    }

    this.#services = services;
    this.#schema = schema;
  }

  find(hostname) {
    return this.#list.find(
      item => hostname.toLowerCase() === item.hostname.toLowerCase()
    );
  }

  async loadFile(filename) {
    // Load config object from environment file
    const config = SecretEnv.loadFromFile(
      filename,
      this.#encryptKey,
      this.#schema
    );

    // Throw error if schema validation fails
    if (config.errors && config.errors.length > 0) {
      throw new Error(`${filename}: ${config.errors.join(", ")}`);
    }

    // Create and attach all services to the config
    await createServices(config, this.#services);

    // Add config to tenant list
    this.#list.push(config);
  }

  async loadFiles(filemask, startDir = process.cwd()) {
    const files = findFiles(filemask, startDir);

    // Use for...of to properly await async operations
    for (const filename of files) {
      await this.loadFile(filename);
    }
  }

  middleware(req, res, next) {
    // Use hostname to find tenant
    const tenant = this.find(req.hostname);

    // if tenant found then assign tenant to request
    if (tenant) {
      req.tenant = tenant;
      next();
    } else {
      next(new Error(`Tenant Not Found (${req.hostname})`));
    }
  }

  get count() {
    return this.#list.length;
  }
}

module.exports = Tenants;

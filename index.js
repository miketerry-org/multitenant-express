// index.js:

"use strict";

// load all necessary modules
const findFiles = require("./lib/findFiles");
const { serverLog, setServerLog } = require("./lib/serverlog");
const Tenants = require("./lib/tenants");

// export the tenants class
module.exports = { findFiles, serverLog, setServerLog, Tenants };

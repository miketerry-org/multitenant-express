// index.js:

"use strict";

// load all necessary modules
const Tenants = require("./lib/tenants");
const findFiles = require("./lib/findFiles");

// export the tenants class
module.exports = { Tenants, findFiles };

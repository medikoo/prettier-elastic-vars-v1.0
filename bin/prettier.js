"use strict";

const proxyquire = require("proxyquire");

module.exports = proxyquire("prettier/bin/prettier", { "../index": require("../") });

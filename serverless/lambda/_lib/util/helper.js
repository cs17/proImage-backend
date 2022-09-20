const Ajv = require('ajv'); // validate Json Schema
const dynamoDb = require('../aws/dynamoDb.js');
const uuid = require('uuid');


// Validate payload using AJV
exports.validateAJV = function (payload, schema) {
  let ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(payload);
  return valid;
};

// Do convert dynamoDb marshall object to normal JSON format
exports.unmarshall = function (obj) {
  return dynamoDb.unmarshall(obj);
};

// Generate uuid.v4
exports.generateUuid = function () {
  return uuid.v4();
};

exports.getTimestamp = function () {
  return Date.now();
};


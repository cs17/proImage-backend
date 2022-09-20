const Ajv = require('ajv'); // validate Json Schema

// Validate payload using AJV
exports.validateAJV = function (payload, schema) {
  let ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(payload);
  return valid;
};

exports.getTimestamp = function () {
  return Date.now();
};

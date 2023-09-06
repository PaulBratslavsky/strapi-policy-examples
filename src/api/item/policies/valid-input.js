"use strict";
const Joi = require("joi");
const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;

/**
 * `valid input` policy
 */

module.exports = (policyContext, config, { strapi }) => {
  // Get request body data
  const requestData = policyContext.request.body["data"];

  // Create a schema to validate request body data
  const schema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string()
      .pattern(/^([a-zA-Z0-9]{4}-){3}[a-zA-Z0-9]{4}$/) // Test is the format structured as (four groups of alphanumeric characters separated by hyphens)
      .required(),
    price: Joi.number().required(),
  });

  // Validate the request body data
  const { error } = schema.validate(requestData);

  if (error) {
    throw new PolicyError("Invalid input data", error.details);
  } else {
    // Allow request to proceed if request body data is valid
    return true;
  }
};

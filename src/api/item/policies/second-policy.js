'use strict';

/**
 * `second-policy` policy
 */

module.exports = (policyContext, config, { strapi }) => {
    // Add your own logic here.
    strapi.log.info('In second-policy policy.');
    console.log("############### API POLICY #################");

    const canDoSomething = true;

    if (canDoSomething) {
      return true;
    }

    return false;
};

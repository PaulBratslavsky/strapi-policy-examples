'use strict';

/**
 * `first-policy` policy
 */

module.exports = (policyContext, config, { strapi }) => {
    // Add your own logic here.
    strapi.log.info('In first-policy policy.');
    console.log("############### GLOBAL POLICY #################");
    
    const canDoSomething = true;

    if (canDoSomething) {
      return true;
    }

    return false;
};

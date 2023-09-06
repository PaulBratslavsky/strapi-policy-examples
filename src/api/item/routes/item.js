'use strict';

/**
 * item router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter("api::item.item", {
  config: {
    create: {
      policies: ["api::item.valid-input"],
    },
    find: {
      policies: [
        // point to a registered policy
        "global::first-policy",
        "api::item.second-policy",

        // point to a registered policy with custom configuration
        // { name: "global::policy-name", config: {} },

        // pass policy function directly
        // (policyContext, config, { strapi }) => {
        //   return true;
        // },
      ],
    },
  },
});

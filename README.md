# Advanced Customization for Strapi Policies

## Introduction

Strapi is a headless content management system for building backend applications. With JavaScript coding knowledge, Strapi allows you to customize your backend with [policies](https://docs.strapi.io/developer-docs/latest/development/backend-customization/policies.html), [middlewares](https://docs.strapi.io/developer-docs/latest/development/backend-customization/middlewares.html), [controllers](https://docs.strapi.io/developer-docs/latest/development/backend-customization/controllers.html), [services](https://docs.strapi.io/developer-docs/latest/development/backend-customization/services.html), [models](https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html), and [webhooks](https://docs.strapi.io/developer-docs/latest/development/backend-customization/webhooks.html)

In this article, you’ll learn more about policies, and how to use them. So, Let’s get started!

## Table of content

1. Overview of policies
2. Global policies
   1. Creating global policies with `strapi generate`
   2. Creating global policies manually
   3. Configuring global policies in routes
3. Creating API policies
   1. Creating API policies with `strapi generate`
   2. Creating API policies manually
   3. Configuring API policies in routes
4. Creating plugin policies
   1. Creating plugin policies with `strapi generate`
   2. Creating plugin policies manually
   3. Configuring plugin policies in routes
5. A real-world example using policies

## Overview of policies

Imagine you want to make a deposit to a bank, so you go into the building. As you may know, banks have policies that restrict the things you can bring into the building. Therefore, the bank may have security checkpoints at its entrance to ensure no one violates any policy.

If you violate a policy, the security tells you to exit the building and fix the issue, maybe worse. If you don’t violate a policy, the security allows you into the building.

In computing, requests carry data to the server through routes. The routes are entry points for requests. Strapi allows you to create policies that checks these requests at a route before they get into the server. A request must not violate any policy to be successful.

In technical terms, a policy is a function that defines a rule for all requests entering the server. If the function returns true, the request is allowed into the server. If the function returns false, the request is rejected. You can create policies with your own custom rules.

In Strapi, you can create the following types of policies:

- Global policies without a scope.
- API policies scoped to an API.
- Plugin policies scoped to Plugins.

## Global policies

You can initialize a global policy in the following ways:

- Using the [strapi generate](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-generate) command.
- Manually creating the JavaScript file.

**Initializing a global policy**

To initialize a global policy run the `yarn strapi generate` command and follow these steps:

1. Select **policy**.
2. Type in the name of your policy.
3. Select **Add policy to root of project**.

```bash
  $ strapi generate
  ? Strapi Generators policy - Generate a policy for an API
  ? Policy name first-policy
  ? Where do you want to add this policy? Add policy to root of project
  ✔  ++ /policies/first-policy.js
  ✨  Done in 28.56s.
```

I just created a global policy name `first-policy`, it is created inside the `src/policies` folder.

Here is the example of the file that is automatically created:

```javascript
module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In first-policy policy.");

  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
```

I am also going to add another `console.log` in our policy so it is easier to spot.

```javascript
strapi.log.info("In first-policy policy.");
console.log("############### GLOBAL POLICY #################");
```

Let's create a basic `content-type` that we will use later in our `real life` example, but let's set it up now so we can test test out the `global` policy that we just created.

If you haven't created your Strapi app you can do so now by using the `npx create-strapi-app@latest my-project --quickstart`. Once your project is created, follow the steps below.

**Step 1: Set up the items content-type**
The first thing you need to do is, set up the content-type to store data. The content-type in this project will have `name`, `code`, and `price` fields.

To create the content-type, follow these steps:

1. Click **Content-Type Builder** to access the interface for creating APIs.
2. Click **+ Create new collection type** to create a new API.
3. Type “Item” as the display name, then click **Continue**.
4. Create the “name” field with the following properties:
   1. data type as **Text**
   2. field name as “name”
   3. text size as **Short text**
5. Click **+ Add another field** to add another field.
6. Create the “code” field with the following properties:
   1. data type as **Text**
   2. field name as “code”
   3. text size as **Short text**.
7. Click **+ Add another field** to add another field.
8. Create the “price” field with the following properties:
   1. data type as **Number**
   2. field name as “price”
   3. number format as **decimal**
9. Click **Finish** to finish adding fields to the content-type.
10. Click **Save** to register your content-type.

Go ahead and add at least one item and publish.

**Step 2: Set up the routes**
To continue with the project, you need to set up an API that allows external applications access and manipulate the data in `Item`. The API will provide routes for getting, adding, modifying, and deleting data.

To set up the routes for `Item`, follow the below steps:

1. Open **Settings**.
2. Click **Roles** under **Users & permissions**.
3. Click **public** to access the configuration for public users.
   ![The Roles menu](https://paper-attachments.dropbox.com/s_4EF14A9B714E9E599C352327CE86A3A6DA51B51C13B813C58E5662644DF385D2_1662726825707_Screenshot+from+2022-09-09+13-30-27.png)

4. Toggle the **item** dropdown.
5. Click on **Select All** to allow public users fetch, change, add, and delete data from `item`.
6. Click **save** for the changes to take effect.
   ![All of Item’s routes are enabled](https://paper-attachments.dropbox.com/s_4EF14A9B714E9E599C352327CE86A3A6DA51B51C13B813C58E5662644DF385D2_1662726795257_image.png)

We can now test our endpoint either using something like **Insomnia** or **Postman**.

Or if we are making a `GET` request we can test it in the browser locally by navigating to `http://localhost:1337/api/items`.

Here is the response we get.

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Desk",
        "code": "98932",
        "price": 10.99,
        "createdAt": "2023-09-06T17:01:53.934Z",
        "updatedAt": "2023-09-06T17:01:54.508Z",
        "publishedAt": "2023-09-06T17:01:54.507Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

**Registering a global policy to a route**
Now let's register our policy that we just created to a route. We can do this you in the route’s API configuration file.

Follow these steps to configure a global policy:

1.  Open `./src/api/item/routes/item.js`.
2.  Add the policy to a route in `createCoreRouter`.

```javascript
const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::item.item", {
  config: {
    find: {
      policies: [
        // point to a registered policy
        "global::first-policy",

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
```

Let's make another `GET` request to `http://localhost:1337/api/items` so we can see if we are getting the console log message from our policy.

We should now see our log from our policy in our console now.

```bash
[2023-09-06 12:15:03.337] info: In first-policy policy.
############### GLOBAL POLICY #################
[2023-09-06 12:15:03.341] http: GET /api/items (13 ms) 200
```

**Did you know?**

You can use the `yarn strapi console` to start the our Strapi app in an interactive shell environment.

Then you can see all the available **policies** by running the `strapi.policies`.

You should see the following output.

```javascript
{
  'admin::isAuthenticatedAdmin': [Function (anonymous)],
  'admin::hasPermissions': {
    name: 'admin::hasPermissions',
    validator: [Function: wrappedValidator],
    handler: [Function: handler]
  },
  'admin::isTelemetryEnabled': {
    name: 'admin::isTelemetryEnabled',
    validator: [Function: wrappedValidator],
    handler: [Function: handler]
  },
  'global::first-policy': [Function (anonymous)],
  'plugin::content-manager.has-draft-and-publish': [Function (anonymous)],
  'plugin::content-manager.hasPermissions': {
    name: 'plugin::content-manager.hasPermissions',
    validator: [Function: wrappedValidator],
    handler: [Function: handler]
  }
}
```

You can see our **global** policy that we created.

**Creating a global policy manually**
All what the `yarn strapi generate` command does is, create `./src/policies/[policy-name].js` file with boilerplate, nothing else.

You can recreate the action manually.

To initialize a policy, create a `./src/policies/[policy-name].js` file. You can optionally paste a boilerplate to get you started quickly. For example:

```javascript
"use strict";

module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In the policy.");

  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
```

> Global policies use `global::policy-name` for referencing. Other types of policies have different references.

Let's now look how to create API policies.

## API policies

Like Global policies you can initialize an API policy in similar ways:

1. Using the [strapi generate](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-generate) command.
2. Manually creating the JavaScript file.

**Initializing an API policy with** `yarn strapi generate`
To initialize an API policy run the `yarn strapi generate` command and follow these steps:

1. Select **policy.**
2. Write the name of your policy: second-policy
3. Select **Add policy to an existing API**.
4. Select the API you want to generate your policy in: item

```bash
  $ strapi generate
  ? Strapi Generators policy - Generate a policy for an API
  ? Policy name second-policy
  ? Where do you want to add this policy? Add policy to an existing API
  ? Which API is this for? item
  ✔  ++ /api/item/policies/second-policy.js
  ✨  Done in 22.58s.
```

You can find your newly generate policy in the `src/api/item/policies/second-policy.js`.

Here is what the file looks like.

```javascript
module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In second-policy policy.");

  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
```

I am also going to add another `console.log` in our policy so it is easier to spot.

```javascript
strapi.log.info("In second-policy policy.");
console.log("############### API POLICY #################");
```

**Registering an API policy in a route**
The steps to configure an API policy is similar to configuring a global policy:

Open `./src/api/item/routes/item.js`.

We have already added our global policy here. Let's now add our API policy.

If you don't remember the exact name of your policy. You can find it with our previous trick.

Start the Strapi console with `yarn strapi console` and type the following `strapi.policies` and pres **enter**.

You should see the following list:

```javascript
{
  'admin::isAuthenticatedAdmin': [Function (anonymous)],
  'admin::hasPermissions': {
    name: 'admin::hasPermissions',
    validator: [Function: wrappedValidator],
    handler: [Function: handler]
  },
  'admin::isTelemetryEnabled': {
    name: 'admin::isTelemetryEnabled',
    validator: [Function: wrappedValidator],
    handler: [Function: handler]
  },
  'global::first-policy': [Function (anonymous)],
  'api::item.second-policy': [Function (anonymous)],
  'plugin::content-manager.has-draft-and-publish': [Function (anonymous)],
  'plugin::content-manager.hasPermissions': {
    name: 'plugin::content-manager.hasPermissions',
    validator: [Function: wrappedValidator],
    handler: [Function: handler]
  }
}
```

Nice, you can now see our second policy `api::item.second-policy`.

Here is our updated `./src/api/item/routes/item.js` file.

```javascript
const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::item.item", {
  config: {
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
```

Let's make another `GET` request to `http://localhost:1337/api/items` so we can see if we are getting the console log message from our second policy.

We should now see our log from our both policies.

```bash
[2023-09-06 12:55:43.107] info: In first-policy policy.
############### GLOBAL POLICY #################
[2023-09-06 12:55:43.108] info: In second-policy policy.
############### API POLICY #################
[2023-09-06 12:55:43.111] http: GET /api/items (19 ms) 200
```

> Routes in scope of an API policy uses `policy-name` for to reference the policy. To reference policies registered in another API, use `api::api-name.policy-name`.

**Creating an API policy manually**
To manually create a policy, create a `.src/api/[api-name]/policies/[policy-name].js` file. Optionally, paste this boilerplate into the file to get started:

```javascript
"use strict";

module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In the policy.");

  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
```

## Plugin policies

Policies can also be scoped to plugins. These types of policies are called plugin policies. An example of a plugin policy is `isAuthenticated` from [Users & Permissions plugin](https://docs.strapi.io/user-docs/latest/users-roles-permissions/introduction-to-users-roles-permissions.html). When a route uses the `isAuthenticated` policy, any user sending a request needs to be authenticated for the request to be successful.

There are two ways of initialize a plugin policy:

1. Using the [strapi generate](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-generate) command.
2. Manually creating the JavaScript file.

**Initializing a plugin policy with** `strapi generate`
Run `strapi generate`, follow these steps to initialize a plugin policy:

1. Select **policy.**
2. Write the name of your policy.
3. Select **Add policy to an existing plugin**.
4. Select the plugin you want to register it in.

**Creating manually**
To manually create a policy, create a `./src/plugins/[plugin-name]/policies/` file. Optionally, you can paste this boilerplate to get you started:

```javascript
"use strict";

module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In the policy.");

  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
```

**Configuring in routes**
Configuring a plugin policy is similar to both API and global policies:

1.  Open `./src/api/[api-name]/routes/router.js`.
2.  Create an object in `createCoreRouter`.
3.  Add the policy to the `policies` array.

```javascript
const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::restaurant.restaurant", {
  config: {
    find: {
      policies: [
        // point to a registered policy
        "plugin::plugin-name.policy-name",

        // point to a registered policy with custom configuration
        { name: "plugin::plugin-name.policy-name", config: {} },

        // pass policy function directly
        (policyContext, config, { strapi }) => {
          return true;
        },
      ],
    },
  },
});
```

> To reference a plugin policy, use `plugin::plugin-name.policy-name`.

You can also add plugin policies to api routes inside your plugin, but this is beyond the scope of this tutorial. Since we would need to have a plugin created with api end point.

## Returning messages on policy failure

Just getting a request error when a policy fails is not enough in some cases. Some you might want to know why the policy failed.

An example is a route with several policies attached to it. By default, all policy failures respond in the same exact way, meaning that tracing the failure will be difficult.

Another example is policies that fail on more than one condition. Without a detailed error message you can’t easily tell which condition made the policy fail.

You can configure a policy to return messages when it fails. The process is simple, and here’s how you can do it:

1. Import the `PolicyError` class into the policy file:

```javascript
const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;
```

1. Throw a `PolicyError` object with the error message and error details:

```javascript
if (error) {
  throw new PolicyError(error.message, error.details);
} else {
  return true;
}
```

## A real-world example using policies

Imagine you are building a backend application for a store. You are currently working on an API to fetch, create, and modify items on the backend. To create an item, the backend requires the item’s name, code, and price.

The following steps will guide you through building the project and policy. So initialize a new Strapi project and follow the steps that follows.

We are going to use our current Strapi app with our `item` collection type.

**Build the policy**

The policy for this project will make sure that any data sent to `Item`'s `create` route follows a format. The format will be described using a schema.

If you don’t know what a schema is, It is a narration of how data should be structured.

The schema will be built with a JavaScript library called **Joi**. If you don’t understand how Joi works, you can read [this API reference](https://joi.dev/api/?v=17.6.0). To install Joi, open the project’s root folder in your terminal, then run any of these commands:

```bash
  # yarn
  $ yarn add joi

  # npm
  $ npm install joi
```

Now, you can start working on the the policy.

First, create a new API policy in `src/api/item/policies`. You can name the file `valid-input.js`.

Now, paste the code below into the policy ``\./src/api/item/policies/valid-input.js`:

```javascript
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
```

The way this policy works is:

1. On line 11, the program collects the request data.
2. From line 14 - line 22, a schema with the desired object format is constructed.
3. On line 25, the schema validated the request data and an `error` object is destructured.
4. Line 27 - line 32, stops the request from proceeding if there is an error.
5. Line 32 - line 36, allows the request to proceed if there is an error.

**Let's Register Our Policy**

To register the policy follow these steps:

Open the `./src/api/item/routes/item.js` file and add our newly created policy.

Inside the `config` object, let's add the following.

```javascript
create: {
  policies: ["api::item.valid-input"],
}
```

The `item.js` file should look like the following:

```javascript
const { createCoreRouter } = require("@strapi/strapi").factories;

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
```

**Let's test our new policy**

Since we will be making a `POST` request we will need to use **Postman** or **Insomnia** to test our endpoint.

I will be using **Insomnia**.

Inside **Insomnia** I will make the following request.

insert image

Notice how I am leaving all the fields blank.

When we run the following request we will get the following error triggered by our policy.

```json
{
  "data": null,
  "error": {
    "status": 403,
    "name": "PolicyError",
    "message": "Invalid input data",
    "details": [
      {
        "message": "\"name\" is not allowed to be empty",
        "path": ["name"],
        "type": "string.empty",
        "context": {
          "label": "name",
          "value": "",
          "key": "name"
        }
      }
    ]
  }
}
```

Let's now make a request will all fields filled.

We will pass the following data:

```json
{
  "data": {
    "name": "test",
    "code": "12e3-4r3d-35te-345a",
    "price": "9.99"
  }
}
```

Now that we pass valid data, we return a `200` status code and our item is created.

Nice.  Our policy is working.  Great job.

## Conclusion

In this article, I gave an overview of Strapi policies, with the different types of policies, and how they work. I also try to give a tutorial on building a real-life policy. If you find anything hard to understand, let me know in the comments.

If you want to learn more about Strapi policies, be sure to check the following links:

- [Three ways to use Strapi policies - Strapi blog](https://strapi.io/blog/three-ways-to-use-strapi-policies)
- [Policies - Strapi doc](https://docs.strapi.io/developer-docs/latest/development/backend-customization/policies.html#implementation)
- [Strapi Internals: Customizing the Backend [Part 1 - Models, Controllers & Routes]](https://strapi.io/blog/strapi-internals-customizing-the-backend-part-1-models-controllers-and-routes)
- [Strapi Internals: Customizing the Backend [Part 2 - Policies, Webhooks & Utilities]](https://strapi.io/blog/strapi-internals-customizing-the-backend-part-2-policies-webhooks)

You can find the example project [here](https://github.com/PaulBratslavsky/strapi-policy-examples)


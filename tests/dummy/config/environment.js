'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      parseUrl: 'http://localhost:1337',
      parseNamespace: 'parse',
      applicationId: '3f5db4fb851d3ad146476ab003de0f89FARM',
      restApiId: '3f5db4fb851d3ad146476ab003de0f89',
      keyMappings:{
        farm: 'Farm',
        buyer: '_User',
        seller: '_User',
        admin:'_User'
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.APP = {
      parseUrl: 'http://localhost:1337',
      parseNamespace: 'parse',
      applicationId: '3f5db4fb851d3ad146476ab003de0f89FARM',
      restApiId: '3f5db4fb851d3ad146476ab003de0f89'
    }
  }

  if (environment === 'test') {
    ENV.APP = {
      parseUrl: 'http://localhost:1337',
      parseNamespace: 'parse',
      applicationId: '3f5db4fb851d3ad146476ab003de0f89FARM',
      restApiId: '3f5db4fb851d3ad146476ab003de0f89',
      keyMappings:{
        farm: 'Farm',
        buyer: '_User',
        seller: '_User',
        admin:'_User'
      }
    }
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};

import {
    start
  } from 'ember-qunit'
  import config from 'ember-get-config'
  import {
    setApplication
  } from '@ember/test-helpers';
  import Application from '@ember/application'
  import Resolver from 'ember-resolver'
  
  import loadInitializers from 'ember-load-initializers'
  
  
  const App = Application.extend({
    modulePrefix: config.modulePrefix,
    Resolver
  });
  loadInitializers(App, config.modulePrefix)
  setApplication(App.create(config.APP))
  start()
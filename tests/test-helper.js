import {
  start
} from 'ember-qunit'
import config from '../config/environment'
import {
  setApplication
} from '@ember/test-helpers';
import Application from '@ember/application'
import Resolver from 'ember-resolver'

import loadInitializers from 'ember-load-initializers'

/*
import Adapter from 'ember-parse-server-adapter/adapters/application'
import Serializer from 'ember-parse-server-adapter/serializers/application'
import DateTransform from 'ember-parse-server-adapter/transforms/date'
import FileTransform from 'ember-parse-server-adapter/transforms/file'
import GeopointTransform from 'ember-parse-server-adapter/transforms/geopoint'
import ParseUser from 'ember-parse-server-adapter/models/parse-user'
*/


const App = Application.extend({
  modulePrefix: config.modulePrefix,
  Resolver
});
/*
App.initializer({
  name: 'ember-parse-server-adapter',
  after: 'ember-data',
  initialize: function (container, app) {
    app.deferReadiness()
    let configuredAdapter = Adapter.extend({
      host: config.APP.parseUrl,
      'headers.X-Parse-Application-Id': config.APP.applicationID,
      'headers.X-Parse-REST-API-Key': config.APP.restApiID
    })
    
  
    container.register('adapter:-parse', configuredAdapter)
    //container.inject('adapter', 'parseAdapter', 'adapter:-parse')
    container.register('serializer:-parse', Serializer)
    //container.inject('serializer', 'parseSerializer', 'serializer:-parse')
    container.register('transform:parse-date', DateTransform)
    //container.inject('transform', 'parseDateTransform', 'transform:parse-date')
    container.register('transform:parse-file', FileTransform)
    //container.inject('transform', 'parseFileTransform', 'transform:parse-file')
    container.register('transform:parse-geo-point', GeopointTransform)
    //container.inject('transform', 'parseGeoPointTransform', 'transform:parse-geo-point')
    container.register('model:parse-user', ParseUser)
    //container.inject('model', 'parseUserModel', 'model:parse-user')
    app.advanceReadiness()
  }
})*/

loadInitializers(App, config.modulePrefix)
setApplication(App.create(config.APP))
start()

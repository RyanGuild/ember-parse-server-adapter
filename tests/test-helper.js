import {
  start
} from 'ember-qunit';
import Application from '../app';
import config from '../config/environment';
import Adapter from 'ember-parse-server-adapter/adapters/application'
import Serializer from 'ember-parse-server-adapter/serializers/application'
import {
  setApplication
} from '@ember/test-helpers';

setApplication(Application.extend({
  ready: function () {
    this.register('adapter:application', Adapter)
    this.register('serializer:-parse', Serializer)
  }
}).create(config.APP));

start();

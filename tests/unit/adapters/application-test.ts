import {
  setupTest
} from 'ember-qunit';

import {
  test,
  module
} from 'qunit'

import {
  getApplication
} from '@ember/test-helpers'

import Ember from 'ember'

import Adapter from 'ember-parse-server-adapter/adapters/application'
import Serializer from 'ember-parse-server-adapter/serializers/application'
import DateTransform from 'ember-parse-server-adapter/transforms/date'
import FileTransform from 'ember-parse-server-adapter/transforms/file'
import GeopointTransform from 'ember-parse-server-adapter/transforms/geopoint'
import ParseUser from 'ember-parse-server-adapter/models/parse-user'

import { getContext } from '@ember/test-helpers';
import DS from 'ember-data';


module('Unit | Adapter | application', function (hooks){
  setupTest(hooks)

  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:-parse')
    assert.ok(adapter);
  })

  test('default serializer ser', function(assert){
    let adapter :DS.Adapter = this.owner.lookup('adapter:-parse')
    assert.equal('-parse', adapter.defaultSerializer)
  })

  //test('')

})
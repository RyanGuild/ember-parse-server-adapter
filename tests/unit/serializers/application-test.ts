import {
  setupTest,
  only,
  skip,
  test
} from 'ember-qunit';

import Pretender from 'pretender'

import QUnit, {
  module
} from 'qunit'
import DS from 'ember-data';
import serializer from 'dummy/serializers/application';
import { typeOf } from '@ember/utils'
import { run } from '@ember/runloop'

import Ember from 'ember'
import { async } from 'rsvp';
var server :Pretender

module('Unit | Serializer | application', function(hooks){
  setupTest(hooks)
  

  test('it exists', function (assert) {
    let serializer = this.owner.lookup('serializer:-parse')
    assert.ok(serializer);
  })

  test('it accepts array responses', async function(assert) {
    let store :DS.Store = this.owner.lookup('service:store')
    let result = await store.findAll('farm')
    assert.ok(result)
  })

  test('it accepts single responses', async function(assert) {
    let store :DS.Store = this.owner.lookup('service:store')
    let result = await store.findRecord('farm', "gl9YhArZFM")
    assert.ok(result)
  })

  test('it can save a record', async function(assert) {
    let store :DS.Store = this.owner.lookup('service:store')
    let geoTrans :DS.Transform = this.owner.lookup('transform:parse-geo-point')
    let record :DS.Model = run(() => {
      return store.createRecord('farm', {
          "farmName": "Farm Fresh",
          "locationTitle": "Uttara University English Department Sector 4, Dhaka 1230, Bangladesh",
          "location": geoTrans.deserialize({
              "__type": "GeoPoint",
              "latitude": 23.865421599999998,
              "longitude": 90.402953
          }, {}),
          "admin": {
              "__type": "Pointer",
              "className": "_User",
              "objectId": "AJHmMs0KZ2"
          }
        })
    })

    console.log('record created')

    record = await record.save()

    console.log('record saved')

    console.log(Object.entries(record))
    assert.ok(record)
  })

})
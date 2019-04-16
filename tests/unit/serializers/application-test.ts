import {
  setupTest, 
} from 'ember-qunit';

import QUnit, {
  test,
  module
} from 'qunit'
import DS from 'ember-data';
import serializer from 'dummy/serializers/application';

import Ember from 'ember'

module('Unit | Adapter | application', function(hooks){
  setupTest(hooks)
  

  test('it exists', function (assert) {
    let serializer = this.owner.lookup('serializer:-parse')
    assert.ok(serializer);
  })

  test('it normalizes', function(assert){
    assert.expect(1);
    let store :DS.Store = this.owner.lookup('service:store');

    var basicJson = {
      id: 1,
      testname: 'test'
    }
    var resultJson = {
      data:{
        id:'',
        type: '',
        attributes: {
          testname: 'test'
        },
        relationships: {

        }
      }
    }
    //@ts-ignore
    var model :DS.Model = DS.Model.extend({ testname: DS.attr('string') })

    var serializer = this.owner.lookup('serializer:-parse')
    var result = serializer.normalize(model, basicJson)
    assert.deepEqual(result.data.relationships, resultJson.data.relationships);
  })

  test('it converts back', function(assert){
    assert.expect(1);
    let store :DS.Store = this.owner.lookup('service:store');

    var basicJson = {
      id: 1,
      testname: 'test'
    }
    var resultJson = {
      data:{
        id:'1234',
        type: 'test',
        attributes: {
          testname: 'test'
        },
        relationships: {

        }
      }
    }

    //@ts-ignore
    var model :DS.Model = DS.Model.extend({ testname: DS.attr('string') })

    var serializer :DS.Serializer = this.owner.lookup('serializer:-parse')
    var result = serializer.normalizeResponse(store, model, resultJson, 1234, 'get')
    assert.deepEqual(Object.keys(result), Object.keys(basicJson))
  })

})
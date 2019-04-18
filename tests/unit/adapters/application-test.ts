import {
  test,
  setupTest
} from 'ember-qunit';

import {
  module
} from 'qunit'
import DS from 'ember-data';


module('Unit | Adapter | application', function (hooks){
  setupTest(hooks)

  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:-parse')
    assert.ok(adapter);
  })

  test('default serializer = -parse', function(assert){
    let adapter :DS.Adapter = this.owner.lookup('adapter:-parse')
    assert.equal('-parse', adapter.defaultSerializer)
  })


})
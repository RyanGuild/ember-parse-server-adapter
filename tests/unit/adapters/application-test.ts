import {
  test,
  setupTest,
  only
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

  test('it queryies', async function(assert){
    let store = this.owner.lookup('service:store')
    let result = store.query('farm', {where: {admin: {__type: 'Pointer', className: '_User', objectId: 'ndDOIChdxm'}}})
    assert.ok(result)
  })
})
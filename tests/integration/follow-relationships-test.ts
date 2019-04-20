import {
    test,
    setupTest,
    only
  } from 'ember-qunit';
  
  import {
    module
  } from 'qunit'
  import DS from 'ember-data';
import {typeOf} from '@ember/utils'
  
  
  module('Integration | Adapter | follow relationships', function (hooks){
    setupTest(hooks)
  
    test('get farms admin', async function (assert) {
        let store :DS.Store = this.owner.lookup('service:store')
        let farm :DS.Model = await store.findRecord('farm',"vDR96Ftn2T")
        console.log('farm found:', JSON.stringify(farm.toJSON()))
        await farm.belongsTo('admin').reload()
        let admin :DS.Model = await farm.get('admin')
        console.log('farm admin:', JSON.stringify(admin.toJSON()))
        assert.ok(admin)
    })
  })
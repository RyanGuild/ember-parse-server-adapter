import {
  test,
  setupTest,
  only
} from 'ember-qunit';

import {
  module
} from 'qunit'
import DS from 'ember-data';
import Parse from 'parse'

import config from 'ember-get-config'


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

  test('adapter save', async function(assert){
    //parseUrl: 'http://localhost:1337',
    //parseNamespace: 'parse'
    //applicationId: '3f5db4fb851d3ad146476ab003de0f89FARM',
    //restApiId: '3f5db4fb851d3ad146476ab003de0f89'
    Parse.initialize(config.APP.applicationId, config.APP.restApiId)
    Parse.serverURL = `${config.APP.parseUrl}/${config.APP.parseNamespace}`
    console.log('logging in')
    await Parse.User.logIn("Rguildfarm6", "PIP-insGr8Xp",{})

    //ember data
    let adapter :DS.Adapter = this.owner.lookup('adapter:-parse')
    let store = this.owner.lookup('service:store')
    let record = store.createRecord('farm')
    record.set('farmName', 'test123')
    await record.save()

    //parse
    let parseType = Parse.Object.extend('Farm')
    let query = new Parse.Query(parseType)
    query.equalTo('farmName', 'test123')

    let value = await query.find()
    console
    value.forEach((val) => {
      if(!!val) assert.equal(record.get('farmName'), val.get('farmName'))
      console.log('test passed')
      console.log(record)
    })

    value.forEach(item => {
      item.destroy()
    })
  })

  test('adapter find all',  async function(assert){
    //parseUrl: 'http://localhost:1337',
    //parseNamespace: 'parse'
    //applicationId: '3f5db4fb851d3ad146476ab003de0f89FARM',
    //restApiId: '3f5db4fb851d3ad146476ab003de0f89'
    Parse.initialize(config.APP.applicationId, config.APP.restApiId)
    Parse.serverURL = `${config.APP.parseUrl}/${config.APP.parseNamespace}`
    console.log('logging in')
    await Parse.User.logIn("Rguildfarm6", "PIP-insGr8Xp",{})

    let store = this.owner.lookup('service:store')
    let data = await store.findAll('farm')
    console.log(data)
    assert.ok(data)
  })

  test('parse is Initialized', function(assert){
    assert.expect(3)
    assert.ok(Parse)
    assert.equal(Parse.applicationId, config.APP.applicationId)
    assert.equal(Parse.javaScriptKey, config.APP.restAPIKey)
  })
})
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

  test('it queries', async function(assert){
    Parse.initialize(config.APP.applicationId, config.APP.restApiId)
    Parse.serverURL = `${config.APP.parseUrl}/${config.APP.parseNamespace}`
    console.log('logging in')
    await Parse.User.logIn("Rguildfarm6", "PIP-insGr8Xp",{})

    let store = this.owner.lookup('service:store')
    let data
    console.log('querying')
    try{ 
      data = await store.query('farm', {$admin: "5P1ocnCcZA"})
      console.log('query returned:', data)
    } catch (e){
      console.error('query error:',e)
    }
    

    console.log(data)
    assert.ok(data)
  })

  test('it creates relations', async function(assert){
    Parse.initialize(config.APP.applicationId, config.APP.restApiId)
    Parse.serverURL = `${config.APP.parseUrl}/${config.APP.parseNamespace}`
    console.log('logging in')
    let store = this.owner.lookup('service:store')
    await Parse.User.logIn("Rguildfarm6", "PIP-insGr8Xp",{})

    let user = Parse.User.current()
    let normalized = {data: store.normalize('parse-user', user)}
    let userRecord = store.push(normalized)
    let farmRecord = store.createRecord('farm')
    farmRecord.set('admin', userRecord)
    await farmRecord.save()
    userRecord.set('farm', farmRecord)
    await userRecord.save()
    let admin = await farmRecord.get('admin')

    
    console.log('userRecord:',userRecord)
    console.log('admin:', admin)
    assert.equal(userRecord.id, admin.id)

  })
})
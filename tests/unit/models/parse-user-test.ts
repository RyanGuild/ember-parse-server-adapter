import { module } from 'qunit';
import { setupTest, only, test } from 'ember-qunit';
import { run } from '@ember/runloop';
import Ember from 'ember';
import ParseUser from 'ember-parse-server-adapter/models/parse-user'
import DS from 'ember-data';


module('Unit | Model | parse user', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = run(() => store.createRecord('parse-user', {}))
    assert.ok(model);
  });

  test('has properties', async function(assert) {
    let store = this.owner.lookup('service:store');
    let username = `${Math.random()}`
    let password =  `test${Math.random()}`
    let email =  `${Math.random()}@test.com`
    let model = await run(() => {
      return store.modelFor('parse-user').signup(store, {username, password, email})
    })

    assert.equal(model.get('username'), username)
    assert.equal(model.get('password'), password)
    assert.equal(model.get('email'), email)
    assert.equal(model.get('emailVerified'), undefined)
  });
});
import {
    test,
    setupApplicationTest,
    only
  } from 'ember-qunit';
import { visit, currentURL, click, fillIn, find, settled } from '@ember/test-helpers';
import {
    module
} from 'qunit'
  import DS from 'ember-data';
import {typeOf} from '@ember/utils'
import { async } from 'rsvp';
  
  
module('Integration | User | login', function (hooks){
    setupApplicationTest(hooks)
  
    test('it can visit test route', async function (assert) {
        await visit('/test')
        assert.equal(currentURL(), '/test');
    })

    test("it can signup a user", async function(assert){
        let email = `${Math.random()}@test.com`
        let username = `${Math.random()}`
        let password = `${Math.random()}`
        await visit('/test')
        let emailIn = find('#input-email') || 'fail'
        let userIn = find('#input-user') || 'fail'
        let passIn = find('#pass') || 'fail'
        let sub = find('#subbutton') || 'fail'
        await fillIn(emailIn, email)
        await fillIn(userIn, username)
        await fillIn(passIn, password)
        await click(sub)
        await settled()
        assert.ok(true)
    })
})
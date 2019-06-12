import Controller from '@ember/controller'
import parseUser from 'ember-parse-server-adapter/models/parse-user'
import { debug } from '@ember/debug'

export default Controller.extend({
    user:null,
    actions:{
        async onClick(){
            console.log('handler triggered')
            debug('handler triggered')
            let username = this.get('model.username')
            let password = this.get('model.password')
            let email = this.get('model.email')
            let user = await this.store.modelFor('parse-user').signup(this.store,{username, password, email})
            this.set('user', user)
            debug('user created')
        }
      }
})
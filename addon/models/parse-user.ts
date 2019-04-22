import DS from 'ember-data'
import RSVP, {
  reject
} from 'rsvp'
import {
  isEmpty
} from '@ember/utils'
import Ember from 'ember'
import Mixin from '@ember/object/mixin';


var ParseUser = DS.Model.extend(
  {
    username: DS.attr('string'),
    password: DS.attr('string'),
    email: DS.attr('string'),
    emailVerified: DS.attr('boolean'),
    sessionToken: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
  }
);

ParseUser.reopenClass({
  requestPasswordReset: function (email) {
    var adapter = this.get('store').adapterFor('parse-user'),
      data = {
        email: email
      };

    return adapter.ajax(adapter.buildURL('requestPasswordReset'), 'POST', {
      data: data
    })['catch'](
      function (response) {
        return reject(response.responseJSON);
      }
    );
  },

  login: function (store, data) {
    let model = this
    let adapter = store.adapterFor('parse-user')
    let serializer = store.serializerFor('parse-user')

    if (isEmpty(this.typeKey)) {
      throw new Error('Parse login must be called on a model fetched via store.modelFor');
    }

    return adapter.ajax(adapter.buildURL('login'), 'GET', {
      data: data
    }).then(
      function (response) {
        serializer.normalize(model, response);
        var record = store.push(model, response);
        return record;
      },
      function (response) {
        return reject(response.responseJSON);
      }
    );
  },

  signup: function (store :DS.Store, data: {username: string, email: string, password: string}): RSVP.Promise<DS.Model | any[]> {
    let model :DS.Model = this
    //@ts-ignore
    let adapter :DS.RESTAdapter = store.adapterFor('parse-user')
    //@ts-ignore
    let serializer :DS.RESTSerializer = store.serializerFor('parse-user')

    return new RSVP.Promise((resolve, _) => { 
    let newUserUrl = adapter.buildURL('parseUser')
    console.log('new user url:', newUserUrl)
    //@ts-ignore
    adapter.ajax(newUserUrl, 'POST', {
      data: data
    })
    .then(
      function (response) {
        console.log('new user json response:', JSON.stringify(response))
        let merged = Object.assign({}, data, response)
        console.log('new user:', JSON.stringify(merged))
        let normalized = store.normalize('parse-user', merged)
        console.log('normalized:', JSON.stringify(normalized))
        //@ts-ignore
        let record = store.push(normalized)
        resolve(record)
      })
    .catch(
      function(e :ExceptionInformation){
        throw `failed to create user: ${e}`
      })
    })
  }

})


export default ParseUser


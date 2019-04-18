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
    var adapter = this.get('store').adapterFor(this),
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
    var model = this,
      adapter = store.adapterFor(model),
      serializer = store.serializerFor(model);

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
    //@ts-ignore
    adapter.ajax(adapter.buildURL('parseUser'), 'POST', {
      data: data
    })
    .then(
      function (response) {
        let merged = Object.assign({}, data, response)
        //@ts-ignore
        let record = store.push(store.normalize('parse-user', merged))
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


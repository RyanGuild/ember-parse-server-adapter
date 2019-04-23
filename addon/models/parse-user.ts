import DS from 'ember-data'
import RSVP from 'rsvp'
import {debug} from '@ember/debug'


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
    let adapter = this.get('store').adapterFor('parse-user')
    let data = {email: email};

    return new RSVP.Promise((resolve, reject) => {
      adapter.ajax(adapter.buildURL('requestPasswordReset'), 'POST', {
        data: data
      })
      .catch((response) => reject(response.responseJSON))
    })
  },


  login: function (store, data) {
    let model = this
    let adapter = store.adapterFor('parse-user')
    let serializer = store.serializerFor('parse-user')

    return new RSVP.Promise((resolve, reject) => {
      adapter.ajax(adapter.buildURL('login'), 'GET', {
        data: data
      }).then((response) => {
        serializer.normalize(model, response);
        var record = store.push(model, response);
        resolve(record)
      })
      .catch((response) => reject(response.responseJSON))
    })
  },


  signup: function (store :DS.Store,data: {username: string,email: string,password: string}): RSVP.Promise<DS.Model | any[]> 
    {
      let model :DS.Model = this
      //@ts-ignore
      let adapter :DS.RESTAdapter = store.adapterFor('parse-user')
      //@ts-ignore
      let serializer :DS.RESTSerializer = store.serializerFor('parse-user')

      return new RSVP.Promise((resolve, reject) => { 
        let newUserUrl = adapter.buildURL('parse-user')
        console.log('new user url:', newUserUrl)
        //@ts-ignore
        adapter.ajax(newUserUrl, 'POST', {
          data: data
        })
        .then((response) => {
            let merged = Object.assign({}, data, response)
            let normalized = store.normalize('parse-user', merged)
            //@ts-ignore
            let record = store.push(normalized)
            resolve(record)
          })
        .catch((e) => reject(e))
      })
    }
})


export default ParseUser


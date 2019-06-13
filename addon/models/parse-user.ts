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
    return new RSVP.Promise(async (resolve, reject) => { 
      let {username, password, email} = data 
      try{
        let user = await Parse.User.logIn(username, password, {})
        let normalized = {data: store.normalize('parse-user', user)}
        let record = store.push(normalized)
        resolve(record)
      } catch(e) {
        reject(e)
      }
    })
  },


  signup: function (store :DS.Store,data: {username: string,email: string,password: string}): RSVP.Promise<DS.Model | any[]> 
    {
      return new RSVP.Promise(async (resolve, reject) => { 
        let {username, password, email} = data 
        try{
          let user = await Parse.User.signUp(username, password, {})
          let normalized = {data: store.normalize('parse-user', user)}
          let record = store.push(normalized)
          resolve(record)
        } catch(e) {
          reject(e)
        }
      })
    },

    functions: function (store :DS.Store, functionName: String, data :any){
      //@ts-ignore
      let adapter = store.adapterFor('parse-user')
  
      let parseUrl = adapter.get('host')
      let namespace = adapter.get('namespace')
  
      let params = Object.entries(data)
        .map(([key, item]) => ([key,encodeURIComponent(JSON.stringify(item))]))
        .reduce((collector, [key, item]) => (collector += `${key}=${item}&`), '?')
  
      let url = `${parseUrl}/${namespace}/functions/${functionName}${params}`.slice(0,-1)
  
      return new RSVP.Promise((resolve, reject) => {
        adapter.ajax(url, 'POST', data)
          .then((response) => {
            resolve(response)
          })
          .catch((response) => {
            reject(response)
          })
      })
    }
})


export default ParseUser


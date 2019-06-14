import DS from 'ember-data'
import Parse from 'parse'
import {capitalize, camelize} from '@ember/string'
import RSVP from 'rsvp'
import { resolve } from 'path';
import {computed} from '@ember/object'
import config from 'ember-get-config'


export default DS.Adapter.extend({
  host: config.APP.parseUrl,
  namespace: config.APP.parseNamespace,
  defaultSerializer: '-parse',
  classesPath: 'classes',
  headers: {
    'X-Parse-Application-Id': config.APP.applicationId,
    'X-Parse-REST-API-Key': config.APP.restApiId
  },
  sessionToken: computed('headers.X-Parse-Session-Token',
    //@ts-ignore
    function (key: any, value: String): String {
      if (arguments.length < 2) {
        return this.get('headers.X-Parse-Session-Token') as String;
      } else {
        this.set('headers.X-Parse-Session-Token', value);
        return value as String;
      }
    }),
  init(){
    Parse.initialize(config.APP.applicationId, config.APP.restAPIKey)
    Parse.serverURL = `${this.get('host')}/${this.get('namespace')}`
  },

  findRecord(store:DS.Store, type:DS.Model, id:string, snapshot: DS.Snapshot){
    return new RSVP.Promise(
      (function (resolve, reject){
        let searchObject = Parse.Object.extend(this.parseClassName(snapshot.modelName))
        let query = new Parse.Query(searchObject)
        query.get(id)
        .then((data) => resolve(data))
        .catch((data) => reject(data))
      }).bind(this)
    )
    
  },
  createRecord(store: DS.Store, type:DS.Model, snapshot: DS.Snapshot){
    //@ts-ignore
    let serializer = store.serializerFor(snapshot.modelName)
    return new RSVP.Promise(
      function (resolve, reject) {
        let saveObject = serializer.serialize(snapshot, {includeId: true})
        saveObject.save()
          .then((data) => resolve(data))
          .catch((data) => reject(data))
      }
    )
  },
  updateRecord(store: DS.Store, type:DS.Model, snapshot: DS.Snapshot){
    //@ts-ignore
    let serializer = store.serializerFor(snapshot.modelName)
    return new RSVP.Promise(
      async function (resolve, reject) {
        let saveObject = await serializer.serialize(snapshot, {includeId: true})
        saveObject.save()
          .then((data) => resolve(data))
          .catch((data) => reject(data))
      }
    )
  },
  deleteRecord(store: DS.Store, type:DS.Model, snapshot: DS.Snapshot){
    return new RSVP.Promise(
      (function (resolve, reject){
        let searchObject = Parse.Object.extend(this.parseClassName(snapshot.modelName))
        let query = new Parse.Query(searchObject)
        query.get(snapshot.id)
          .then((data) => {
            data.destroy()
              .then((myObject) => resolve()) 
              .catch((error) => reject(error));
          })
          .catch((data) => reject(data))
      }).bind(this)
    )
  },
  findAll(snapshotRecordArray :DS.SnapshotRecordArray<any>, type: DS.Model){
    return new RSVP.Promise(
      (function (resolve, reject){
        //@ts-ignore
        let searchObject = Parse.Object.extend(this.parseClassName(type.modelName))
        let query = new Parse.Query(searchObject)
        query.find()
        .then((data) => resolve(data))
        .catch((data) => reject(data))
      }).bind(this)
    )
  },
  query(store :DS.Store, type :DS.Model, queryData :any, recordArray :DS.AdapterPopulatedRecordArray<any>){
    return new RSVP.Promise(
      (function (resolve, reject){
        //@ts-ignore
        let searchObject = Parse.Object.extend(this.parseClassName(type.modelName))
        let query = new Parse.Query(searchObject)
        let queryEntries = Object.entries(queryData)
        RSVP.Promise.all(queryEntries.map(async ([key, value])=> {
            return new RSVP.Promise((ret,_) => {
              let ptr
              if(key[0] === '$'){
                let searchPtr = new Parse.Query(Parse.Object.extend(this.parseClassName(key.slice(1))))
                //@ts-ignore
                searchPtr.get(value as string)
                  .then((searchVal) => {
                    query.equalTo(key.slice(1), searchVal)
                    ret()
                  })
              } else {
                ptr = value
                query.equalTo(key, value)
                ret()
              }
          })
        }))
        .then(() => {
          query.find()
          .then((data) => {
            resolve(data)
          })
          .catch((data) => reject(data))
        })
      }).bind(this))
  },
  parseClassName(type): String {
    if ('parse-user' === type || 'admin' === type || 'seller' === type || 'buyer' === type) {
        return '_User';
    } else {
        return capitalize(camelize(type));
    }
  }
})
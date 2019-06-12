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
    console.warn(Parse.serverURL)
  },

  findRecord(store:DS.Store, type:DS.Model, id:string, snapshot: DS.Snapshot){
    return new RSVP.Promise(
      function (resolve, reject){
        let searchObject = Parse.Object.extend(snapshot.modelName)
        let query = new Parse.Query(searchObject)
        query.get(id)
        .then((data) => resolve(data))
        .catch((data) => reject(data))
      }
    )
    
  },
  createRecord(store: DS.Store, type:DS.Model, snapshot: DS.Snapshot){
    console.error(store, type, snapshot)
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
    console.error(store, type, snapshot)
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
  deleteRecord(store: DS.Store, type:DS.Model, snapshot: DS.Snapshot){
    return new RSVP.Promise(
      function (resolve, reject){
        let searchObject = Parse.Object.extend(this.parseClassName(snapshot.modelName))
        let query = new Parse.Query(searchObject)
        query.get(snapshot.id)
          .then((data) => {
            data.destroy()
              .then((myObject) => resolve()) 
              .catch((error) => reject(error));
          })
          .catch((data) => reject(data))
      }
    )
  },
  findAll(snapshotRecordArray :DS.SnapshotRecordArray<any>, type: DS.Model){
    return new RSVP.Promise(
      (function (resolve, reject){
        let searchObject = Parse.Object.extend(this.parseClassName(type.modelName))
        let query = new Parse.Query(searchObject)
        query.find()
        .then((data) => resolve(data))
        .catch((data) => reject(data))
      }).bind(this)
    )
  },
  query(){

  },
  parseClassName(type): String {
    return capitalize(camelize(type))
  },
})
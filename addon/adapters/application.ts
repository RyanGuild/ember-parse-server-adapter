import Ember from 'ember'
import DS from 'ember-data'
import { computed } from '@ember/object'
import RSVP from 'rsvp'
import { ModelRegistry } from 'ember-data/model'
import { typeOf } from '@ember/utils';
import {
  dasherize,
  capitalize,
  camelize
} from '@ember/string'

import config from 'ember-get-config'

export default DS.RESTAdapter.extend({
  host: config.APP.parseUrl,
  namespace: config.APP.parseNamespace,
  defaultSerializer:'-parse',
  classesPath:'classes',
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


  pathForType(type) {
    console.trace()
    console.log('pathForType:', type)
    if ('parseUser' === type || 'parse-user' === type) {
      return 'users';
    } else if ('login' === type) {
      return 'login';
    } else {
      return this.classesPath + '/' + this.parsePathForType(type);
    }
  },

  // Using TitleStyle is recommended by Parse
  // @TODO: test
  parsePathForType(type): String {
    console.log('make parse path:', type)
    return capitalize(camelize(type))
  },

  /**
   * Because Parse doesn't return a full set of properties on the
   * responses to updates, we want to perform a merge of the response
   * properties onto existing data so that the record maintains
   * latest data.
   */
  createRecord<k extends never>(store :DS.Store, type :ModelRegistry[k], record :DS.Snapshot<k>): RSVP.Promise<any> {
    console.log('createRecord type:', record.modelName)
    let serializer :DS.RESTSerializer = store.serializerFor(record.modelName)
    let adapter: DS.RESTAdapter = this
    let data :{} = serializer.serialize(record, {includeId: true});
    let url = adapter.buildURL(record.modelName, record.id)
    return new RSVP.Promise(
      function (resolve, reject) {
        adapter.ajax(url, 'POST', {
          data: data
        }).then(
          function (json) {
            console.log('response json:',JSON.stringify(json))
            let merged = Object.assign({},data, json)
            let formated = {}
            formated[url] = merged
            console.log('formated response:', formated)
            resolve(formated);
          },
          function (reason) {
            console.log('failure reason:',reason.responseJSON)
            reject(reason.responseJSON);
          }
        );
      });
  },

  /**
   * Because Parse doesn't return a full set of properties on the
   * responses to updates, we want to perform a merge of the response
   * properties onto existing data so that the record maintains
   * latest data.
   */
  updateRecord<k extends never>(store :DS.Store, type:ModelRegistry[k], record :DS.Snapshot<k>): RSVP.Promise<any> {
    console.log('updateRecord type:', type)
    let serializer :DS.RESTSerializer = store.serializerFor(record.modelName)
    let id = record.id
    let sendDeletes = false
    let deleteds = {}
    let adapter: DS.RESTAdapter = this

    let data = serializer.serialize(record, {includeId: true});
    
    console.log('data serialized for update')
    //@ts-ignore
    type.eachRelationship(function (key) {
      if (data[key] && data[key].deleteds) {
        deleteds[key] = data[key].deleteds;
        delete data[key].deleteds;
        sendDeletes = true;
      }
    });
    
    let url = adapter.buildURL(type, id)
    return new RSVP.Promise(function (resolve, reject) {
      if (sendDeletes) {
        adapter.ajax(url, 'PUT', {
          data: deleteds
        }).then(
          function () {
            console.log('deletes put')
            adapter.ajax(url, 'PUT', {
              data: data
            }).then(
              function (updates) {
                let formated = {}
                formated[url] = Object.assign({},data, updates)
                resolve(formated);
              },
              function (reason) {
                reject('Failed to save parent in relation: ' + reason.response.JSON);
              }
            );
          },
          function (reason) {
            reject(reason.responseJSON);
          }
        );

      } else {
        adapter.ajax(url, 'PUT', {
          data: data
        }).then(
          function (updates) {
            let formated = {}
            formated[url] = Object.assign({},data, updates)
            resolve(formated);
          },
          function (reason) {
            reject(reason.responseJSON);
          }
        );
      }
    });
  },

  parseClassName(key): String {
    console.debug('parseClass name:', Ember.String.capitalize(key))
    return Ember.String.capitalize(key);
  },

  /**
   * Implementation of a hasMany that provides a Relation query for Parse
   * objects.
   */
  findHasMany(store, record, relatedInfo): Ember.RSVP.Promise<any> {
    let adapter: DS.RESTAdapter = this
    var relatedInfo_ = JSON.parse(relatedInfo),
      query = {
        where: {
          '$relatedTo': {
            'object': {
              '__type': 'Pointer',
              'className': this.parseClassName(record.typeKey),
              'objectId': record.get('id')
            },
            key: relatedInfo_.key
          }
        }
      };

    // the request is to the related type and not the type for the record.
    // the query is where there is a pointer to this record.
    return adapter.ajax(adapter.buildURL(relatedInfo_.typeKey), "GET", {
      data: query
    });
  },

  /**
   * Implementation of findQuery that automatically wraps query in a
   * JSON string.
   *
   * @example
   *     this.store.find('comment', {
   *       where: {
   *         post: {
   *             "__type":  "Pointer",
   *             "className": "Post",
   *             "objectId": post.get('id')
   *         }
   *       }
   *     });
   */
  findQuery(store, type, query) {
    console.log('query', JSON.stringify([store, type, query]))
    let adapter: DS.RESTAdapter = this
    if (query.where && 'string' !== Ember.typeOf(query.where)) {
      query.where = JSON.stringify(query.where);
    }

    // Pass to _super()
    //@ts-ignore
    return adapter._super(store, type, query);
  },

  findRecord: function(store, type, id, snapshot){
    console.log('find record:', type.modelName, ':', id)
    let adapter: DS.RESTAdapter = this
    let url = adapter.buildURL(type.modelName, id)
    console.debug('find record url:', url)
    return new RSVP.Promise((resolve)=>{
      adapter
        .ajax(url, "GET")
        .then((data) => {
          let formated = {}
          formated[url] = data
          console.log("find response payload:", JSON.stringify(formated))
          resolve(formated)
        })
      }
    )
  },

  findAll: function(store, type, sinceToken, snapshotRecordArray) {
    console.log('find all:', type.modelName)
    let adapter: DS.RESTAdapter = this
    let url = adapter.buildURL(type.modelName)
    return new RSVP.Promise((resolve)=>{
      adapter
        .ajax(url, "GET")
        .then((data) => {
          let formated = {}
          formated[url] = data
          resolve(formated)
        })
      }
    )
  }
})

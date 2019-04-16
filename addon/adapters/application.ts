import Ember from 'ember'
import DS from 'ember-data'
import { computed } from '@ember/object'
import RSVP from 'rsvp'
import { ModelRegistry } from 'ember-data/model'

export default DS.RESTAdapter.extend({

  defaultSerializer:'-parse',
  classesPath:'classes',
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
    if ('parseUser' === type) {
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
    return Ember.String.capitalize(Ember.String.camelize(type));
  },

  /**
   * Because Parse doesn't return a full set of properties on the
   * responses to updates, we want to perform a merge of the response
   * properties onto existing data so that the record maintains
   * latest data.
   */
  createRecord<k extends never>(store :DS.Store, type :ModelRegistry[k], record :DS.Snapshot<k>): RSVP.Promise<any> {
    let serializer = store.serializerFor(type) as DS.Serializer
    let adapter: DS.RESTAdapter = this

    let data = serializer.serialize(record, {includeId: true});

    return new RSVP.Promise(function (resolve, reject) {
      adapter.ajax(adapter.buildURL(type), 'POST', {
        data: data
      }).then(
        function (json) {
          var completed = Ember.merge(data, json);
          resolve(completed);
        },
        function (reason) {
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
    let serializer = store.serializerFor(type) as DS.Serializer
    let id = record.id
    let sendDeletes = false
    let deleteds = {}
    let adapter: DS.RESTAdapter = this

    let data = serializer.serialize(record, {includeId: true});
    
    //@ts-ignore
    type.eachRelationship(function (key) {
      if (data[key] && data[key].deleteds) {
        deleteds[key] = data[key].deleteds;
        delete data[key].deleteds;
        sendDeletes = true;
      }
    });
    

    return new RSVP.Promise(function (resolve, reject) {
      if (sendDeletes) {
        adapter.ajax(adapter.buildURL(type, id), 'PUT', {
          data: deleteds
        }).then(
          function () {
            adapter.ajax(adapter.buildURL(type, id), 'PUT', {
              data: data
            }).then(
              function (updates) {
                // This is the essential bit - merge response data onto existing data.
                resolve(Ember.merge(data, updates));
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
        adapter.ajax(adapter.buildURL(type, id), 'PUT', {
          data: data
        }).then(
          function (json) {
            // This is the essential bit - merge response data onto existing data.
            resolve(Ember.merge(data, json));
          },
          function (reason) {
            reject(reason.responseJSON);
          }
        );
      }
    });
  },

  parseClassName(key): String {
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
    let adapter: DS.RESTAdapter = this
    if (query.where && 'string' !== Ember.typeOf(query.where)) {
      query.where = JSON.stringify(query.where);
    }

    // Pass to _super()
    //@ts-ignore
    return adapter._super(store, type, query);
  }
})
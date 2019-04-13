import Ember from 'ember'
import DS from 'ember-data'
import { computed } from '@ember/object'

export default class paresAdapter extends DS.RESTAdapter {

  defaultSerializer = '-parse'
  classesPath = 'classes'
  host: string;
  headers: {};


  sessionToken = computed('headers.X-Parse-Session-Token',
    //@ts-ignore
    function (key: any, value: String): String {
      if (arguments.length < 2) {
        return this.get('headers.X-Parse-Session-Token') as String;
      } else {
        this.set('headers.X-Parse-Session-Token', value);
        return value as String;
      }
    })

  constructor(applicationID, restApiID, parseUrl) {
    super();
    this.host = parseUrl
    this.headers = {
      'X-Parse-Application-Id': applicationID,
      'X-Parse-REST-API-Key': restApiID
    }
  }



  pathForType(type) {
    if ('parseUser' === type) {
      return 'users';
    } else if ('login' === type) {
      return 'login';
    } else {
      return this.classesPath + '/' + this.parsePathForType(type);
    }
  }

  // Using TitleStyle is recommended by Parse
  // @TODO: test
  parsePathForType(type): String {
    return Ember.String.capitalize(Ember.String.camelize(type));
  }

  /**
   * Because Parse doesn't return a full set of properties on the
   * responses to updates, we want to perform a merge of the response
   * properties onto existing data so that the record maintains
   * latest data.
   */
  createRecord(store, type, record): Ember.RSVP.Promise<any> {
    var serializer = store.serializerFor(type.typeKey),
      snapshot = record._createSnapshot(),
      data = {},
      adapter: DS.RESTAdapter = this;

    serializer.serializeIntoHash(data, type, snapshot, {
      includeId: true
    });

    return new Ember.RSVP.Promise(function (resolve, reject) {
      adapter.ajax(adapter.buildURL(type.typeKey), 'POST', {
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
  }

  /**
   * Because Parse doesn't return a full set of properties on the
   * responses to updates, we want to perform a merge of the response
   * properties onto existing data so that the record maintains
   * latest data.
   */
  updateRecord(store, type, record): Ember.RSVP.Promise<any> {
    var serializer = store.serializerFor(type.typeKey),
      snapshot = record._createSnapshot(),
      id = record.get('id'),
      sendDeletes = false,
      deleteds = {},
      data = {},
      adapter: DS.RESTAdapter = this;

    serializer.serializeIntoHash(data, type, snapshot, {
      includeId: true
    });

    type.eachRelationship(function (key) {
      if (data[key] && data[key].deleteds) {
        deleteds[key] = data[key].deleteds;
        delete data[key].deleteds;
        sendDeletes = true;
      }
    });

    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (sendDeletes) {
        adapter.ajax(adapter.buildURL(type.typeKey, id), 'PUT', {
          data: deleteds
        }).then(
          function () {
            adapter.ajax(adapter.buildURL(type.typeKey, id), 'PUT', {
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
        adapter.ajax(adapter.buildURL(type.typeKey, id), 'PUT', {
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
  }

  parseClassName(key): String {
    return Ember.String.capitalize(key);
  }

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
  }

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
}

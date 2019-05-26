import Ember from 'ember';
import DS from 'ember-data';
import Model from 'ember-data/model'
import {
  dasherize,
  capitalize,
  camelize
} from '@ember/string'
import {
  pluralize,
  singularize
} from 'ember-inflector'
import {
  typeOf
}
  from '@ember/utils'
import {
  merge
}
  from '@ember/polyfills'

import config from 'ember-get-config'

import DateTransforms from 'ember-parse-server-adapter/transforms/date'
import FileTransforms from 'ember-parse-server-adapter/transforms/file'
import GeoPointTransforms from 'ember-parse-server-adapter/transforms/geopoint'

const dateTrans = DateTransforms.create()
const fileTrans = FileTransforms.create()
const geoTrans = GeoPointTransforms.create()

export default DS.RESTSerializer.extend({

  primaryKey: 'objectId',

  typeForRoot: function (key) {
    console.debug('type for root', dasherize(singularize(key)))
    return dasherize(singularize(key));
  },

  /**
   * Because Parse only returns the updatedAt/createdAt values on updates
   * we have to intercept it here to assure that the adapter knows which
   * record ID we are dealing with (using the primaryKey).
   */
  extract: function (store, type, payload, id, requestType) {
    console.debug('extract:', JSON.stringify([type, payload, id, requestType]))

    if (id !== null && ('updateRecord' === requestType || 'deleteRecord' === requestType)) {
      payload[this.primaryKey] = id;
    }
    return this._super(store, type, payload, id, requestType);
  },

  extractAttributes: function (modelClass, resourceHash) {
    let attributes = {}
    Object.entries((resourceHash))
      .filter(([key, value]) => (value != null))
      .filter(([key, value]) => (typeof value != 'object' || (value as { __type: string }).__type != 'Pointer'))
      .forEach(([key, value]) => { attributes[key] = value })
    return attributes
  },

  extractRelationships: function (relationshipModelName, relationshipHash, relationshipOptions) {
    console.debug('extract relationships:', relationshipModelName.modelName)

    let pointers = Object
      .entries(relationshipHash)
      .filter(([key, value]) => (value != null))
      .filter(([key, value]) => value['__type'] == 'Pointer')

    let userPointers: Array<any> = pointers
      .filter(([key, value]) => value['className'] == '_User')

    if (userPointers.length != 0) {
      userPointers = userPointers
        .map(([key, value]) => ([
          key,
          {
            type: 'parse-user',
            id: value[this.get('primaryKey')]
          }
        ]))
    }

    let objectPointers: Array<any> = pointers
      .filter(([key, value]) => (value['className'] as string) != '_User')

    if (objectPointers.length != 0) {
      objectPointers = objectPointers
        .map(([key, value]) => ([
          key,
          {
            type: (value['className'] as string).toLowerCase(),
            id: value[this.get('primaryKey')]
          }
        ]))
    }

    let relationships = {}

    userPointers
      .concat(objectPointers)
      .forEach(([key, value]) => {
        relationships[key] = { data: value }
      })
    console.debug('relationships:', JSON.stringify(relationships))
    return relationships
  },

  /**
   * Extracts count from the payload so that you can get the total number
   * of records in Parse if you're using skip and limit.
   */
  extractMeta: function (store, type, payload) {
    console.debug('extract meta:', type.modelName)
    if (payload && payload.count) {
      store.setMetadataFor(type, {
        count: payload.count
      });
      delete payload.count;
    }
  },


  extractId: function (modelClass: Model, resourceHash: any): string | number {
    let id = resourceHash[this.get('primaryKey')] ? resourceHash[this.get('primaryKey')] : resourceHash['id']
    return id
  },

  /**
   * Special handling of the Parse relation types. In certain
   * conditions there is a secondary query to retrieve the "many"
   * side of the "hasMany".
   */
  normalizeRelationships: function (type, hash) {
    console.debug('normalize relationships:', JSON.stringify([type, hash]))
    let store = this.get('store')
    let serializer = this

    type.eachRelationship(function (key, relationship) {

      var options = relationship.options;

      // Handle the belongsTo relationships
      if (hash[key] && 'belongsTo' === relationship.kind) {
        hash[key] = hash[key].objectId;
      }

      // Handle the hasMany relationships
      if (hash[key] && 'hasMany' === relationship.kind) {

        // If this is a Relation hasMany then we need to supply
        // the links property so the adapter can async call the
        // relationship.
        // The adapter findHasMany has been overridden to make use of this.
        if (options.relation) {
          // hash[key] contains the response of Parse.com: eg {__type: Relation, className: MyParseClassName}
          // this is an object that make ember-data fail, as it expects nothing or an array ids that represent the records
          hash[key] = [];

          // ember-data expects the link to be a string
          // The adapter findHasMany will parse it
          if (!hash.links) {
            hash.links = {};
          }

          hash.links[key] = JSON.stringify({
            typeKey: relationship.type.typeKey,
            key: key
          });
        }

        if (options.array) {
          // Parse will return [null] for empty relationships
          if (hash[key].length && hash[key]) {
            hash[key].forEach(function (item, index, items) {
              // When items are pointers we just need the id
              // This occurs when request was made without the include query param.
              if ('Pointer' === item.__type) {
                items[index] = item.objectId;

              } else {
                // When items are objects we need to clean them and add them to the store.
                // This occurs when request was made with the include query param.
                delete item.__type;
                delete item.className;
                item.id = item.objectId;
                delete item.objectId;
                item.type = relationship.type;
                serializer.normalizeAttributes(relationship.type, item);
                serializer.normalizeRelationships(relationship.type, item);
                store.push(relationship.type, item);
              }
            });
          }
        }
      }
    }, this);

    this._super(type, hash);
  },

  serializeIntoHash: function (hash, type, snapshot, options) {
    console.debug('model serializer:', snapshot.modelName)
    merge(hash, this.serialize(snapshot, options));
  },

  serializeAttribute: function (snapshot, json, key, attribute) {
    // These are Parse reserved properties and we won't send them.
    if ('createdAt' === key ||
      'updatedAt' === key ||
      'emailVerified' === key ||
      'sessionToken' === key
    ) {
      delete json[key];

    } else {
      console.debug('serializing attribute:', key)
      this._super(snapshot, json, key, attribute);
    }
  },

  serializeBelongsTo: function (snapshot, json, relationship) {
    console.debug('serialize belongs to:', JSON.stringify([json, relationship]))
    var key = relationship.key,
      belongsToId = snapshot.belongsTo(key, {
        id: true
      });

    if (belongsToId) {
      json[key] = {
        '__type': 'Pointer',
        'className': this.parseClassName(key),
        'objectId': belongsToId
      };
    }
  },

  parseClassName: function (key) {
    console.debug('parse class name:', key)
    if ('parseUser' === key || 'admin' === key || 'seller' === key || 'buyer' === key) {
      return '_User';

    } else {
      return capitalize(camelize(key));
    }
  },

  serializeHasMany: function (snapshot, json, relationship) {
    console.debug('serialize has many:', JSON.stringify([json, relationship]))
    var key = relationship.key,
      hasMany = snapshot.hasMany(key),
      options = relationship.options,
      _this = this;

    if (hasMany && hasMany.get('length') > 0) {
      json[key] = {
        'objects': []
      };

      if (options.relation) {
        json[key].__op = 'AddRelation';
      }

      if (options.array) {
        json[key].__op = 'AddUnique';
      }

      hasMany.forEach(function (child) {
        json[key].objects.push({
          '__type': 'Pointer',
          'className': _this.parseClassName(child.type.typeKey),
          'objectId': child.attr('id')
        });
      });

      if (hasMany._deletedItems && hasMany._deletedItems.length) {
        if (options.relation) {
          var addOperation = json[key],
            deleteOperation = {
              '__op': 'RemoveRelation',
              'objects': []
            };

          hasMany._deletedItems.forEach(function (item) {
            deleteOperation.objects.push({
              //@ts-ignore
              '__type': 'Pointer',
              //@ts-ignore
              'className': item.type,
              //@ts-ignore
              'objectId': item.id
            });
          });

          json[key] = {
            '__op': 'Batch',
            'ops': [addOperation, deleteOperation]
          };
        }

        if (options.array) {
          json[key].deleteds = {
            '__op': 'Remove',
            'objects': []
          };

          hasMany._deletedItems.forEach(function (item) {
            json[key].deleteds.objects.push({
              '__type': 'Pointer',
              'className': item.type,
              'objectId': item.id
            });
          });
        }
      }

    } else {
      json[key] = [];
    }
  },

  normalizeArrayResponse: function (store, primaryModelClass, payload, id, requestType) {
    console.debug('array response', JSON.stringify(payload))
    let [[payloadKey, _]] = Object.entries(payload)
    let modelName = this.modelNameFromPayloadKey(payloadKey)
    let model = this.store.modelFor(modelName)
    let returnData = {
      data: []
    }


    payload[payloadKey]["results"].map(item => {
      console.debug('data array entry', JSON.stringify(item))
      let entry = this.normalize(model, item)
      console.debug('normalized array entry', JSON.stringify(entry))
      return entry
    }).forEach((item: { data: {} }) => {
      //@ts-ignore
      returnData.data.push(item.data)
    })
    return returnData

  },

  modelNameFromPayloadKey: function (payloadKey: string) {
    console.debug('payload key:', payloadKey)
    let [, , basePath, className,] = payloadKey.split('//')[1].split('/')
    console.debug('basepath:', basePath, " | classname:", className)
    switch (basePath) {
      case 'users':
        return 'parse-user'
      case 'login':
        return 'parse-user'
      case 'signup':
        return 'parse-user'
      case 'classes':
        return className.toLowerCase()
      default:
        return
    }
  }

});

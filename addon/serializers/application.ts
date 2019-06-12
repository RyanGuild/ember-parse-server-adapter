import DS from 'ember-data'
import Parse from 'parse'
import {capitalize, camelize, dasherize} from '@ember/string'
import config from 'ember-get-config'
import {computed} from '@ember/object' 
import RSVP from 'rsvp';
import { normalize } from 'path';

export default DS.Serializer.extend({
    primaryKey: 'objectId',
    keyMappings: computed(() => {
        return config.APP.keyMapping
    }),


    //================NORMALIZATION=============================

    normalizeResponse(store :DS.Store, primaryModelClass :DS.Model, payload :Parse.Object|Array<Parse.Object>, id :String|Number, requestType :String){
        if(payload.hasOwnProperty(0)){
            let data = {
                data: this.normalizeArrayResponse(store, primaryModelClass, payload, id, requestType),
                meta:[]
            }
            this.store.push(data)
            return data
        } else {
            let data = {
                data:this.normalize(primaryModelClass, payload),
                meta:[]
            }
            this.store.push(data)
            return data
        }
    },



    normalizeArrayResponse(store :DS.Store, primaryModelClass :DS.Model, payload :Parse.Object[], id :String|Number, requestType :String){
        return payload.map(item => this.normalize(primaryModelClass, item))
    },



    normalize(typeClass :DS.Model, hash :Parse.Object){
        let data = {
            id: hash.id,
            type: this.emberClassName(hash.className),
            attributes:{},
            relationships:{}
        }

        //@ts-ignore
        typeClass.eachAttribute((key, meta) => {
            data.attributes[key] = hash.get(key)
        })
        typeClass.eachRelationship((key, meta) => {
            if(!data.relationships[key]) data.relationships[key] = []
            if(hash.get(key)){
                let entry = {id:hash.get(key).id, type: this.emberClassName(hash.className)}
                data.relationships[key].push(entry)
            }
        })
        return data
    },




    //====================SERIALIZATION=====================


    serialize(snapshot :DS.Snapshot, options :Object ){


        let name = this.parseClassName(snapshot.modelName)
        let adapter = this.store.adapterFor(name)
        let objModel = Parse.Object.extend(name)
        let obj


        if(snapshot.id && snapshot.id != null){
            let query = new Parse.Query(objModel)
            obj = query.get(snapshot.id)
        } else {
            obj = new objModel()
        }
        snapshot.eachAttribute(function (key, meta){
            obj.set(key, snapshot.attr(key))
        })
        //@ts-ignore
        snapshot.eachRelationship(async (key, meta) => {
        try{
            let val = snapshot.attr(key)
            var prtType = this.get('keyMappings')[key]
            var ptr :Parse.Object = Parse.Object.extend(prtType)
            //@ts-ignore
            var query = new Parse.Query(ptr)
            let queryPtr = await query.get()


            console.warn(queryPtr)
            switch (meta.kind){
                case 'belongsTo':
                    obj.set(key, queryPtr)
                    break;
            
                case 'hasMany':
                    if(!obj.get(key)) obj.set(key, [])
                    obj.set(key, obj.get(key).push(queryPtr))
                    break
            
                default:
                    break;
            }

        } catch {
                
        }
        })
        return obj
    },


    //================HELPERS==============================


    parseClassName(type): String {
        if ('parseUser' === type || 'admin' === type || 'seller' === type || 'buyer' === type) {
            return '_User';
        } else {
            return capitalize(camelize(type));
        }
    },
    emberClassName(key) {
        let name = key === '_User' ? 'parse-user' : Ember.String.dasherize(key)
        console.debug('type for root', name);
        return name
    }
})
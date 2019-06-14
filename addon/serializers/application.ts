import DS from 'ember-data'
import Parse from 'parse'
import {capitalize, camelize, dasherize} from '@ember/string'
import config from 'ember-get-config'
import {computed, default as emberObject} from '@ember/object' 
import RSVP, { async, reject } from 'rsvp';
import {A} from '@ember/array'
import { resolve } from 'url';
import SyncPromise from 'sync-promise'

export default DS.Serializer.extend({
    primaryKey: 'objectId',
    keyMappings: computed(() => {
        return config.APP.keyMapping
    }),


    //================NORMALIZATION=============================

    normalizeResponse(store :DS.Store, primaryModelClass :DS.Model, payload :Parse.Object|Array<Parse.Object>, id :String|Number, requestType :String){
        if(Array.isArray(payload)){
            let data = {
                data: this.normalizeArrayResponse(store, primaryModelClass, payload, id, requestType),
                meta:[]
            }
            return data
        } else if (payload){
            let data = {
                data:this.normalize(primaryModelClass, payload),
                meta:[]
            }
            return data
        } else{
            return null
        }
    },



    normalizeArrayResponse(store :DS.Store, primaryModelClass :DS.Model, payload :Parse.Object[], id :String|Number, requestType :String){
        return payload.map(item => this.normalize(primaryModelClass, item))
    },



    normalize(typeClass :DS.Model, hash :Parse.Object){
        if(!hash) return {}

        let data = {
            id: hash.id,
            type: this.emberClassName(hash.className),
            attributes:{},
            relationships:{}
        }

        //@ts-ignore
        typeClass.eachAttribute((modelKey, meta) => {
            let emberAttr
            if(hash.get(modelKey) != null && hash.get(modelKey) != undefined){
            switch(modelKey){
                case 'location':
                    emberAttr = emberObject.create({
                        latitude: hash.get('location').latitude,
                        longitude: hash.get('location').longitude
                        })
                    break;

                case 'profilePhoto':
                    emberAttr = emberObject.create({
                        url: hash.get(modelKey).url(),
                        name: hash.get(modelKey).name()
                    })
                    break;

                case 'images':
                    emberAttr = A([])
                    hash.get(modelKey).map((item :Parse.File) => {
                        return emberObject.create({
                            url: item.url(),
                            name: item.name(),
                        })
                    }).forEach(item => {
                        emberAttr.pushObject(item)
                    })
                    break;

                default:
                    emberAttr = hash.get(modelKey)
                    break;
            }
            data.attributes[modelKey] = emberAttr
        }})
        typeClass.eachRelationship((modelKey, meta) => {
            if(!data.relationships[modelKey]) data.relationships[modelKey] = []
            if(hash.get(modelKey)){
                let entry = {id:hash.get(modelKey).id, type: this.emberClassName(modelKey)}
                data.relationships[modelKey].push(entry)
            }
        })
        return data
    },




    //====================SERIALIZATION=====================


    serialize(snapshot :DS.Snapshot, options: any){
        let name = this.parseClassName(snapshot.modelName)
        let adapter = this.store.adapterFor(name)
        let objModel = Parse.Object.extend(name)
        var ParseObject = new objModel()


        if(options && options.includeId) ParseObject.id = snapshot.id

        //TRANSFORM ATTRIBUTES

        snapshot.eachAttribute(function (modelKey, meta){
            switch(modelKey){
                case 'location':
                    if (snapshot.attr('location'))
                        ParseObject.set(modelKey,
                            new Parse.GeoPoint(snapshot.attr('location').get('latitude'),
                             snapshot.attr('location').get('longitude'))
                        )
                    break;

                case 'profilePhoto':
                    if (snapshot.attr(modelKey)){
                        let file = new Parse.File(
                            snapshot.attr(modelKey).get('name'),
                            null,
                            snapshot.attr(modelKey).get('type')
                        )
                        file.url = snapshot.attr(modelKey).get('url')
                        ParseObject.set(modelKey, file)
                    }
                    break;

                case 'images':
                    try{
                        if(!snapshot.attr(modelKey)) {
                            ParseObject.set(modelKey, [])
                            break;
                        }
                        snapshot.attr(modelKey).toArray().forEach(item => {
                            let file = new Parse.File(
                                item.get('name'), 
                                null, 
                                item.get('type')
                            )
                            file.url = item.get('url')
                            ParseObject.set(modelKey, ParseObject.get(modelKey).push(file))
                            
                        })
                    } catch (e){
                        console.error(e)
                        break;
                    }
                    break;

                default:
                    ParseObject.set(modelKey, snapshot.attr(modelKey))
                    break;

            }
        })
        // TRANSFORM RELATIONSHIPS
        //@ts-ignore
        snapshot.eachRelationship((modelKey, meta) => {
            switch (meta.kind){
                case 'belongsTo':
                    if(!snapshot.belongsTo(modelKey)) break;    
                    //@ts-ignore
                    let dataID = snapshot.belongsTo(modelKey).id
                    let parsePointer = Parse.Object.createWithoutData(dataID)
                    parsePointer.className = this.parseClassName(modelKey)
                    ParseObject.set(modelKey, parsePointer)
                    break;
                    
                case 'hasMany':
                    if(!snapshot.hasMany(modelKey)) break;  
                    let data = snapshot.hasMany(modelKey)
                    if(!data) break;
                    let parsePointers = data.map((entry) => {
                        let valuePtr = Parse.Object.createWithoutData(entry.id)
                        valuePtr.className = this.parseClassName(entry.modelName)
                        return valuePtr
                    })
                    ParseObject.set(modelKey, parsePointers)
                    break;
    
                default:
                    break;
            }
        })
        return ParseObject
    },


    //================HELPERS==============================


    parseClassName(type): String {
        if ('parse-user' === type || 'admin' === type || 'seller' === type || 'buyer' === type) {
            return '_User';
        } else {
            return capitalize(camelize(type));
        }
    },
    emberClassName(modelKey) {
        if(!modelKey) return ""
        let name = (modelKey === '_User' || modelKey === 'admin' || modelKey === 'seller' || modelKey === 'buyer') ? 'parse-user' : dasherize(modelKey)
        return name
    }
})





function* doAsync(fn){
    
}
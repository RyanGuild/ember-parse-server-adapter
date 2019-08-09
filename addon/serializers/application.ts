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
            switch(meta.kind){
                case 'hasMany':
                    if(!data.relationships[modelKey]) data.relationships[modelKey] = {data:[]}
                    if(hash.get(modelKey)){
                        hash.get(modelKey).forEach(item => { 
                            let entry = {id:item.id, type: this.emberClassName(modelKey)}
                            data.relationships[this.emberKeyFilters(modelKey, hash)].data.push(entry)
                        })
                    }
                    break;
                case 'belongsTo':
                    if(hash.get(modelKey)){
                        let entry = {id: hash.get(modelKey).id, type: this.emberClassName(modelKey)}
                        data.relationships[this.emberKeyFilters(modelKey, hash)] = {data: entry}
                        }
                    break;
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
                            snapshot.attr(modelKey).get('name').split('_')[-1],
                            {uri: snapshot.attr(modelKey).get('url')}
                        )
                        ParseObject.set(modelKey, file)
                    }
                    break;

                case 'images':
                    try{
                        if(!ParseObject.get(modelKey) || ((typeof ParseObject.get(modelKey)) != 'object')) {
                            ParseObject.set(modelKey, [])
                            break;
                        }
                        if (snapshot.attr(modelKey)){
                            let images = snapshot.attr(modelKey).toArray().map(item => {
                                return new Parse.File(
                                    item.get('name').split('_')[-1],
                                    {uri: item.get('url')}
                                )
                            })
                            ParseObject.set(modelKey,images)
                        }
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
                    ParseObject.set(this.parseKeyFilters(modelKey, snapshot), parsePointer)
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
                    ParseObject.set(this.parseKeyFilters(modelKey, snapshot), parsePointers)
                    break;
    
                default:
                    break;
            }
        })
        return ParseObject
    },


    //================HELPERS==============================

    parseKeyFilters(modelKey: string, snapshot :DS.Snapshot):String{
        if(snapshot.modelName === 'parse-user' && modelKey === 'salePoint'){
            return 'salePoints'
        } else {
            return modelKey
        }
    },

    emberKeyFilters(modelKey:string, hash :Parse.Object){
        if(hash.className === '_User' && modelKey === 'salePoints'){
            return 'salePoint'
        } else {
            return modelKey
        }
    },

    parseClassName(type): String {
        if ('parse-user' === type || 'admin' === type || 'seller' === type || 'buyer' === type) {
            return '_User';
        }else {
            return capitalize(camelize(type));
        }
    },
    emberClassName(modelKey) {
        if(!modelKey) return ""
        let name
        if(modelKey === '_User' || modelKey === 'admin' || modelKey === 'seller' || modelKey === 'buyer'){
            name = 'parse-user'
        }else if(modelKey === 'products'){
            name = 'product'
        }else {
            name = dasherize(modelKey)
        } 
        return name
    }
})
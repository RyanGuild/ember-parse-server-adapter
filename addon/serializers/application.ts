import DS from 'ember-data'
import Parse from 'parse'
import {capitalize, camelize, dasherize} from '@ember/string'
import config from 'ember-get-config'
import {computed, default as emberObject} from '@ember/object' 
import RSVP from 'rsvp';
import { normalize } from 'path';
import {A} from '@ember/array'

export default DS.Serializer.extend({
    primaryKey: 'objectId',
    keyMappings: computed(() => {
        return config.APP.keyMapping
    }),


    //================NORMALIZATION=============================

    normalizeResponse(store :DS.Store, primaryModelClass :DS.Model, payload :Parse.Object|Array<Parse.Object>, id :String|Number, requestType :String){
        if(typeof payload === 'object' && payload.hasOwnProperty(0)){
            let data = {
                data: this.normalizeArrayResponse(store, primaryModelClass, payload, id, requestType),
                meta:[]
            }
            this.store.push(data)
            return data
        } else if (!!payload){
            let data = {
                data:this.normalize(primaryModelClass, payload),
                meta:[]
            }
            this.store.push(data)
            return data
        } else{
            return null
        }
    },



    normalizeArrayResponse(store :DS.Store, primaryModelClass :DS.Model, payload :Parse.Object[], id :String|Number, requestType :String){
        return payload.map(item => this.normalize(primaryModelClass, item))
    },



    normalize(typeClass :DS.Model, hash :Parse.Object){
        console.debug('serializing:',hash)
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
                        url: hash.get(modelKey).url,
                        name: hash.get(modelKey).name
                    })
                    break;

                case 'images':
                    if (!emberAttr.get(modelKey)) emberAttr = A([])
                    hash.get(modelKey).map(item => {
                        return emberObject.create({
                            url: item.url,
                            name: item.name
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


    serialize(snapshot :DS.Snapshot, options :Object ){


        let name = this.parseClassName(snapshot.modelName)
        let adapter = this.store.adapterFor(name)
        let objModel = Parse.Object.extend(name)
        let emberObject

        //RETRIEVE OBJECT

        if(snapshot.id && snapshot.id != null){
            let query = new Parse.Query(objModel)
            emberObject = query.get(snapshot.id)
        } else {
            emberObject = new objModel()
        }

        //TRANSFORM ATTRIBUTES

        snapshot.eachAttribute(function (modelKey, meta){
            switch(modelKey){
                case 'location':
                    emberObject.set(modelKey,
                        new Parse.GeoPoint(snapshot.attr('location').get('latitude'),
                         snapshot.attr('location').get('longitude'))
                    )
                    break;

                case 'profilePhoto':
                    let file = new Parse.File(
                        snapshot.attr(modelKey).get('name'),
                        null,
                        snapshot.attr(modelKey).get('type')
                    )
                    file.url = snapshot.attr(modelKey).get('url')
                    emberObject.set(modelKey, file)
                    break;

                case 'images':
                    if (!emberObject.get(modelKey)) emberObject.set(modelKey, [])
                    emberObject.get(modelKey).forEach(item => {
                        let file = new Parse.File(snapshot.attr(modelKey).get('name'), null, snapshot.attr(modelKey).get('type'))
                        file.url = snapshot.attr(modelKey).get('url')
                        emberObject.set(modelKey, emberObject.get(modelKey).push(file))
    
                    })
                    break;

                default:
                    emberObject.set(modelKey, snapshot.attr(modelKey))
                    break;

            }
        })

        // TRANSFORM RELATIONSHIPS

        //@ts-ignore
        snapshot.eachRelationship(async (modelKey, meta) => {

        try{
            var prtType = this.get('keyMappings')[modelKey]
            var ptr :Parse.Object = Parse.Object.extend(prtType)
            //@ts-ignore
            var query = new Parse.Query(ptr)
            let queryPtr = await query.get()

            switch (meta.kind){
                case 'belongsTo':
                    emberObject.set(modelKey, queryPtr)
                    break;
            
                case 'hasMany':
                    if(!emberObject.get(modelKey)) emberObject.set(modelKey, [])
                    emberObject.set(modelKey, emberObject.get(modelKey).push(queryPtr))
                    break
            
                default:
                    break;
            }

        } catch {
        }
        })
        return emberObject
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
        let name = (modelKey === '_User' || modelKey === 'admin' || modelKey === 'seller' || modelKey === 'buyer') ? 'parse-user' : dasherize(modelKey)
        console.debug('type for root', name);
        return name
    }
})
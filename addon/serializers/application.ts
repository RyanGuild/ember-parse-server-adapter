import DS from 'ember-data'
import Parse from 'parse'
import {capitalize, camelize, dasherize} from '@ember/string'
import config from 'ember-get-config'
import Serializer from '@ember-data/serializer'
import Model from '@ember-data/model'
import Store from '@ember-data/store'

export default class ParseSerializer extends Serializer {
    primaryKey ='objectId'
    keyMappings = config.APP.keyMapping


    //====================SERIALIZATION=====================
    serialize(snapshot :DS.Snapshot, options: any) :any{
        let name = this.parseClassName(snapshot.modelName)
        let objModel = Parse.Object.extend(name)
        var ParseObject = new objModel()


        if(options && options.includeId) 
            ParseObject.id = snapshot.id

        snapshot.eachAttribute((key :string, meta) => {
            console.debug(meta.type)
            switch(meta.type){
                //@ts-ignore
                case 'parse-geo-point':
                    try {
                        let point :{latitude:number, longitude:number} = snapshot.attr(key)
                        ParseObject.set(key, new Parse.GeoPoint({
                            latitude:point.latitude,
                            longitude: point.longitude
                        }))
                    } catch (e){
                        console.debug(e.message)
                        //no-op
                    }
                    break;

                //@ts-ignore
                case 'parse-file':
                    try{
                        let file = snapshot.attr(key) as {name :string; url :string; ptr :Parse.File}
                        if(file && typeof file === 'object' && file.hasOwnProperty("name") && file.hasOwnProperty("url")){
                            let {name, url, ptr } = file
                            if(ptr){
                                ParseObject.set(key, ptr)
                            } else if (name && url){
                                ParseObject.set(key, new Parse.File(name, {uri:url}))
                            }
                        }
                    } catch (err) {
                        console.debug(err)
                        //no-op
                    }
                    break;
                
                //@ts-ignore
                case 'parse-file-array':
                    if(snapshot.attr(key))
                    snapshot
                        .attr(key)
                        .map(file => {
                            try {
                                if(file && typeof file === 'object' && file.hasOwnProperty("name") && file.hasOwnProperty("url")){
                                    let {name, url, ptr } = file
                                    if(ptr){
                                        ParseObject.set(key, ptr)
                                    } else if (name && url) {
                                        ParseObject.set(key, new Parse.File(name, {uri:url}))
                                    }
                                }
                            } catch (err) {
                                console.debug(err)
                                //no-op
                            }
                        })
                    break;

                default:
                    ParseObject.set(key, snapshot.attr(key))
            }
        }, this)

        snapshot.eachRelationship((modelKey, meta) => {
            switch (meta.kind){

                case 'belongsTo':
                    if(!snapshot.belongsTo(modelKey))
                        break;
                    
                    //@ts-ignore
                    let dataID = snapshot.belongsTo(modelKey).id

                    let model = Parse.Object.extend(this.parseClassName(modelKey))
                    let parsePointer = model.createWithoutData(dataID)
                    ParseObject.set(modelKey,parsePointer)
                    break;
                    
                case 'hasMany':

                    if(!snapshot.hasMany(modelKey)) 
                        break;

                    let data = snapshot.hasMany(modelKey)

                    if(!data) 
                        break;

                    let parsePointers = data.map((entry) => {
                        let model = Parse.Object.extend(this.parseClassName(modelKey))
                        let valuePtr = model.createWithoutData(entry.id)
                        return valuePtr
                    })
                    ParseObject.set(modelKey, parsePointers)
                    break;
    
                default:
                    break;
            }
        }, this)

        return ParseObject
    }

    //==================NORMALIZATION===========================

    normalizeResponse(store :Store, primaryModelClass :Model, payload :Parse.Object|Array<Parse.Object>, id :String|Number, requestType :String){
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
    }

    normalizeArrayResponse(store :Store, primaryModelClass :Model, payload :Parse.Object[], id :String|Number, requestType :String){
        return payload.map(item => this.normalize(primaryModelClass, item))
    }

    normalize(typeClass :Model, hash :Parse.Object){
        if(!hash) return {}

        let data = {
            id: hash.id,
            type: this.emberClassName(hash.className),
            attributes:{},
            relationships:{}
        }

        let rawJSON = hash.toJSON()

        Object
            .entries(rawJSON)
            .forEach(([key, value]) => {
                if(typeof value === "object"){
                    if(!value) return

                    if(Array.isArray(value)){
                        this.NormalizeParseArray(data, key, value)
                    }else{
                        this.NormalizeParseObject(data, key, value)
                    }
                } else {
                    data.attributes[key] = value
                }
            })
        return data
    }

    NormalizeParseObject(data: { id: string; type: string; attributes: {}; relationships: {}; }, key: string, value: any) {
        if(value && typeof value === "object" && value.hasOwnProperty("__type")){
            switch(value.__type){
                case 'Date':
                    data.attributes[key] = new Date(value.iso)
                    break;

                case 'Pointer':
                    data.relationships[key] = {data:{type: this.emberClassName(value.className), id: value.objectId}}
                    break;

                case 'File':
                    data.attributes[key] = {name: value.name, url: value.url, ptr:value}
                    break;

                case 'GeoPoint':
                    data.attributes[key] = {latitude: value.latitude, longitude: value.longitude}
                    break;

                default:
                    data.attributes[key] = value
            }
        }
    }

    NormalizeParseArray(data: { id: string; type: string; attributes: {}; relationships: {}; }, key: string, value: any[]) :void {
        let firstEntry = value[0]
        if (firstEntry && typeof firstEntry === 'object' && firstEntry.hasOwnProperty("__type")){
            switch(firstEntry.__type){

                case 'Date':
                    data.attributes[key] = value
                        .map(item => (new Date(item.iso)))
                    break;

                case 'Pointer':
                    data.relationships[key] = {data:[]}
                    value.forEach(item => {
                        data.relationships[key].data
                            .push({type: this.emberClassName(item.className), id: item.objectId})
                    })
                    break;

                case 'File':
                    data.attributes[key] = value
                        .map(item => ({name: item.name, url: item.url, ptr:item}))
                    break;

                case 'GeoPoint':
                    data.attributes[key] = value
                        .map(item => ({latitude: item.latitude, longitude: item.longitude}))
                    break;

                default:
                    data.attributes[key] = value
            }
        } else {
            data.attributes[key] = value
        }
    }


    //================HELPERS==============================

    parseKeyFilters(modelKey: string, className :string) :string{
        if(
            (className === '_User' || className === 'parse-user') &&
            (modelKey === 'salePoint' || modelKey === 'salePoints')
        ){
            return 'salePoints'
        } else if(
            (className === 'CartOrder' || className === 'cart-order') && 
            (modelKey === 'orderItem' || modelKey === 'orderItems')
        ){
            return 'orderItems'
        } else {
            return modelKey
        }
    }

    emberKeyFilters(modelKey:string, className :string) :string{
        if(
            (className === '_User' || className === 'parse-user') && 
            (modelKey === 'salePoints' || modelKey === 'salePoint')
        ){
            return 'salePoint'
        } else if(
            (className === 'CartOrder' || className === 'cart-order') && 
            (modelKey === 'orderItem' || modelKey === 'orderItems')
        ){
            return 'orderItem'
        } else {
            return modelKey
        }
    }

    parseClassName(type) :string{
        if (
            'parse-user' === type ||
            'admin' === type || 
            'seller' === type || 
            'buyer' === type
        ) {
            return '_User';
        }else {
            return capitalize(camelize(type));
        }
    }
    emberClassName(modelKey :string) :string{
        if(!modelKey) return ""
        if(
            modelKey === '_User' || 
            modelKey === 'admin' || 
            modelKey === 'seller' || 
            modelKey === 'buyer'
        ){
            return 'parse-user'
        }else if(modelKey === 'products'){
            return 'product'
        }else {
            return dasherize(modelKey)
        } 
    }

    
}

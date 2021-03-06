import DS from 'ember-data'
import Parse from 'parse'
import {capitalize, camelize, dasherize} from '@ember/string'
import config from 'ember-get-config'
import {computed, default as emberObject} from '@ember/object' 
import {A} from '@ember/array'
import {inject} from '@ember/service'

export default DS.Serializer.extend({
    router: inject(),
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
                        name: hash.get(modelKey).name(),
                        filePtr: hash.get(modelKey),
                    })
                    break;

                case 'images':
                    emberAttr = A([])
                    hash.get(modelKey).map((item :Parse.File) => {
                        return emberObject.create({
                            url: item.url(),
                            name: item.name(),
                            filePtr: item
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

                    if(!data.relationships[this.emberKeyFilters(modelKey, hash.className)]){ 

                        data.relationships[this.emberKeyFilters(modelKey, hash.className)] = {data:[]}

                    }

                    if(hash.get(this.parseKeyFilters(modelKey, hash.className))){

                        hash.get(this.parseKeyFilters(modelKey, hash.className)).forEach(item => { 

                            let entry = {id:item.id, type: this.emberClassName(modelKey)}
                            data.relationships[this.emberKeyFilters(modelKey, hash.className)].data.push(entry)

                        })
                    }
                    break;


                case 'belongsTo':
                    if(hash.get(this.parseKeyFilters(modelKey, hash.className))){

                        let entry = {

                            id: hash.get(this.parseKeyFilters(modelKey, hash.className)).id,
                            type: this.emberClassName(modelKey)

                        }

                        data.relationships[this.emberKeyFilters(modelKey, hash.className)] = { data: entry}
                    }
                    break;
            }
        })
        return data
    },




    //====================SERIALIZATION=====================


    serialize(snapshot :DS.Snapshot, options: any){
        let name = this.parseClassName(snapshot.modelName)
        let objModel = Parse.Object.extend(name)
        var ParseObject = new objModel()


        if(options && options.includeId) ParseObject.id = snapshot.id

        //TRANSFORM ATTRIBUTES

        snapshot.eachAttribute(function (modelKey, meta){
            switch(modelKey){
                case 'location':
                    if (snapshot.attr('location'))
                        ParseObject.set(
                            modelKey,
                            new Parse.GeoPoint(
                                snapshot
                                    .attr('location')
                                    .get('latitude'),
                                snapshot
                                    .attr('location')
                                    .get('longitude')
                            )
                        )
                    break;

                case 'profilePhoto':
                    if (snapshot.attr(modelKey) && snapshot.attr(modelKey).get('filePtr')){
                        console.debug(
                            snapshot
                            .attr(modelKey)
                            .get('filePtr')
                        )

                        ParseObject.set(
                            modelKey,
                            snapshot
                                .attr(modelKey)
                                .get('filePtr')
                        )
                    }
                    break;

                case 'images':
                    try{
                        if(!ParseObject.get(modelKey) || ((typeof ParseObject.get(modelKey)) != 'object')) {
                            ParseObject.set(modelKey, [])
                            break;
                        }
                        if (snapshot.attr(modelKey)){
                            let files = snapshot
                                .attr(modelKey)
                                .toArray()
                                .map(item => {
                                    return item.get('filePtr')
                                })
                            ParseObject.set(modelKey, files)
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
                    if(!snapshot.belongsTo(this.emberKeyFilters(modelKey, snapshot.modelName)))
                        break;
                    
                    //@ts-ignore
                    let dataID = snapshot
                        .belongsTo(
                            this.emberKeyFilters(modelKey, snapshot.modelName)
                        ).id

                    let parsePointer = Parse
                        .Object
                        .createWithoutData(dataID)

                    parsePointer.className = this.parseClassName(modelKey)

                    ParseObject
                        .set(
                            this.parseKeyFilters(modelKey, snapshot.modelName),
                            parsePointer
                        )

                    break;
                    
                case 'hasMany':

                    if(!snapshot.hasMany(this.emberKeyFilters(modelKey, snapshot.modelName))) 
                        break;

                    let data = snapshot.hasMany(this.emberKeyFilters(modelKey, snapshot.modelName))

                    if(!data) 
                        break;

                    let parsePointers = data.map((entry) => {
                        let valuePtr = Parse
                            .Object
                            .createWithoutData(entry.id)

                        valuePtr.className = this.parseClassName(entry.modelName)
                        return valuePtr
                    })

                    ParseObject.set(this.parseKeyFilters(modelKey, snapshot.modelName), parsePointers)
                    
                    break;
    
                default:
                    break;
            }
        })
        return ParseObject
    },


    //================HELPERS==============================

    parseKeyFilters(modelKey: string, className :string):String{
        if((className === '_User' || className === 'parse-user') && (modelKey === 'salePoint' || modelKey === 'salePoints')){
            return 'salePoints'
        } else if((className === 'CartOrder' || className === 'cart-order') && (modelKey === 'orderItem' || modelKey === 'orderItems')){
            return 'orderItems'
        } else {
            return modelKey
        }
    },

    emberKeyFilters(modelKey:string, className :string){
        if((className === '_User' || className === 'parse-user') && (modelKey === 'salePoints' || modelKey === 'salePoint')){
            return 'salePoint'
        } else if((className === 'CartOrder' || className === 'cart-order') && (modelKey === 'orderItem' || modelKey === 'orderItems')){
            return 'orderItem'
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
    },
    NetworkErrorHandler(errorCode, errorBody){
        switch (errorCode){
            case 209:
                Parse.User.logOut()
                this.router.transitionTo('login');
                return
            default:
                return
        }
    }
})



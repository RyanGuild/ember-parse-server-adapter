import Model from '@ember-data/model'
import Store from '@ember-data/store'
import Parse from 'parse'
import DS from 'ember-data'
import {capitalize, camelize} from '@ember/string'
import config from 'ember-get-config'
import Adapter from '@ember-data/adapter'


export default class ParseServerAdapter extends Adapter {
  host = config.APP.parseUrl || 'http://localhost:1337'
  namespace = config.APP.parseNamespace || 'parse'
  defaultSerializer = '-parse'
  classesPath = config.APP.classesPath || 'classes'
  constHeaders = {
    'X-Parse-Application-Id': config.APP.applicationId,
    'X-Parse-REST-API-Key': config.APP.restApiId
  }
  sessionToken :String = ''

  constructor(){
    super(...arguments)
    Parse.initialize(config.APP.applicationId, config.APP.restAPIKey)
    Parse.serverURL = `${this.host}/${this.namespace}`
  }

  get headers(){
    return {
      ...this.constHeaders,
      'X-Parse-Session-Token': this.sessionToken
    }
  }

  parseQuery(type :Model) :Parse.Query{
    let searchObject = Parse.Object.extend(this.parseClassName(type.modelName))
    return new Parse.Query(searchObject)
  }

  parseObject(snapshot :DS.Snapshot, store) :Parse.Object{
    let serializer = store.serializerFor(snapshot.modelName)
    return serializer.serialize(snapshot, {includeId: true})
  }

  parseClassName(type :string): string {
    if ('parse-user' === type || 'admin' === type || 'seller' === type || 'buyer' === type) {
        return '_User';
    } else {
        return capitalize(camelize(type));
    }
  }

  async findRecord(store:Store, type:Model, id:string, snapshot: DS.Snapshot) :Promise<Parse.Object | undefined> {
    console.debug(`[Parse-Adapter][findRecord]: <${type}:${snapshot.id ? snapshot.id :'undefined'}>`)
    try {
      let query = this.parseQuery(type)
      let data =  await query.get(id)
      let fresh = await data.fetch()
      return fresh
    } catch (e){
      this.networkErrorHandler(e)
      console.error(`Fetch Object Failed: ${e}`)
      return undefined
    } 
  }

  async findAll(store :Store, type:Model, neverSet :undefined, snapshotRecordArray :DS.SnapshotRecordArray<any>) :Promise<Parse.Object[] | undefined> {
    console.debug(`[Parse-Adapter][findAll]: <${type}>`)
    try{
      let query = this.parseQuery(type)
      let data = await query.find()
      let refreshed = []
      for (let record of data){
        //@ts-ignore
        refreshed.push(await record.fetch())
      }
      return refreshed
    }catch(e){
      this.networkErrorHandler(e)
      console.error(`Failed to FindAll: ${e}`)
      return undefined
    }
  }

  async createRecord(store: Store, type:Model, snapshot: DS.Snapshot) :Promise<Parse.Object | undefined> {
    console.debug(`[Parse-Adapter][createRecord]: <${type}>`)
    try {
      let ParseObject = this.parseObject(snapshot, store)
      return await ParseObject.save()
    }catch (e){
      this.networkErrorHandler(e)
      console.error(`Failed to createRecord: ${e}`)
      return undefined
    }
  }

  async updateRecord(store: Store, type:Model, snapshot: DS.Snapshot) :Promise<Parse.Object | undefined>{
    return this.createRecord(store, type, snapshot)
  }

  async deleteRecord(store: Store, type:Model, snapshot: DS.Snapshot) :Promise<void>{
    console.debug(`[Parse-Adapter][deleteRecord]: <${type}:${snapshot.id ? snapshot.id :'undefined'}>`)
    try{
      let ParseQuery = this.parseQuery(snapshot)
      let data = await ParseQuery.get(snapshot.id)
      await data.destroy();
    } catch (e){
      this.networkErrorHandler(e)
      console.error(`"Failed to deleteRecord: ${e}`)
      return undefined
    }
  }

  async query(
    store :Store, 
    type :Model, 
    queryData :any, 
    recordArray :DS.AdapterPopulatedRecordArray<any>
  ):Promise<Parse.Object | Parse.Object[] | undefined> {
    console.debug(`[Parse-Adapter][query]: <${type}>`)
    let ParseQuery = this.parseQuery(type)
    let queryEntries = Object.entries(queryData)

    try {
      for(let [key, value] of queryEntries){
          if(key[0] === '$'){
            let searchPtr = this.parseQuery({modelName: key.slice(1)} as Model)
            //@ts-ignore
            let data = await searchPtr.get(value)
            ParseQuery.equalTo(key.slice(1), data)
          } else {
            ParseQuery.equalTo(key, value)
          }
      }
      return await ParseQuery.find()
    } catch (e){
      this.networkErrorHandler(e)
      console.error(`"Failed to fetch query: ${e}`)
      return undefined
    }
  }

  networkErrorHandler(err){

  }
}
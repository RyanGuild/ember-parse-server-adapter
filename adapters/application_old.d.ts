import DS from 'ember-data';
import RSVP from 'rsvp';
import { ModelRegistry } from 'ember-data/model';
declare const _default: Readonly<typeof DS.RESTAdapter> & (new (properties?: object | undefined) => {
    host: any;
    namespace: any;
    defaultSerializer: string;
    classesPath: string;
    headers: {
        'X-Parse-Application-Id': any;
        'X-Parse-REST-API-Key': any;
    };
    sessionToken: any;
    pathForType(type: any): string;
    parsePathForType(type: any): String;
    /**
     * Because Parse doesn't return a full set of properties on the
     * responses to updates, we want to perform a merge of the response
     * properties onto existing data so that the record maintains
     * latest data.
     */
    createRecord<k extends never>(store: DS.Store, type: ModelRegistry[k], record: DS.Snapshot<k>): RSVP.Promise<any>;
    /**
     * Because Parse doesn't return a full set of properties on the
     * responses to updates, we want to perform a merge of the response
     * properties onto existing data so that the record maintains
     * latest data.
     */
    updateRecord<k extends never>(store: DS.Store, type: ModelRegistry[k], record: DS.Snapshot<k>): RSVP.Promise<any>;
    parseClassName(key: any): String;
    /**
     * Implementation of a hasMany that provides a Relation query for Parse
     * objects.
     */
    findHasMany(store: any, record: any, relatedInfo: any): RSVP.Promise<any>;
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
    query: (store: any, type: any, query: any) => RSVP.Promise<{}>;
    findRecord: (store: any, type: any, id: any, snapshot: any) => RSVP.Promise<{}>;
    findAll: (store: any, type: any, sinceToken: any, snapshotRecordArray: any) => RSVP.Promise<{}>;
} & DS.RESTAdapter) & (new (...args: any[]) => {
    host: any;
    namespace: any;
    defaultSerializer: string;
    classesPath: string;
    headers: {
        'X-Parse-Application-Id': any;
        'X-Parse-REST-API-Key': any;
    };
    sessionToken: any;
    pathForType(type: any): string;
    parsePathForType(type: any): String;
    /**
     * Because Parse doesn't return a full set of properties on the
     * responses to updates, we want to perform a merge of the response
     * properties onto existing data so that the record maintains
     * latest data.
     */
    createRecord<k extends never>(store: DS.Store, type: ModelRegistry[k], record: DS.Snapshot<k>): RSVP.Promise<any>;
    /**
     * Because Parse doesn't return a full set of properties on the
     * responses to updates, we want to perform a merge of the response
     * properties onto existing data so that the record maintains
     * latest data.
     */
    updateRecord<k extends never>(store: DS.Store, type: ModelRegistry[k], record: DS.Snapshot<k>): RSVP.Promise<any>;
    parseClassName(key: any): String;
    /**
     * Implementation of a hasMany that provides a Relation query for Parse
     * objects.
     */
    findHasMany(store: any, record: any, relatedInfo: any): RSVP.Promise<any>;
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
    query: (store: any, type: any, query: any) => RSVP.Promise<{}>;
    findRecord: (store: any, type: any, id: any, snapshot: any) => RSVP.Promise<{}>;
    findAll: (store: any, type: any, sinceToken: any, snapshotRecordArray: any) => RSVP.Promise<{}>;
} & DS.RESTAdapter);
export default _default;

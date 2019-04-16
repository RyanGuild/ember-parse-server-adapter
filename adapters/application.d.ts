import DS from 'ember-data';
import RSVP from 'rsvp';
import { ModelRegistry } from 'ember-data/model';
declare const _default: Readonly<typeof DS.RESTAdapter> & (new (properties?: object | undefined) => {
    defaultSerializer: string;
    classesPath: string;
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
    findQuery(store: any, type: any, query: any): any;
} & DS.RESTAdapter) & (new (...args: any[]) => {
    defaultSerializer: string;
    classesPath: string;
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
    findQuery(store: any, type: any, query: any): any;
} & DS.RESTAdapter);
export default _default;

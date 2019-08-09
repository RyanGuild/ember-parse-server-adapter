import DS from 'ember-data';
import Parse from 'parse';
declare const _default: Readonly<typeof DS.RESTSerializer> & (new (properties?: object | undefined) => {
    primaryKey: string;
    typeForRoot: (key: any) => string;
    /**
     * Because Parse only returns the updatedAt/createdAt values on updates
     * we have to intercept it here to assure that the adapter knows which
     * record ID we are dealing with (using the primaryKey).
     */
    extract: (store: any, type: any, payload: Parse.Object, id: any, requestType: any) => any;
    extractAttributes: (modelClass: any, resourceHash: any) => {};
    extractRelationships: (relationshipModelName: any, relationshipHash: any, relationshipOptions: any) => {};
    /**
     * Extracts count from the payload so that you can get the total number
     * of records in Parse if you're using skip and limit.
     */
    extractMeta: (store: any, type: any, payload: any) => void;
    extractId: (modelClass: DS.Model, resourceHash: any) => string | number;
    /**
     * Special handling of the Parse relation types. In certain
     * conditions there is a secondary query to retrieve the "many"
     * side of the "hasMany".
     */
    normalizeRelationships: (type: any, hash: any) => void;
    serializeIntoHash: (hash: any, type: any, snapshot: any, options: any) => void;
    serializeAttribute: (snapshot: any, json: any, key: any, attribute: any) => void;
    serializeBelongsTo: (snapshot: any, json: any, relationship: any) => void;
    parseClassName: (key: any) => string;
    serializeHasMany: (snapshot: any, json: any, relationship: any) => void;
    normalizeArrayResponse: (store: any, primaryModelClass: any, payload: any, id: any, requestType: any) => {
        data: never[];
    };
    modelNameFromPayloadKey: (payloadKey: string) => string | undefined;
} & DS.RESTSerializer) & (new (...args: any[]) => {
    primaryKey: string;
    typeForRoot: (key: any) => string;
    /**
     * Because Parse only returns the updatedAt/createdAt values on updates
     * we have to intercept it here to assure that the adapter knows which
     * record ID we are dealing with (using the primaryKey).
     */
    extract: (store: any, type: any, payload: Parse.Object, id: any, requestType: any) => any;
    extractAttributes: (modelClass: any, resourceHash: any) => {};
    extractRelationships: (relationshipModelName: any, relationshipHash: any, relationshipOptions: any) => {};
    /**
     * Extracts count from the payload so that you can get the total number
     * of records in Parse if you're using skip and limit.
     */
    extractMeta: (store: any, type: any, payload: any) => void;
    extractId: (modelClass: DS.Model, resourceHash: any) => string | number;
    /**
     * Special handling of the Parse relation types. In certain
     * conditions there is a secondary query to retrieve the "many"
     * side of the "hasMany".
     */
    normalizeRelationships: (type: any, hash: any) => void;
    serializeIntoHash: (hash: any, type: any, snapshot: any, options: any) => void;
    serializeAttribute: (snapshot: any, json: any, key: any, attribute: any) => void;
    serializeBelongsTo: (snapshot: any, json: any, relationship: any) => void;
    parseClassName: (key: any) => string;
    serializeHasMany: (snapshot: any, json: any, relationship: any) => void;
    normalizeArrayResponse: (store: any, primaryModelClass: any, payload: any, id: any, requestType: any) => {
        data: never[];
    };
    modelNameFromPayloadKey: (payloadKey: string) => string | undefined;
} & DS.RESTSerializer);
export default _default;
